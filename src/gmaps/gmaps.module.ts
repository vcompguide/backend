import { Module } from '@nestjs/common';
import { GmapsController } from './gmaps.controller';

@Module({
    controllers: [GmapsController],
    providers: [],
})
export class GmapsModule {}
