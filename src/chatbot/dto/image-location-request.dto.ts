import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ImageLocationRequestDto {
    @ApiProperty({
        description: 'URL of the uploaded image on Cloudinary',
        type: String,
        example: 'https://res.cloudinary.com/demo/image/upload/v1234567890/image-analysis/abc123.jpg',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    imageURL: string;

    @ApiProperty({
        description: 'Additional context or question about the image',
        type: String,
        example: 'Where is this place?',
        required: false,
    })
    @IsOptional()
    @IsString()
    additionalContext?: string;
}
