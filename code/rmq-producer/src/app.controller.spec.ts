import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { JsonReaderService } from './json-reader.service';
import { RMQService } from './rabbitmq.service';

describe('AppController', () => {
  let appController: AppController;
  let jsonReaderService: JsonReaderService;
  let rmqService: RMQService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: JsonReaderService,
          useValue: {
            reader: jest.fn().mockReturnValue('{"key": "value"}'),
          },
        },
        {
          provide: RMQService,
          useValue: {
            sendMessage: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    jsonReaderService = module.get<JsonReaderService>(JsonReaderService);
    rmqService = module.get<RMQService>(RMQService);
  });

  describe('jsonReader', () => {
    it('should call jsonReaderService.reader and return the JSON data', () => {
      const result = appController.jsonReader();

      expect(jsonReaderService.reader).toHaveBeenCalledWith('./json/x-ray.json');
      expect(result).toBe('{"key": "value"}');
    });
  });

  describe('startProducer', () => {
    it('should call jsonReaderService.reader and send the message via RMQService', () => {
      appController.startProducer();

      expect(jsonReaderService.reader).toHaveBeenCalledWith('./json/x-ray.json');
      expect(rmqService.sendMessage).toHaveBeenCalledWith('{"key": "value"}');
    });
  });
});
