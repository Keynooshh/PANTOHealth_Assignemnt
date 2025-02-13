import { Controller, Get, Post } from '@nestjs/common';
import { JsonReaderService } from './json-reader.service';
import { RMQService } from './rabbitmq.service';

@Controller()
export class AppController {
  constructor(
    private readonly jsonReaderService: JsonReaderService ,
    private readonly RMQService : RMQService
  ) {}

  @Get('json-test')
  jsonReader(): string {
    return this.jsonReaderService.reader('./json/x-ray.json');
  }

  @Post('start-producer')
  startProducer() {
    const message = this.jsonReaderService.reader('./json/x-ray.json');
    this.RMQService.sendMessage(message);
  }

}
