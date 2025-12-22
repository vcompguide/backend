import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { setupSwagger } from 'libs';
import { SampleModule } from './sample/sample.module';
import { ValidationPipe } from '@nestjs/common';

export function swaggerCustomScript(endpoint: string, tagOrder?: string[]) {
    return [bootstrap.toString(), `bootstrap(\"${endpoint}\", ${JSON.stringify(tagOrder)})`];
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable validation globally
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
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
        include: [SampleModule],
    });

    SwaggerModule.setup('docs', app, document, {
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
