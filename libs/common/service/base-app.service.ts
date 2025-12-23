import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Injectable()
export abstract class BaseAppService implements OnApplicationBootstrap {
    constructor(private readonly refHost: HttpAdapterHost<any>) {}

    onApplicationBootstrap() {
        const server = this.refHost.httpAdapter.getHttpServer();
        server.keepAliveTimeout = 15_000;
        server.headersTimeout = 20_000;
    }

    abstract getServiceName(): string;

    getStatus() {
        return { service: this.getServiceName(), status: 'Healthy!' };
    }
}
