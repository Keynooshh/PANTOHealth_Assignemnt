"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RMQConsumerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RMQConsumerService = void 0;
const common_1 = require("@nestjs/common");
const rmq = require("amqplib");
const xray_service_1 = require("../xray/xray.service");
const config_1 = require("@nestjs/config");
const AppLogger_service_1 = require("../AppLogger.service");
let RMQConsumerService = RMQConsumerService_1 = class RMQConsumerService {
    constructor(dataProcessingService, configService, logger) {
        this.dataProcessingService = dataProcessingService;
        this.configService = configService;
        this.logger = logger;
        this.queue = this.configService.get('RMQ_QUEUE');
        this.uri = this.configService.get('RMQ_URI');
        logger.setContext(RMQConsumerService_1.name);
    }
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
        }
        catch (error) {
            if (retries > 0) {
                console.warn(`Failed to connect to RabbitMQ. Retrying in ${delay}ms...`);
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
};
exports.RMQConsumerService = RMQConsumerService;
exports.RMQConsumerService = RMQConsumerService = RMQConsumerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [xray_service_1.XrayDataService,
        config_1.ConfigService,
        AppLogger_service_1.AppLogger])
], RMQConsumerService);
//# sourceMappingURL=rmq.service.js.map