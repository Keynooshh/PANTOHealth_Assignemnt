import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as rmq from 'amqplib';
import { XrayDataService } from '../xray/xray.service';
import { ConfigService } from '@nestjs/config';
import { AppLogger } from 'src/AppLogger.service';

@Injectable()
export class RMQConsumerService implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly dataProcessingService: XrayDataService,
    private readonly configService: ConfigService,
    private readonly logger: AppLogger,
  ) {
    logger.setContext(RMQConsumerService.name);
  }

  private connection: rmq.Connection;
  private channel: rmq.Channel;
  private queue = this.configService.get<string>('RMQ_QUEUE');
  private uri = this.configService.get<string>('RMQ_URI');

  async onModuleInit() {
    await this.connect();
    await this.consumeMessages();
  }

  async onModuleDestroy() {
    await this.close();
  }

  async close() {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
  }

  async connect(retries = 5, delay = 5000) {
    try {
      this.logger.log('Connecting to:' + this.uri);
      this.connection = await rmq.connect(this.uri);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.queue, { durable: true });
      this.logger.log('Connected to RabbitMQ as Consumer');
      this.logger.log('Consuming from:' + this.queue);
    } catch (error) {
      if (retries > 0) {
        console.warn(
          `Failed to connect to RabbitMQ. Retrying in ${delay}ms...`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.connect(retries - 1, delay);
      }
      this.logger.error('Error connecting to RabbitMQ:\n' + error);
    }
  }

  async consumeMessages() {
    if (!this.channel) {
      this.logger.error('RabbitMQ channel is not initialized');
      return;
    }
    this.logger.log('Started consuming messages from queue.');
    await this.channel.consume(this.queue, async (message) => {
      if (message) {
        const content = JSON.parse(message.content.toString());
        await this.dataProcessingService.processData(content);
        this.channel.ack(message);
      }
    });
  }
}
