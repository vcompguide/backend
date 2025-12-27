import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { GmapsService } from './gmaps.service';
import { OsrmService } from './osrm.service';
import { NominatimService } from './nominatim.service';
import { OverpassService } from './overpass.service';
import { HuggingFaceService } from './hugging-face.service';

@Global()
@Module({
    imports: [HttpModule, ConfigModule],
    providers: [GmapsService, OsrmService, NominatimService, OverpassService, HuggingFaceService],
    exports: [GmapsService, OsrmService, NominatimService, OverpassService, HuggingFaceService],
})
export class ExternalApiModule {}
