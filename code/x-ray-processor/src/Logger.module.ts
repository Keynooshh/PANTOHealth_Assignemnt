import { Global, Logger, Module } from '@nestjs/common';
import { AppLogger } from './AppLogger.service';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [Logger, AppLogger],
  exports: [AppLogger],
})
export class LoggerModule {}
