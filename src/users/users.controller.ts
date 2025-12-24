import { type UserDocument } from '@libs/coredb/schemas/user.schema';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // GET users/
    @Get()
    async findAll() {
        return this.usersService.findAll();
    }

    // GET users/me
    @UseGuards(JwtGuard)
    @Get('me')
    getMe(@GetUser() user: UserDocument) {
        return user;
    }

    // GET users/:id
    @Get(':id')
    async findOneById(@Param('id') id: string) {
        return this.usersService.findOneById(id);
    }

    // POST users/
    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }
}
