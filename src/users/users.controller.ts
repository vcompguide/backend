import { type UserDocument } from '@libs/coredb/schemas/user.schema';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CreateUserDto } from './dto';
import { UserResponse } from './response';
import { UsersService } from './users.service';

@ApiTags('User')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // GET api/users/
    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get all users in the database',
        description: 'Find all users in the database without any filter',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get all users successfully',
        type: [UserResponse],
    })
    async findAll(): Promise<UserResponse[]> {
        return this.usersService.findAll();
    }

    // GET api/users/me
    @UseGuards(JwtGuard)
    @Get('me')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get current authenticated user',
        description: 'Get the profile of the currently authenticated user from JWT token',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User profile retrieved successfully',
        type: UserResponse,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'User is not authenticated',
    })
    getMe(@GetUser() user: UserDocument): UserResponse {
        return new UserResponse({
            id: user.id,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl,
            description: user.description,
        });
    }

    // GET api/users/:id
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get a user by ID',
        description: 'Find a specific user by their unique identifier',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User found successfully',
        type: UserResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'User not found',
    })
    async findOneById(@Param('id') id: string): Promise<UserResponse> {
        return this.usersService.findOneById(id);
    }

    // POST api/users/
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Create a new user',
        description: 'Create a new user account with the provided information',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'User created successfully',
        type: UserResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid input data',
    })
    async create(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
        return this.usersService.create(createUserDto);
    }
}
