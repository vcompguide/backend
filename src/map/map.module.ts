import { Module } from '@nestjs/common';
import { ExternalApiModule } from '../external-api/external-api.module';
import { MapController } from './map.controller';
import { MapService } from './map.service';

@Module({
    imports: [ExternalApiModule],
    controllers: [MapController],
    providers: [MapService],
    exports: [MapService],
})
export class MapModule {}
