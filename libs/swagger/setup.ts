import { INestApplication } from '@nestjs/common';
import { ApplicationConfig, NestContainer } from '@nestjs/core';
import { OpenAPIObject, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import { SwaggerScanner } from '@nestjs/swagger/dist/swagger-scanner';

export function setupSwagger(
    app: INestApplication<any>,
    config: Omit<OpenAPIObject, 'paths'>,
    options?: SwaggerDocumentOptions & {
        secureAllPaths?: boolean;
    },
) {
    const document = SwaggerModule.createDocument(app, config, {
        ...options,
        operationIdFactory: (controllerKey, methodKey, version) => {
            return `${controllerKey}_${methodKey}`;
        },
    });

    if (options?.include) {
        const scanner = new SwaggerScanner();
        const modules = scanner.getModules(
            ((app as any).container as NestContainer).getModules(),
            options.include || [],
        );
        const appConfig = (app as any).config as ApplicationConfig;

        modules.sort(
            (a, b) => (options.include?.indexOf(a.metatype) || 0) - (options.include?.indexOf(b.metatype) || 0),
        );

        const tags = new Set<string>();
        const legacyTags = new Set<string>();

        for (const module of modules) {
            const paths = scanner.scanModuleControllers(module.controllers, undefined, undefined, appConfig);

            for (const path of paths) {
                path.tags?.forEach((tag) => tags.add(String(tag)));
            }
        }

        for (const path of Object.keys(document.paths)) {
            for (const method of Object.keys(document.paths[path] as any)) {
                const operation = (document.paths[path] as any)[method];
                if (options?.secureAllPaths && !operation['security']) {
                    operation['security'] = [{ bearer: [] }];
                }

                if (operation['x-is-legacy']) {
                    operation.tags?.forEach((tag: string) => legacyTags.add(tag));
                    operation.tags = operation.tags.map((tag: string) => `${tag} (Legacy)`);
                }
            }
        }

        const sortedLegacyTags = Array.from(legacyTags)
            .sort((a, b) => {
                const aIndex = Array.from(tags).indexOf(a);
                const bIndex = Array.from(tags).indexOf(b);

                return aIndex - bIndex;
            })
            .map((name) => `${name} (Legacy)`);

        return {
            document,
            tags: Array.from(tags).concat(sortedLegacyTags),
        };
    }
    return {
        document,
    };
}
