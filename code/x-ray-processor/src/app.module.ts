import { Module } from '@nestjs/common';
import { XrayDataModule } from './xray/xray.module';
import { MongoModule } from './mongoDB.module';
import { RabbitMQModule } from './consumer/rmq.module';
import { SignalsModule } from './signals/signals.module';
import { LoggerModule } from './Logger.module';

@Module({
  imports: [
    XrayDataModule,
    MongoModule,
    SignalsModule,
    RabbitMQModule,
    LoggerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
