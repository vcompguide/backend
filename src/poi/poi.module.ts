import { Module } from '@nestjs/common';
import { PoiController } from './poi.controller';
import { PoiService } from './poi.service';
import { OverpassService } from '../external-api/overpass.service';
import { ExternalApiModule } from 'src/external-api/external-api.module';

@Module({
    imports: [ExternalApiModule],
    controllers: [PoiController],
    providers: [PoiService],
})
export class PoiModule {}
