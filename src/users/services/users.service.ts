import { Injectable } from '@nestjs/common';

import { v4 } from 'uuid';

import { User } from '../models';
import { createConnectionClient } from "../../dataBase/createClient";
import { GET_USER_QUERY } from "../../dataBase/queries";

@Injectable()
export class UsersService {
  private readonly users: Record<string, User>;

  constructor() {
    this.users = {}
  }

  async getAll() {
    try {
      const dbClient = await createConnectionClient();
      return await dbClient.query(GET_USER_QUERY);
    } catch (error) {
      console.log(`error on UsersService - getAll:`, error);
      return {
        Error: error
      };
    }
  }

  findOne(userId: string): User {
    return this.users[ userId ];
  }

  createOne({ name, password }: User): User {
    const id = v4(v4());
    const newUser = { id: name || id, name, password };

    this.users[ id ] = newUser;

    return newUser;
  }
}
