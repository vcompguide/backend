import { CoreDbModule } from '@libs/coredb';
import { Message, MessageSchema } from '@libs/coredb/schemas/message.schema';
import { ChatQuerierModule } from '@libs/querier/chat';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
    imports: [
        CoreDbModule,
        ChatQuerierModule.forRoot(),
        MongooseModule.forFeature(
            [
                {
                    name: Message.name,
                    schema: MessageSchema,
                },
            ],
            'core',
        ),
    ],
    controllers: [ChatController],
    providers: [ChatService],
})
export class ChatModule {}
