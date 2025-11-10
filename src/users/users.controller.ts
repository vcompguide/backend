import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Endpoints (GET /profile, PUT /profile)

  // GET users/
  @Get()
  findAll() {
    return 'Get all users';
    // return this.usersService.findAll();
  }

  // GET users/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return {userId: 'id'};
    // return this.usersService.findOne(id);
  }

  // POST users/
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
