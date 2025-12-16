import { Global, Module } from '@nestjs/common';
import { GmapsService } from './gmaps.service';
import { OsrmService } from './osrm.service';

@Global()
@Module({
  providers: [GmapsService, OsrmService],
  exports: [GmapsService, OsrmService],
})
export class ExternalApiModule {}
