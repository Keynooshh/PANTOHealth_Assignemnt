import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SignalData, signalDataSchema } from './signals.schema';
import { SignalsController } from './signals.controller';
import { SignalsDataService } from './signals.service';
import { AppLogger } from 'src/AppLogger.service';
import { LoggerModule } from 'src/Logger.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SignalData.name, schema: signalDataSchema },
    ]),
    LoggerModule,
  ],
  controllers: [SignalsController],
  providers: [SignalsDataService],
  exports: [SignalsDataService],
})
export class SignalsModule {}
