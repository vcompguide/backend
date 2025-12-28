import { ApiProperty } from '@nestjs/swagger';

export class UpdateFavoriteResponse {
    @ApiProperty({
        description: 'Indicates whether the operation was successful',
        type: Boolean,
        example: true,
    })
    success: boolean;

    @ApiProperty({
        description: 'Success or error message',
        type: String,
        example: 'Favorites saved successfully',
    })
    message: string;

    @ApiProperty({
        description: 'Total number of favorites after the operation',
        type: Number,
        example: 5,
    })
    count: number;

    constructor(data: Partial<UpdateFavoriteResponse>) {
        this.success = data.success ?? true;
        this.message = data.message ?? '';
        this.count = data.count ?? 0;
    }
}
