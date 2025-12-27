import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto';
import { LoginUserDto } from './dto';
import { AuthResponse } from './response';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // POST api/auth/signup
    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Register a new user',
        description: 'Create a new user account and return a JWT access token',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'User registered successfully',
        type: AuthResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid input data',
    })
    async signup(@Body() dto: CreateUserDto): Promise<AuthResponse> {
        return this.authService.signup(dto);
    }

    // POST api/auth/signin
    @Post('signin')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Sign in with email and password',
        description: 'Authenticate user and return a JWT access token',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User authenticated successfully',
        type: AuthResponse,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Invalid credentials',
    })
    async signin(@Body() dto: LoginUserDto): Promise<AuthResponse> {
        return this.authService.signin(dto);
    }
}
