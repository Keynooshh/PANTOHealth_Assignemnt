"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RMQService = void 0;
const common_1 = require("@nestjs/common");
const rmq = require("amqplib");
let RMQService = class RMQService {
    constructor() {
        this.queue = 'x-ray-queue';
        this.uri = 'amqp://guest:guest@rmq:5672';
    }
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
        }
        catch (error) {
            if (retries > 0) {
                console.warn(`Failed to connect to RabbitMQ. Retrying in ${delay}ms...`);
                await new Promise((resolve) => setTimeout(resolve, delay));
                return this.connect(retries - 1, delay);
            }
            console.error('Error connecting to RabbitMQ', error);
            return;
        }
    }
    async sendMessage(message) {
        if (!this.channel) {
            console.error('RabbitMQ channel is not initialized');
            return;
        }
        this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(message)), {
            persistent: true,
        });
        console.log(`Message sent.`);
    }
};
exports.RMQService = RMQService;
exports.RMQService = RMQService = __decorate([
    (0, common_1.Injectable)()
], RMQService);
//# sourceMappingURL=rabbitmq.service.js.map