import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
    @ApiProperty({
        description: 'Email of the user',
        type: String,
        example: 'johndoe@email.com',
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Password of the user',
        type: String,
        example: 'secret123',
    })
    @IsNotEmpty()
    @IsString()
    password: string;
}
