import { Controller } from '@nestjs/common';
import { RatingService } from './ratings.service';

@Controller('users')
export class RatingController {
    constructor(private readonly usersService: RatingService) {}
}
