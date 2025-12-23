import { Module } from '@nestjs/common';
import { ExternalApiModule } from 'src/external-api/external-api.module';
import { RoutingController } from './routing.controller';
import { RoutingService } from './routing.service';

@Module({
    imports: [ExternalApiModule],
    controllers: [RoutingController],
    providers: [RoutingService],
})
export class RoutingModule {}
