import { Message } from '@libs/coredb/schemas/message.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { BaseMongoStreamQuerier } from '../base-mongo-stream-querier.service';

export class ChatQuerierService extends BaseMongoStreamQuerier {
    private chatIdToMessages: Map<string, Message[]> = new Map();

    constructor(
        @InjectModel(Message.name, 'core') private readonly messageModel: Model<Message>,
        scheduler: SchedulerRegistry,
    ) {
        super(scheduler);
    }

    async init() {
        await this.syncFromDatabase();
        this.forceResyncQuerier(
            this.syncFromDatabase.bind(this),
            '0 */1 * * * *', // every 1 minute
        );
    }

    async syncFromDatabase() {
        const allMessages = await this.messageModel.find().sort({ createdAt: 1 }).lean();
        this.chatIdToMessages.clear();
        for (const message of allMessages) {
            if (!this.chatIdToMessages.has(message.chatId)) {
                this.chatIdToMessages.set(message.chatId, []);
            }
            this.chatIdToMessages.get(message.chatId)!.push(message);
        }
    }

    getMessagesByChatId(chatId: string): Message[] {
        return this.chatIdToMessages.get(chatId) || [];
    }
}
