import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as rmq from 'amqplib';

@Injectable()
export class RMQService implements OnModuleInit, OnModuleDestroy {
  private connection: rmq.Connection;
  private channel: rmq.Channel;
  private readonly queue: string = 'x-ray-queue';
  private readonly uri = 'amqp://guest:guest@rmq:5672';

  async onModuleInit() {
    await this.connect();
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
      console.log('Connecting to:' + this.uri);
      this.connection = await rmq.connect(this.uri);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.queue, { durable: true });
      console.log('Connected to RabbitMQ as Producer');
      console.log('Consuming from:' + this.queue);
    } catch (error) {
      if (retries > 0) {
        console.warn(
          `Failed to connect to RabbitMQ. Retrying in ${delay}ms...`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.connect(retries - 1, delay);
      }
      console.error('Error connecting to RabbitMQ', error);
      return;
    }
  }

  async sendMessage(message: any) {
    if (!this.channel) {
      console.error('RabbitMQ channel is not initialized');
      return;
    }
    this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
    console.log(`Message sent.`);
  }
}
