import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SampleModule } from './sample/sample.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SampleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
