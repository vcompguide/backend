import { TransformToArray } from '@libs/common/decorators';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class UpdateFavoritesDto {
    @ApiProperty({
        description: 'User ID to save to favorites',
        type: String,
        example: '676f1a2b3c4d5e6f7a8b9c0f',
        required: true,
    })
    @IsNotEmpty({ message: 'Name ID is required' })
    userId: string;

    @ApiProperty({
        description: 'List of place IDs to save as favorites',
        type: String,
        example: '676f1a2b3c4d5e6f7a8b9c0d, 676f1a2b3c4d5e6f7a8b9c0e, 676f1a2b3c4d5e6f7a8b9c0f',
        required: true,
    })
    @IsArray({ message: 'Place IDs must be an array' })
    @TransformToArray()
    placeIds: string[];
}
