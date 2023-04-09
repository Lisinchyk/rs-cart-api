import {
  Controller,
  Get,
  Delete,
  Put,
  Body,
  Req,
  Post,
  HttpStatus
} from '@nestjs/common';

import {
  AppRequest,
  getUserIdFromRequest
} from '../shared';
import { OrderService } from "./services";

@Controller('orders')
export class OrderController {
  constructor(
    private orderService: OrderService
  ) {}

  @Get('order/:id')
  async findById(@Req() req: AppRequest) {
    try {
      const orders = await this.orderService.findById(req.params.id);
      const { id, cart_id, delivery, comment, items, status } = orders.rows[0];
      const address = { ...delivery, comment };

      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: {
          id,
          cart_id,
          address,
          items,
          statusHistory: [{
            status,
            timestamp: 1,
            comment: 'comment'
          }],
        },
      };
    } catch (error) {
      console.log('Error on controller OrderController - findById:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message
      };
    }
  }

  @Get(':userId')
  async findOrders(@Req() req: AppRequest) {
    try {
      const orders = await this.orderService.findOrders(getUserIdFromRequest(req));

      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: orders.map(({ id, cart_id, delivery, comment, items, status }) => {
          const address = { ...delivery, comment };

          return {
            id,
            cart_id,
            address,
            items,
            statusHistory: [{
              status,
              timestamp: 1,
              comment: 'comment'
            }],
          };
        })
      };
    } catch (error) {
      console.log('Error on controller OrderController - findOrders:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message
      };
    }
  }

  @Post(':userId')
  async create(@Req() req: AppRequest, @Body() body) {
    try {
      const order = {
        user_id: getUserIdFromRequest(req),
        cart_id: body.cart_id,
        payment: { pay: '0' },
        delivery: { ...body.address },
        comments: body.address.comment,
        status: 'ORDERED',
        total: 0,
        items: JSON.stringify(body.items),
      };

      const createdOrder = await this.orderService.create(order);

      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: { order: createdOrder }
      };
    } catch (error) {
      console.log('Error on controller OrderController - create:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message
      };
    }
  }

  @Put('order/:id/status')
  async update(@Req() req, @Body() body) {
    try {
      await this.orderService.update(req.params.id, body)
      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
      };
    } catch (error) {
      console.log('Error on controller OrderController - update:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message
      };
    }
  }

  @Delete('delete/:id')
  async delete(@Req() req: AppRequest) {
    try {
      await this.orderService.delete(req.params.id);
      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
      };
    } catch (error) {
      console.log('Error on controller OrderController - delete:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message
      };
    }
  }
}