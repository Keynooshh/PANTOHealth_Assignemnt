import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { RMQConsumerService } from './rmq.service';
import { XrayDataService } from 'src/xray/xray.service';
import { XrayData, XrayDataSchema } from 'src/xray/xray.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SignalData, signalDataSchema } from 'src/signals/signals.schema';
import { XrayDataModule } from 'src/xray/xray.module';
import { SignalsModule } from 'src/signals/signals.module';

@Module({
  imports: [XrayDataModule, SignalsModule],
  providers: [RMQConsumerService, XrayDataService, ConfigService],
})
export class RabbitMQModule {}
