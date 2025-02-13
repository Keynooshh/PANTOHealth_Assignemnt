import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as rmq from 'amqplib';

@Injectable()
export class RMQService implements OnModuleInit, OnModuleDestroy {
  private connection: rmq.Connection;
  private channel: rmq.Channel;
  private queue: string = 'x-ray-queue';
  private uri = 'amqp://guest:guest@localhost:5672';

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
      await this.close();
  }

  async close(){
    if(this.channel){
        await this.channel.close();
        }
    if(this.connection){
        await this.connection.close();
    }
  }

  async connect() {
    try {
      this.connection = await rmq.connect(this.uri);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.queue, { durable: true });
      console.log('Connected to RabbitMQ');
    } catch (error) {
      console.error('Error connecting to RabbitMQ', error);
    }
  }

  async sendMessage(message:any){
    if (!this.channel){
        console.error('RabbitMQ channel is not initialized');
        return;
    }
    this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(message)), {
        persistent: true,
      });
      console.log(`Message sent.`);
  }
}
