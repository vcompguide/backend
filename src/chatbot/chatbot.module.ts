import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { ExternalApiModule } from 'src/external-api/external-api.module';

@Module({
	imports: [ExternalApiModule],
    providers: [ChatbotService],
    controllers: [ChatbotController],
})
export class ChatbotModule {}
