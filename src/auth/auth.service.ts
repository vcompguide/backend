import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto';
import { AuthResponse } from './response';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async signup(dto: CreateUserDto): Promise<AuthResponse> {
        const user = await this.usersService.create(dto);

        return this.signToken(user.id, user.email);
    }

    async signin(dto: LoginUserDto): Promise<AuthResponse> {
        const user = await this.usersService.findOneByEmail(dto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordMatching = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordMatching) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.signToken(user.id, user.email);
    }

    private async signToken(userId: string, email: string): Promise<AuthResponse> {
        const payload = {
            sub: userId,
            email,
        };

        const access_token = await this.jwtService.signAsync(payload, {
            expiresIn: '15m',
            secret: this.configService.get<string>('JWT_SECRET'),
        });

        return new AuthResponse({ access_token });
    }
}
