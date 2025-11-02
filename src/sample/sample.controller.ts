import { Controller, Get, Query, Version } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SampleService } from './sample.service';
import { GetSampleTextDto } from './dto/get-sample-text.dto';
import { GetSampleTextResponse } from './response/get-sample-text.response';

@Controller('sample')
export class SampleController {
  constructor(private readonly sampleService: SampleService) {}

  @ApiOperation({
    summary: 'Get sample text',
  })
  @ApiResponse({
    status: 200,
    description: 'Sample text retrieved successfully',
    type: GetSampleTextResponse,
  })
  @Version('1')
  @Get()
  async getSampleTextV1(@Query() query: GetSampleTextDto): Promise<GetSampleTextResponse> {
    return new GetSampleTextResponse(this.sampleService.getText(query.name));
  }
}
