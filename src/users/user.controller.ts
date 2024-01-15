import {
  Controller,
  Get,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './services';

@Controller('api/users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  async getAll() {
    const users = await this.userService.getAll();

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { users },
    };
  }
}