import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SampleModule } from './sample/sample.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LandmarksModule } from './landmarks/landmark.module';
import { RatingModule } from './ratings/ratings.module';
import { ExternalApiModule } from './external-api/external-api.module';
import { GmapsModule } from './gmaps/gmaps.module';
import { RoutingModule } from './routing/routing.module';
import { WeatherModule } from './weather/weather.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env.local', '.env'],
            isGlobal: true,
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('MONGODB_URI'),
            }),
        }),
        SampleModule,
        AuthModule,
        UsersModule,
        LandmarksModule,
        RatingModule,
        ExternalApiModule,
        GmapsModule,
        RoutingModule,
        WeatherModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
