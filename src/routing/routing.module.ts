import { Module } from '@nestjs/common';
import { RoutingController } from './routing.controller';
import { RoutingService } from './routing.service';
import { ExternalApiModule } from 'src/external-api/external-api.module';

@Module({
    imports: [ExternalApiModule],
    controllers: [RoutingController],
    providers: [RoutingService],
})
export class RoutingModule {}
