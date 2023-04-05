import { Injectable } from '@nestjs/common';

import { v4 } from 'uuid';

import { Cart } from '../models';
import { createConnectionClient } from "../../dataBase/createClient";
import {
  GET_CART_ITEMS_LIST_QUERY,
  GET_CART_LIST_QUERY
} from "../../dataBase/queries";

@Injectable()
export class CartService {
  private userCarts: Record<string, Cart> = {};

  async getUserCarts(userId) {
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

  findByUserId(userId) {
    return this.userCarts[ userId ];
  }

  createByUserId(userId: string) {
    const id = v4(v4());
    const userCart = {
      id,
      items: [],
    };

    this.userCarts[ userId ] = userCart;

    return userCart;
  }

  findOrCreateByUserId(userId: string): Cart {
    const userCart = this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  updateByUserId(userId: string, { items }: Cart): Cart {
    const { id, ...rest } = this.findOrCreateByUserId(userId);

    const updatedCart = {
      id,
      ...rest,
      items: [ ...items ],
    }

    this.userCarts[ userId ] = { ...updatedCart };

    return { ...updatedCart };
  }

  removeByUserId(userId): void {
    this.userCarts[ userId ] = null;
  }

}
