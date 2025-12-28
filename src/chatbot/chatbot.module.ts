import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { ExternalApiModule } from 'src/external-api/external-api.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
    imports: [ExternalApiModule, CloudinaryModule],
    providers: [ChatbotService],
    controllers: [ChatbotController],
})
export class ChatbotModule {}
