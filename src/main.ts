import { BearerAuthGuard } from '@libs/middleware/bearer-auth.guard';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { setupSwagger } from 'libs';
import { AppModule } from './app.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ExternalApiModule } from './external-api/external-api.module';
import { GmapsModule } from './gmaps/gmaps.module';
import { LandmarksModule } from './landmarks/landmark.module';
import { MapModule } from './map/map.module';
import { PlaceModule } from './place/place.module';
import { PoiModule } from './poi/poi.module';
import { RatingModule } from './ratings/ratings.module';
import { RoutingModule } from './routing/routing.module';
import { UsersModule } from './users/users.module';
import { WeatherModule } from './weather/weather.module';

export function swaggerCustomScript(endpoint: string, tagOrder?: string[]) {
    return [bootstrap.toString(), `bootstrap(\"${endpoint}\", ${JSON.stringify(tagOrder)})`];
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api');
    app.enableCors();
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );
    const configService = app.get(ConfigService);
    app.useGlobalGuards(new BearerAuthGuard(configService));

    const apiEndpoint = configService.get('SERVER_URL');

    const config = new DocumentBuilder()
        .addServer(apiEndpoint)
        .setTitle('VCOMPGUIDE V1 API Docs')
        .setVersion('1.0')
        .addBearerAuth({ type: 'http', scheme: 'bearer' }, 'bearer')
        .build();

    const { document, tags } = setupSwagger(app, config, {
        include: [
            ChatModule,
            AuthModule,
            ChatbotModule,
            PlaceModule,
            UsersModule,
            RoutingModule,
            MapModule,
            WeatherModule,
            CloudinaryModule,
            ExternalApiModule,
            GmapsModule,
            LandmarksModule,
            PoiModule,
            RatingModule,
        ],
    });

    document.security = [{ bearer: [] }];

    SwaggerModule.setup('api/docs', app, document, {
        customSiteTitle: 'VCOMPGUIDE V1 API Docs',
        jsonDocumentUrl: 'docs-json',
        yamlDocumentUrl: 'docs-yaml',
        customJsStr: swaggerCustomScript(apiEndpoint, tags),
    });

    const nodeEnv = configService.get('NODE_ENV');

    if (nodeEnv === 'production') {
        app.enableShutdownHooks();
    }

    await app.listen(9000);
}
void bootstrap();
