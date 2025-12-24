import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { GmapsService } from './gmaps.service';
import { OsrmService } from './osrm.service';
import { NominatimService } from './nominatim.service';
import { HuggingFaceService } from './hugging-face.service';

@Global()
@Module({
    imports: [HttpModule, ConfigModule],
    providers: [GmapsService, OsrmService, NominatimService, HuggingFaceService],
    exports: [GmapsService, OsrmService, NominatimService, HuggingFaceService],
})
export class ExternalApiModule {}
