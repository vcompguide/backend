import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GmapsService } from './gmaps.service';
import { OsrmService } from './osrm.service';
import { NominatimService } from './nominatim.service';

@Global()
@Module({
    imports: [HttpModule],
    providers: [GmapsService, OsrmService, NominatimService],
    exports: [GmapsService, OsrmService, NominatimService],
})
export class ExternalApiModule {}
