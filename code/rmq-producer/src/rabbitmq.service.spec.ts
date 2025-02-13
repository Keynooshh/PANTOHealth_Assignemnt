import { Test, TestingModule } from '@nestjs/testing';
import { RMQService } from './rabbitmq.service';
import * as rmq from 'amqplib';

jest.mock('amqplib'); // Mock the amqplib module

describe('RMQService', () => {
  let service: RMQService;
  let mockConnection: rmq.Connection;
  let mockChannel: rmq.Channel;

  beforeEach(async () => {
    // Mock the channel
    mockChannel = {
      assertQueue: jest.fn().mockResolvedValue(undefined),
      close: jest.fn().mockResolvedValue(undefined),
      sendToQueue: jest.fn(),
    } as any;

    // Mock the connection
    mockConnection = {
      createChannel: jest.fn().mockResolvedValue(mockChannel), // Ensure this returns mockChannel
      close: jest.fn().mockResolvedValue(undefined),
    } as any;

    // Mock the amqplib.connect method to return the mock connection
    (rmq.connect as jest.Mock).mockResolvedValue(mockConnection);

    const module: TestingModule = await Test.createTestingModule({
      providers: [RMQService],
    }).compile();

    service = module.get<RMQService>(RMQService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should call connect on module initialization', async () => {
      await service.onModuleInit();
      expect(rmq.connect).toHaveBeenCalledWith('amqp://guest:guest@rmq:5672');
      expect(mockConnection.createChannel).toHaveBeenCalled();
      expect(mockChannel.assertQueue).toHaveBeenCalledWith('x-ray-queue', {
        durable: true,
      });
    });

    it('should log an error if connection fails', async () => {
      const error = new Error('Connection failed');
      (rmq.connect as jest.Mock).mockRejectedValue(error);

      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      await service.onModuleInit();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error connecting to RabbitMQ',
        error,
      );
    });
  });

  describe('sendMessage', () => {
    it('should send a message to the queue', async () => {
      await service.onModuleInit(); // Initialize the connection and channel
      const message = { key: 'value' };

      service.sendMessage(message);

      expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
        'x-ray-queue',
        Buffer.from(JSON.stringify(message)),
        { persistent: true },
      );
    });

    it('should log an error if the channel is not initialized', () => {
      const message = { key: 'value' };
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      service.sendMessage(message);

      expect(consoleSpy).toHaveBeenCalledWith(
        'RabbitMQ channel is not initialized',
      );
      expect(mockChannel.sendToQueue).not.toHaveBeenCalled();
    });
  });

  describe('close', () => {
    it('should close the channel and connection', async () => {
      await service.onModuleInit(); // Initialize the connection and channel
      await service.close();

      expect(mockChannel.close).toHaveBeenCalled();
      expect(mockConnection.close).toHaveBeenCalled();
    });

    it('should not throw an error if channel or connection is not initialized', async () => {
      await service.close(); // No initialization, so channel and connection are undefined

      expect(mockChannel.close).not.toHaveBeenCalled();
      expect(mockConnection.close).not.toHaveBeenCalled();
    });
  });

  describe('onModuleDestroy', () => {
    it('should call close on module destruction', async () => {
      await service.onModuleInit(); // Initialize the connection and channel
      await service.onModuleDestroy();

      expect(mockChannel.close).toHaveBeenCalled();
      expect(mockConnection.close).toHaveBeenCalled();
    });
  });
});
