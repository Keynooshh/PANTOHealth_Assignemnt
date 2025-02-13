import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { XrayDataService } from '../xray/xray.service';
import { ConfigService } from '@nestjs/config';
import { AppLogger } from 'src/AppLogger.service';
export declare class RMQConsumerService implements OnModuleInit, OnModuleDestroy {
    private readonly dataProcessingService;
    private readonly configService;
    private readonly logger;
    constructor(dataProcessingService: XrayDataService, configService: ConfigService, logger: AppLogger);
    private connection;
    private channel;
    private queue;
    private uri;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    close(): Promise<void>;
    connect(retries?: number, delay?: number): any;
    consumeMessages(): Promise<void>;
}
