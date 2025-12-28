import { Module } from '@nestjs/common';
import { ExternalApiModule } from 'src/external-api/external-api.module';
import { OverpassService } from '../external-api/overpass.service';
import { PoiController } from './poi.controller';
import { PoiService } from './poi.service';

@Module({
    imports: [ExternalApiModule],
    controllers: [PoiController],
    providers: [PoiService, OverpassService],
})
export class PoiModule {}
