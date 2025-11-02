import { Controller, Get, Query, Version } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SampleService } from './sample.service';
import { GetSampleTextDto } from './dto/get-sample-text.dto';
import { GetSampleTextResponse } from './response/get-sample-text.response';

@ApiTags('Sample')
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
  @Get()
  async getSampleText(@Query() query: GetSampleTextDto): Promise<GetSampleTextResponse> {
    return new GetSampleTextResponse(this.sampleService.getText(query.name));
  }
}
