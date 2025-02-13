import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
export declare class RMQService implements OnModuleInit, OnModuleDestroy {
    private connection;
    private channel;
    private readonly queue;
    private readonly uri;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    close(): Promise<void>;
    connect(retries?: number, delay?: number): any;
    sendMessage(message: any): Promise<void>;
}
