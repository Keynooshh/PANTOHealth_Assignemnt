// device-data.module.ts
import { forwardRef, Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { XrayData, XrayDataSchema } from './xray.schema';
import { XrayDataService } from './xray.service';
import { XrayController } from './xray.controller';
import { SignalsModule } from 'src/signals/signals.module';
import { AppLogger } from 'src/AppLogger.service';
import { LoggerModule } from 'src/Logger.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: XrayData.name, schema: XrayDataSchema },
    ]),
    SignalsModule,
    LoggerModule,
  ],
  controllers: [XrayController],
  providers: [XrayDataService],
  exports: [
    MongooseModule.forFeature([
      { name: XrayData.name, schema: XrayDataSchema },
    ]),
  ],
})
export class XrayDataModule {}
