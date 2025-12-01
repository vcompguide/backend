import { Global, Module } from "@nestjs/common";
import { GmapsService } from "./gmaps.service";

@Global()
@Module({
    providers: [GmapsService],
    exports: [GmapsService],
})
export class ExternalApiModule {}
