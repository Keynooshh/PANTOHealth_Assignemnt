import { Test, TestingModule } from '@nestjs/testing';
import { RMQConsumerService } from './rmq.service';
import { XrayDataService } from '../xray/xray.service';
import { ConfigService } from '@nestjs/config';
import * as rmq from 'amqplib';

jest.mock('amqplib', () => ({
  connect: jest.fn(),
}));

describe('RMQConsumerService', () => {
  let service: RMQConsumerService;
  let mockDataProcessingService: jest.Mocked<XrayDataService>;
  let mockConfigService: jest.Mocked<ConfigService>;
  let mockConnection: jest.Mocked<rmq.Connection>;
  let mockChannel: jest.Mocked<rmq.Channel>;

  beforeEach(async () => {
    mockDataProcessingService = {
      processData: jest.fn(),
    } as unknown as jest.Mocked<XrayDataService>;

    mockConfigService = {
      get: jest.fn(),
    } as unknown as jest.Mocked<ConfigService>;

    mockConnection = {
      createChannel: jest.fn(),
      close: jest.fn(),
    } as unknown as jest.Mocked<rmq.Connection>;

    mockChannel = {
      assertQueue: jest.fn(),
      consume: jest.fn(),
      ack: jest.fn(),
      close: jest.fn(),
    } as unknown as jest.Mocked<rmq.Channel>;

    (rmq.connect as jest.Mock).mockResolvedValue(mockConnection);
    mockConnection.createChannel.mockResolvedValue(mockChannel);

    mockConfigService.get.mockImplementation((key: string) => {
      switch (key) {
        case 'RMQ_QUEUE':
          return 'test_queue';
        case 'RMQ_URI':
          return 'amqp://localhost';
        default:
          return null;
      }
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RMQConsumerService,
        { provide: XrayDataService, useValue: mockDataProcessingService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<RMQConsumerService>(RMQConsumerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onModuleInit', () => {
    it('should call connect and consumeMessages', async () => {
      const connectSpy = jest.spyOn(service, 'connect');
      const consumeMessagesSpy = jest.spyOn(service, 'consumeMessages');

      await service.onModuleInit();

      expect(connectSpy).toHaveBeenCalled();
      expect(consumeMessagesSpy).toHaveBeenCalled();
    });
  });

  describe('onModuleDestroy', () => {
    it('should call close', async () => {
      const closeSpy = jest.spyOn(service, 'close');

      await service.onModuleDestroy();

      expect(closeSpy).toHaveBeenCalled();
    });
  });

  describe('connect', () => {
    it('should establish a connection and create a channel', async () => {
      await service.connect();

      expect(rmq.connect).toHaveBeenCalledWith('amqp://localhost');
      expect(mockConnection.createChannel).toHaveBeenCalled();
      expect(mockChannel.assertQueue).toHaveBeenCalledWith('test_queue', {
        durable: true,
      });
    });

    it('should log an error if connection fails', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      (rmq.connect as jest.Mock).mockRejectedValueOnce(
        new Error('Connection failed'),
      );

      await service.connect();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error connecting to RabbitMQ',
        expect.any(Error),
      );
    });
  });

  describe('consumeMessages', () => {
    it('should consume messages from the queue and process them', async () => {
      const mockMessage = {
        content: Buffer.from(JSON.stringify({ test: 'data' })),
      };
      mockChannel.consume.mockImplementation((queue, callback) => {
        callback(mockMessage);
        return Promise.resolve({ consumerTag: 'test-consumer' });
      });

      service['channel'] = mockChannel;

      await service.consumeMessages();

      expect(mockChannel.consume).toHaveBeenCalledWith(
        'test_queue',
        expect.any(Function),
      );
      expect(mockDataProcessingService.processData).toHaveBeenCalledWith({
        test: 'data',
      });
      expect(mockChannel.ack).toHaveBeenCalledWith(mockMessage);
    });

    it('should log an error if the channel is not initialized', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      service['channel'] = null;

      await service.consumeMessages();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'RabbitMQ channel is not initialized',
      );
    });
  });

  describe('close', () => {
    it('should close the channel and connection', async () => {
      service['channel'] = mockChannel;
      service['connection'] = mockConnection;

      await service.close();

      expect(mockChannel.close).toHaveBeenCalled();
      expect(mockConnection.close).toHaveBeenCalled();
    });

    it('should not throw an error if channel or connection is not initialized', async () => {
      service['channel'] = null;
      service['connection'] = null;

      await expect(service.close()).resolves.not.toThrow();
    });
  });
});
