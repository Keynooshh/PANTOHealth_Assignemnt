import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SignalData, signalDataSchema } from './signals.schema';
import { SignalsController } from './signals.controller';
import { SignalsDataService } from './signals.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SignalData.name, schema: signalDataSchema },
    ]),
  ],
  controllers: [SignalsController],
  providers: [SignalsDataService],
  exports: [SignalsDataService],
})
export class SignalsModule {}
