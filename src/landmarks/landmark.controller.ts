import { Controller, Get, Param } from '@nestjs/common';
import { LandmarksService } from './landmark.service';

// This controller is public (no @UseGuards)
// So users can browse landmarks before logging in.
@Controller('landmarks')
export class LandmarksController {
  constructor(private readonly landmarksService: LandmarksService) {}

  // GET /landmarks
  @Get()
  async findAll() {
    return this.landmarksService.findAll();
  }

  // GET /landmarks/:id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.landmarksService.findOne(id);
  }
}
