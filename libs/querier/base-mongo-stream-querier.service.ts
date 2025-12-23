import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { ChangeStreamInsertDocument, ChangeStreamReplaceDocument, ChangeStreamUpdateDocument } from 'mongodb';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export abstract class BaseMongoStreamQuerier {
    constructor(private readonly scheduler: SchedulerRegistry) {}

    streamHealthCheckCronExpression() {
        return CronExpression.EVERY_10_SECONDS; // check stream health every 10 seconds
    }

    setupMongoStream(
        model: Model<any>,
        pipeline: Array<Record<string, unknown>>,
        onCollectionChange: (
            change:
                | ChangeStreamInsertDocument<any>
                | ChangeStreamUpdateDocument<any>
                | ChangeStreamReplaceDocument<any>,
        ) => Promise<void>,
    ) {
        let stream = this.getModelStream(model, pipeline, onCollectionChange);

        // check stream health every 10 seconds
        const job = new CronJob(this.streamHealthCheckCronExpression(), () => {
            if (!stream || stream.closed) {
                stream = this.getModelStream(model, pipeline, onCollectionChange);
            }
        });
        this.scheduler.addCronJob(`mongo-stream-healthcheck-${uuidv4()}`, job);
        job.start();
    }

    getModelStream(
        model: Model<any>,
        pipeline: Array<Record<string, unknown>>,
        onCollectionChange: (
            change:
                | ChangeStreamInsertDocument<any>
                | ChangeStreamUpdateDocument<any>
                | ChangeStreamReplaceDocument<any>,
        ) => Promise<void>,
    ) {
        const stream = model.watch(pipeline, { fullDocument: 'updateLookup' });
        stream.on('change', async (change) => {
            if (
                change.operationType === 'insert' ||
                change.operationType === 'update' ||
                change.operationType === 'replace'
            ) {
                await onCollectionChange(change);
            }
        });

        return stream;
    }

    forceResyncQuerier(resyncQuerier: () => Promise<void>, resyncCron: string) {
        // force resync after an amount of time
        const job = new CronJob(resyncCron, () => resyncQuerier());
        this.scheduler.addCronJob(`force-resync-querier-${uuidv4()}`, job);
        job.start();
    }
}
