import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({
        description: 'Name of the user',
        type: String,
        example: 'John Doe',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Email of the user',
        type: String,
        example: 'johndoe@email.com',
        required: true,
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Password of the user',
        type: String,
        minLength: 8,
        example: 'secret123',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password: string;

    @ApiProperty({
        description: 'Avatar URL of the user',
        type: String,
        example: 'http://www.image.com/abc',
        required: false,
    })
    @IsOptional()
    @IsString()
    avatarUrl?: string;

    @ApiProperty({
        description: 'Description in profile of the user',
        type: String,
        example: 'Welcome to my profile!',
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;
}
