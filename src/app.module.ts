import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ExternalApiModule } from './external-api/external-api.module';
import { GmapsModule } from './gmaps/gmaps.module';
import { LandmarksModule } from './landmarks/landmark.module';
import { PlaceModule } from './place/place.module';
import { RatingModule } from './ratings/ratings.module';
import { RoutingModule } from './routing/routing.module';
import { GeocodingModule } from './geocoding/geocoding.module';
import { PoiModule } from './poi/poi.module';
import { UsersModule } from './users/users.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { MapModule } from './map/map.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env.local', '.env'],
            isGlobal: true,
        }),
        AuthModule,
        ChatbotModule,
        ExternalApiModule,
        GmapsModule,
        LandmarksModule,
        PlaceModule,
        RatingModule,
        GeocodingModule,
        RoutingModule,
        PoiModule,
        MapModule,
        UsersModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
