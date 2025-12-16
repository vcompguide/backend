import { BaseAppService } from 'libs/common/service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService extends BaseAppService {
    getServiceName(): string {
        return 'app';
    }
}
