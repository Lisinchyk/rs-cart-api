import { Injectable } from '@nestjs/common';
import { createConnectionClient } from "../../dataBase/createClient";
import {
  CREATE_PRODUCT_IN_CART_QUERY,
  DELETE_CART_ITEM_QUERY,
  GET_CART_ITEM_BY_PRODUCT_ID_QUERY,
  GET_CART_ITEMS_LIST_QUERY,
  GET_CART_LIST_QUERY,
  UPDATE_COUNT_CART_BY_ID_QUERY
} from "../../dataBase/queries";

@Injectable()
export class CartService {
  async findByUserId(userId) {
    try {
      const dbClient = await createConnectionClient();
      const userCart = await dbClient.query(GET_CART_LIST_QUERY, [userId]);

      if (!userCart) {
        console.log('CART LIST did not found');
        throw new Error(`Cart not found`);
      }

      const items = await dbClient.query(GET_CART_ITEMS_LIST_QUERY, [userCart.rows[0].id]);

      return {
        ...userCart.rows[0],
        items: items.rows
      }
    } catch (error) {
      console.log("error", error.message);
    }
  }

  async updateByUserId(userId, item) {
    try {
      const productId = item.product.product_id;
      const dbClient = await createConnectionClient();

      const result = await dbClient.query(GET_CART_ITEM_BY_PRODUCT_ID_QUERY,[productId]);
      const cart = await dbClient.query(GET_CART_LIST_QUERY, [userId]);

      if (result.rows[0]) {
        const updated = await dbClient.query(UPDATE_COUNT_CART_BY_ID_QUERY, [+item.count, productId]);

        return {
          adjustedItem: updated.rows[0],
          cart
        };
      }

      const adjustedItem = await dbClient.query(CREATE_PRODUCT_IN_CART_QUERY, [cart.rows[0].id, productId, item.count]);

      return {
        adjustedItem,
        cart
      };
    } catch (error) {
      console.log("updateCart error", error.message);
      return error.message;
    }
  }

  async removeProductById(productId) {
    try {
      console.log("removeProductById productId", productId);

      const dbClient = await createConnectionClient();
      const response = await dbClient.query(DELETE_CART_ITEM_QUERY, [productId]);

      console.log("response:", response);
    } catch (error) {
      console.log('ERROR: cart was not removed', error);
      return { Error: error };
    }
  }
}
