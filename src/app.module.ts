import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SampleModule } from './sample/sample.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { LandmarksModule } from './landmarks/landmark.module';
import { RatingModule } from './ratings/ratings.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: ['.env.local', '.env'],
			isGlobal: true,
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				uri: configService.get<string>('MONGODB_URI'),
			}),
		}),
		SampleModule,
		UsersModule,
		LandmarksModule,
		RatingModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
