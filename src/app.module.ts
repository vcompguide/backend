import { CoreDbModule } from '@libs/coredb';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
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
import { UsersModule } from './users/users.module';
import { ChatbotModule } from './chatbot/chatbot.module';

@Module({
    imports: [
        AuthModule,
        UsersModule,
        LandmarksModule,
        RatingModule,
        ExternalApiModule,
        GmapsModule,
        RoutingModule,
        GeocodingModule,
        ChatbotModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
