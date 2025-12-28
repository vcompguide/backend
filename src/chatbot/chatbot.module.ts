import { Module } from '@nestjs/common';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { ExternalApiModule } from 'src/external-api/external-api.module';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';

@Module({
    imports: [ExternalApiModule, CloudinaryModule],
    providers: [ChatbotService],
    controllers: [ChatbotController],
})
export class ChatbotModule {}
