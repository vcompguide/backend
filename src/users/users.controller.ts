import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import type { UserDocument } from './schemas/user.schema';

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
