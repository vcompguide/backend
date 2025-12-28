import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { ExternalApiModule } from './external-api/external-api.module';
import { FavoriteModule } from './favorite/favorite.module';
import { GeocodingModule } from './geocoding/geocoding.module';
import { GmapsModule } from './gmaps/gmaps.module';
import { LandmarksModule } from './landmarks/landmark.module';
import { MapModule } from './map/map.module';
import { PlaceModule } from './place/place.module';
import { PoiModule } from './poi/poi.module';
import { RoutingModule } from './routing/routing.module';
import { SavedRouteModule } from './savedRoute/saved-route.module';
import { UsersModule } from './users/users.module';
import { WeatherModule } from './weather/weather.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env.local', '.env'],
            isGlobal: true,
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('CORE_DB_URI') || '',
            }),
            inject: [ConfigService],
        }),
        AuthModule,
        ChatModule,
        FavoriteModule,
        ChatbotModule,
        ExternalApiModule,
        GmapsModule,
        LandmarksModule,
        PlaceModule,
        WeatherModule,
        GeocodingModule,
        RoutingModule,
        PoiModule,
        MapModule,
        UsersModule,
        SavedRouteModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
