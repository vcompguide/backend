import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GmapsService } from './gmaps.service';
import { HuggingFaceService } from './hugging-face.service';
import { NominatimService } from './nominatim.service';
import { OsrmService } from './osrm.service';
import { OverpassService } from './overpass.service';

@Global()
@Module({
    imports: [HttpModule, ConfigModule],
    providers: [GmapsService, HuggingFaceService, NominatimService, OsrmService, OverpassService],
    exports: [GmapsService, HuggingFaceService, NominatimService, OsrmService, OverpassService],
})
export class ExternalApiModule {}
