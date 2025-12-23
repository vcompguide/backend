import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

/**
 * Any module, libs that need to use @nestjs/schedule should import this module
 * Since nestjs docs does not specify behavior if ScheduleModule.forRoot() called multiple times
 * We should use this module to make sure that it's only called once
 */
@Module({
    imports: [ScheduleModule.forRoot()],
})
export class SchedulerModule {}
