import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  NotFoundException,
} from '@nestjs/common';

import { SignalsDataService } from './signals.service';

@Controller('/v1/signals')
export class SignalsController {
  constructor(private readonly signalDataService: SignalsDataService) {}

  @Post()
  async insertXrayData(@Body() createSignalData: any) {
    return this.signalDataService.create(createSignalData);
  }

  @Get('all')
  getAllSignals() {
    return this.signalDataService.getAll();
  }

  @Get(':id')
  async getById(@Param() params: any) {
    const signal = await this.signalDataService.getOne(params.id);
    if (!signal) {
      throw new NotFoundException(`Signal with ID ${params.id} not found`);
    }
    return signal;
  }

  @Put(':id')
  async updateById(@Param('id') id: string, @Body() updateData: any) {
    return this.signalDataService.update(id, updateData);
  }

  @Delete(':id')
  deleteById(@Param() params: any) {
    return this.signalDataService.delete(params.id);
  }

  @Get()
  async getFilteredSignals(@Query() filters: any) {
    return this.signalDataService.getFiltered(filters);
  }
}
