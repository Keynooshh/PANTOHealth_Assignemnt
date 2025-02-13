import { Test, TestingModule } from '@nestjs/testing';
import { XrayDataService } from '../xray/xray.service';
import { ConfigService } from '@nestjs/config';
import { AppLogger } from 'src/AppLogger.service';
import * as rmq from 'amqplib';
import { RMQConsumerService } from './rmq.service';

jest.mock('amqplib');

describe('RMQConsumerService', () => {
  let service: RMQConsumerService;
  let mockDataProcessingService: jest.Mocked<XrayDataService>;
  let mockConfigService: jest.Mocked<ConfigService>;
  let mockLogger: jest.Mocked<AppLogger>;

  beforeEach(async () => {
    mockDataProcessingService = {
      processData: jest.fn(),
    } as any;

    mockConfigService = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'RMQ_QUEUE') return 'test-queue';
        if (key === 'RMQ_URI') return 'amqp://guest:guest@rmq:5672';
        return undefined;
      }),
    } as any;

    mockLogger = {
      setContext: jest.fn(),
      log: jest.fn(),
      error: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RMQConsumerService,
        { provide: XrayDataService, useValue: mockDataProcessingService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: AppLogger, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<RMQConsumerService>(RMQConsumerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should connect and start consuming messages', async () => {
      const mockConnection = { createChannel: jest.fn() };
      const mockChannel = { assertQueue: jest.fn(), consume: jest.fn() };
      (rmq.connect as jest.Mock).mockResolvedValue(mockConnection);
      mockConnection.createChannel.mockResolvedValue(mockChannel);

      await service.onModuleInit();

      expect(rmq.connect).toHaveBeenCalledWith('amqp://guest:guest@rmq:5672');
      expect(mockConnection.createChannel).toHaveBeenCalled();
      expect(mockChannel.assertQueue).toHaveBeenCalledWith('test-queue', {
        durable: true,
      });
      expect(mockLogger.log).toHaveBeenCalledWith(
        'Connected to RabbitMQ as Consumer',
      );
      expect(mockChannel.consume).toHaveBeenCalledWith(
        'test-queue',
        expect.any(Function),
      );
      expect(mockLogger.log).toHaveBeenCalledWith(
        'Started consuming messages from queue.',
      );
    });

    it('should log error if connection fails', async () => {
      const error = new Error('Connection failed');
      (rmq.connect as jest.Mock).mockRejectedValue(error);

      await service.onModuleInit();

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Error connecting to RabbitMQ:\n' + error,
      );
    });
  });

  describe('onModuleDestroy', () => {
    it('should close the connection and channel', async () => {
      const mockConnection = { close: jest.fn() };
      const mockChannel = { close: jest.fn() };
      (service as any).connection = mockConnection;
      (service as any).channel = mockChannel;

      await service.onModuleDestroy();

      expect(mockChannel.close).toHaveBeenCalled();
      expect(mockConnection.close).toHaveBeenCalled();
    });

    it('should not throw error if connection or channel is not initialized', async () => {
      (service as any).connection = null;
      (service as any).channel = null;

      await expect(service.onModuleDestroy()).resolves.not.toThrow();
    });
  });

  describe('consumeMessages', () => {
    it('should process message and acknowledge it', async () => {
      const mockChannel = { consume: jest.fn(), ack: jest.fn() };
      const mockMessage = {
        content: Buffer.from(JSON.stringify({ data: 'test' })),
      };
      (service as any).channel = mockChannel;

      await service.consumeMessages();

      const consumeCallback = mockChannel.consume.mock.calls[0][1];
      await consumeCallback(mockMessage);

      expect(mockDataProcessingService.processData).toHaveBeenCalledWith({
        data: 'test',
      });
      expect(mockChannel.ack).toHaveBeenCalledWith(mockMessage);
    });

    it('should log error if channel is not initialized', async () => {
      (service as any).channel = null;

      await service.consumeMessages();

      expect(mockLogger.error).toHaveBeenCalledWith(
        'RabbitMQ channel is not initialized',
      );
    });
  });
});
