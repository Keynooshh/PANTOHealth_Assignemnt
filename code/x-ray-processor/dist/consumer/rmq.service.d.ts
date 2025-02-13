import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { XrayDataService } from '../xray/xray.service';
import { ConfigService } from '@nestjs/config';
export declare class RMQConsumerService implements OnModuleInit, OnModuleDestroy {
    private readonly dataProcessingService;
    private readonly configService;
    constructor(dataProcessingService: XrayDataService, configService: ConfigService);
    private connection;
    private channel;
    private queue;
    private uri;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    close(): Promise<void>;
    connect(): Promise<void>;
    consumeMessages(): Promise<void>;
}
