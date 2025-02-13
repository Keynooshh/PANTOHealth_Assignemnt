import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
export declare class RMQService implements OnModuleInit, OnModuleDestroy {
    private connection;
    private channel;
    private queue;
    private uri;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    close(): Promise<void>;
    connect(): Promise<void>;
    sendMessage(message: any): Promise<void>;
}
