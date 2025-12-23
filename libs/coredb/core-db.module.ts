import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CoreDbService } from './core-db.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('CORE_DB_URI'),
      }),
      connectionName: 'core',
    }),
  ],
  providers: [CoreDbService],
  exports: [CoreDbService],
})
export class CoreDbModule {}
