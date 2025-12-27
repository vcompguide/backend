import { Module } from '@nestjs/common';
import { ExternalApiModule } from '../external-api/external-api.module';
import { MapService } from './map.service';
import { MapController } from './map.controller';

@Module({
    imports: [ExternalApiModule],
    controllers: [MapController],
    providers: [MapService],
    exports: [MapService],
})
export class MapModule {}
