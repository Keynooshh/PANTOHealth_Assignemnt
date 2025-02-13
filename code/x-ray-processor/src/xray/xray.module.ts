// device-data.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { XrayData, XrayDataSchema } from './xray.schema';
import { XrayDataService } from './xray.service';
import { XrayController } from './xray.controller';
import { SignalsModule } from 'src/signals/signals.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: XrayData.name, schema: XrayDataSchema },
    ]),
    SignalsModule,
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
