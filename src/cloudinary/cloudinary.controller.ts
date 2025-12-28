import {
    BadRequestException,
    Controller,
    FileTypeValidator,
    MaxFileSizeValidator,
    ParseFilePipe,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CloudinaryService } from './cloudinary.service';

@ApiTags('Upload')
@Controller('cloudinary')
export class UploadController {
    constructor(private readonly cloudinaryService: CloudinaryService) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file')) // 'file' is the key in FormData
    @ApiOperation({ summary: 'Upload an image to Cloudinary' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    async uploadImage(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // < 5MB
                    new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }), // Regex to check file extension
                ],
            }),
        )
        file: Express.Multer.File,
    ) {
        // Upload in Cloudinary
        const result = await this.cloudinaryService.uploadImage(file);

        return {
            url: result.secure_url,
            publicId: result.public_id,
        };
    }
}
