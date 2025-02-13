import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as rmq from 'amqplib';
import { XrayDataService } from '../xray/xray.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RMQConsumerService implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly dataProcessingService: XrayDataService,
    private readonly configService: ConfigService,
  ) {}

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

  async connect() {
    try {
      this.connection = await rmq.connect(this.uri);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.queue, { durable: true });
      console.log('Connected to RabbitMQ as Consumer');
    } catch (error) {
      console.error('Error connecting to RabbitMQ', error);
    }
  }

  async consumeMessages() {
    if (!this.channel) {
      console.error('RabbitMQ channel is not initialized');
      return;
    }
    console.log('Started consuming messages from queue:', this.queue);
    await this.channel.consume(this.queue, async (message) => {
      if (message) {
        const content = JSON.parse(message.content.toString());
        console.log('Received message:', content);
        await this.dataProcessingService.processData(content);
        this.channel.ack(message);
      }
    });
  }
}
