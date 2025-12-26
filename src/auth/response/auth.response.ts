import { ApiProperty } from '@nestjs/swagger';
import { OmitMethod } from '@libs/common/types';

export class AuthResponse {
    @ApiProperty({
        description: 'JWT access token for authentication',
        type: String,
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    access_token: string;

    constructor(data: OmitMethod<AuthResponse>) {
        this.access_token = data.access_token;
    }
}
