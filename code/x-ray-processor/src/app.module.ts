import { Module } from '@nestjs/common';
import { XrayDataModule } from './xray/xray.module';
import { MongoModule } from './mongoDB.module';
import { RabbitMQModule } from './consumer/rmq.module';
import { SignalsModule } from './signals/signals.module';

@Module({
  imports: [XrayDataModule, MongoModule, SignalsModule, RabbitMQModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
