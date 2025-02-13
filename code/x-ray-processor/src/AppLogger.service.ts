import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppLogger {
  constructor(private readonly logger: Logger) {}
  private context: string;

  setContext(context: string) {
    this.context = context;
  }

  error(message: any) {
    this.logger.error(message, this.context);
  }

  warn(message: any) {
    this.logger.warn(message, this.context);
  }

  log(message: any) {
    this.logger.log(message, this.context);
  }

  debug(message: any) {
    this.logger.debug(message, this.context);
  }

  verbose(message: any) {
    this.logger.verbose(message, this.context);
  }
}
