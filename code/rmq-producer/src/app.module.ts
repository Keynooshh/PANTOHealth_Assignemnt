import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { JsonReaderService } from './json-reader.service';
import { RMQService } from './rabbitmq.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [ JsonReaderService ,RMQService],
})
export class AppModule {}
