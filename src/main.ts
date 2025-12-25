import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { setupSwagger } from 'libs';
import { AppModule } from './app.module';
import { PlaceModule } from './place/place.module';
import { ChatbotModule } from './chatbot/chatbot.module';

export function swaggerCustomScript(endpoint: string, tagOrder?: string[]) {
    return [bootstrap.toString(), `bootstrap(\"${endpoint}\", ${JSON.stringify(tagOrder)})`];
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api');

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );

    const configService = app.get(ConfigService);
    const apiEndpoint = configService.get('SERVER_URL');

    const config = new DocumentBuilder()
        .addServer(apiEndpoint)
        .setTitle('VCOMPGUIDE V1 API Docs')
        .setVersion('1.0')
        .build();

    const { document, tags } = setupSwagger(app, config, {
        include: [ChatbotModule, PlaceModule],
    });

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
