import {
  Controller,
  Get,
  Delete,
  Put,
  Body,
  Req,
  HttpStatus
} from '@nestjs/common';

import {
  AppRequest,
  getProductIdFromRequest,
  getUserIdFromRequest
} from '../shared';

import { CartService } from './services';

@Controller('api/profile/cart')
export class CartController {
  constructor(
    private cartService: CartService
  ) { }

  @Get("/:userId")
  async findUserCart(@Req() req: AppRequest) {
    const cart = await this.cartService.findByUserId(getUserIdFromRequest(req));

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { cart }
    }
  }

  @Put("/:userId")
  async updateUserCart(@Req() req: AppRequest, @Body() body) {
    try {
      const result = await this.cartService.updateByUserId(getUserIdFromRequest(req), body);

      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: { ...result }
      };
    } catch (error) {
      console.log('Error on controller updateCart: ');
      return { error };
    }
  }

  @Delete("/:productId")
  async removeCartItem(@Req() req: AppRequest) {
    try {
      await this.cartService.removeProductById(getProductIdFromRequest(req));

      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
      }
    } catch (error) {
      console.log('Error on controller clearUserCart:', error);
      return { error };
    }
  }
}
