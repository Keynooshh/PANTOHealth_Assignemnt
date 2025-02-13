import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { XrayDataService } from './xray.service';

@Controller('/v1/xray')
export class XrayController {
  constructor(private readonly xrayDataSerivce: XrayDataService) {}

  @Get('all')
  getAllXray() {
    return this.xrayDataSerivce.getAll();
  }

  @Get(':id')
  getById(@Param() params: any) {
    return this.xrayDataSerivce.getOne(params.id);
  }
}
