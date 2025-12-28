import { Message } from '@libs/coredb/schemas/message.schema';
import { ChatQuerierService } from '@libs/querier/chat/chat-querier.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SaveMessageDto } from './dto/save-message.dto';

@Injectable()
export class ChatService {
    constructor(
        private chatQuerierService: ChatQuerierService,
        @InjectModel(Message.name, 'core') private messageModel: Model<Message>,
    ) {}

    getChatById(chatId: string) {
        return this.chatQuerierService.getMessagesByChatId(chatId);
    }

    saveMessage(saveMessageDto: SaveMessageDto) {
        const message = this.messageModel.create({
            chatId: saveMessageDto.chatId,
            senderId: saveMessageDto.senderId,
            content: saveMessageDto.content,
        });
        return message;
    }
}
