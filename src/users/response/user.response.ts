import { OmitMethod } from '@libs/common/types';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
    @ApiProperty({
        description: 'Unique identifier of the user',
        type: String,
        example: '507f1f77bcf86cd799439011',
    })
    id: string;

    @ApiProperty({
        description: 'Name of the user',
        type: String,
        example: 'John Doe',
    })
    name: string;

    @ApiProperty({
        description: 'Email of the user',
        type: String,
        example: 'johndoe@email.com',
    })
    email: string;

    @ApiProperty({
        description: 'Avatar URL of the user',
        type: String,
        example: 'http://www.image.com/abc',
        required: false,
    })
    avatarUrl?: string;

    @ApiProperty({
        description: 'Description in profile of the user',
        type: String,
        example: 'Welcome to my profile!',
        required: false,
    })
    description?: string;

    constructor(data: OmitMethod<UserResponse>) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.avatarUrl = data.avatarUrl;
        this.description = data.description;
    }
}

export class UsersResponse {
    @ApiProperty({
        description: 'List of users',
        type: [UserResponse],
    })
    users: UserResponse[];

    constructor(data: OmitMethod<UsersResponse>) {
        this.users = data.users.map((user) => new UserResponse(user));
    }
}
