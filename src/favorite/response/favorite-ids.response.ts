import { ApiProperty } from '@nestjs/swagger';

export class FavoriteIdsResponse {
    @ApiProperty({
        description: 'Indicates whether the request was successful',
        type: Boolean,
        example: true,
    })
    success: boolean;

    @ApiProperty({
        description: 'List of favorite place IDs for the user',
        type: [String],
        example: ['676f1a2b3c4d5e6f7a8b9c0d', '676f1a2b3c4d5e6f7a8b9c0e', '676f1a2b3c4d5e6f7a8b9c0f'],
    })
    placeIds: string[];

    @ApiProperty({
        description: 'Total number of favorites',
        type: Number,
        example: 3,
    })
    total: number;

    constructor(data: Partial<FavoriteIdsResponse>) {
        this.success = data.success ?? true;
        this.placeIds = data.placeIds ?? [];
        this.total = data.total ?? 0;
    }
}
