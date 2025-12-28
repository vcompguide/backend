import { SchedulerModule } from '@libs/common/scheduler/scheduler.module';
import { CoreDbModule } from '@libs/coredb';
import { Message, MessageSchema } from '@libs/coredb/schemas/message.schema';
import { Global, Module } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { ChatQuerierService } from './chat-querier.service';

@Global()
@Module({})
export class ChatQuerierModule {
    static forRoot() {
        return {
            module: ChatQuerierModule,
            imports: [
                CoreDbModule,
                MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }], 'core'),
                SchedulerModule,
            ],
            providers: [
                {
                    provide: ChatQuerierService,
                    useFactory: async (messageModel: Model<Message>, scheduler: SchedulerRegistry) => {
                        const service = new ChatQuerierService(messageModel, scheduler);
                        await service.init();
                        return service;
                    },
                    inject: [getModelToken(Message.name, 'core'), SchedulerRegistry],
                },
            ],
            exports: [ChatQuerierService],
        };
    }
}
