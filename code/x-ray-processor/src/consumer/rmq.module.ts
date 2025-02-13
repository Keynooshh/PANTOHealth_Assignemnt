import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { RMQConsumerService } from './rmq.service';
import { XrayDataService } from 'src/xray/xray.service';
import { XrayDataModule } from 'src/xray/xray.module';
import { SignalsModule } from 'src/signals/signals.module';

@Module({
  imports: [XrayDataModule, SignalsModule],
  providers: [RMQConsumerService, XrayDataService, ConfigService],
})
export class RabbitMQModule {}
