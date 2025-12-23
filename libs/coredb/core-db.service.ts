import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class CoreDbService implements OnApplicationShutdown {
  constructor(@InjectConnection('core') private readonly connection: Connection) {}

  getConnection() {
    return this.connection;
  }

  async onApplicationShutdown() {
    await this.connection.close();
  }
}
