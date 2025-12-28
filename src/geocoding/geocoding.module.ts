import { Module } from '@nestjs/common';
import { ExternalApiModule } from '../external-api/external-api.module';
import { GeocodingController } from './geocoding.controller';
import { GeocodingService } from './geocoding.service';

@Module({
    imports: [ExternalApiModule],
    controllers: [GeocodingController],
    providers: [GeocodingService],
})
export class GeocodingModule {}
