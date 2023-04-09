import { Injectable } from '@nestjs/common';

import { createConnectionClient } from "../../dataBase/createClient";
import {
  CREATE_ORDER_QUERY,
  DELETE_ORDER_QUERY,
  GET_ORDER_BY_ID_QUERY,
  GET_ORDERS_LIST_QUERY,
  UPDATE_ORDER_STATUS_QUERY
} from "../../dataBase/queries";

@Injectable()
export class OrderService {
  async findOrders(userId: string) {
    try {
      const dbClient = await createConnectionClient();
      const orders = await dbClient.query(GET_ORDERS_LIST_QUERY, [userId]);

      if (orders?.rows?.length < 1) {
        throw new Error('orders did not found');
      }

      return orders.rows;
    } catch (error) {
      console.log('Error on service OrderService - findOrders:', error);
      return {
        Error: error
      };
    }
  };

  async findById(orderId: string) {
    try {
      const dbClient = await createConnectionClient();
      return await dbClient.query(GET_ORDER_BY_ID_QUERY, [orderId]);
    } catch (error) {
      console.log('Error on service OrderService - findById:', error);
      return {
        Error: error
      };
    }
  };

  async create(data: any) {
    try {
      const { user_id, cart_id, payment, delivery, comments, status, total, items } = data;
      const dbClient = await createConnectionClient();
      const req = [user_id, cart_id, payment, delivery, comments, status, total, items];

      return await dbClient.query(CREATE_ORDER_QUERY, [...req]);
    } catch (error) {
      console.log('Error on service OrderService - create:', error);
      return {
        Error: error
      };
    }
  };

  async update(orderId, data) {
    try {
      if (!await this.findById(data.id)) {
        throw new Error(`Order #${data.id} does not exist!`);
      }

      const dbClient = await createConnectionClient();

      const updated = await dbClient.query(UPDATE_ORDER_STATUS_QUERY, [data.status, orderId]);

      return { updated };
    } catch (error) {
      console.log('Error on service OrderService - update:', error);
      return {
        Error: error
      };
    }
  };

  async delete(orderId: string) {
    try {
      const dbClient = await createConnectionClient();
      const result = await dbClient.query(DELETE_ORDER_QUERY, [orderId]);

      console.log("createConnectionClient delete result", result);
    } catch (error) {
      console.log('Error on service OrderService - delete:', error);
      return {
        Error: error
      };
    }
  };
}
