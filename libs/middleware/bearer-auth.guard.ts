import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class BearerAuthGuard implements CanActivate {
    constructor(private configService: ConfigService) {}

    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest<Request>();

        const path = req.path || req.url;

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException('Missing Authorization header');
        }

        const [scheme, token] = authHeader.split(' ');

        if (scheme !== 'Bearer' || !token) {
            throw new UnauthorizedException('Invalid Authorization format');
        }

        if (token === this.configService.get('LOCAL_AUTHENTICATION_KEY')) {
            return true;
        }

        throw new UnauthorizedException('Invalid token');
    }
}
