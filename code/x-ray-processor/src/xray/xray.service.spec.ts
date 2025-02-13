import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { XrayDataService } from './xray.service';
import { XrayData } from './xray.schema';
import { SignalsDataService } from '../signals/signals.service';
import { AppLogger } from '../AppLogger.service';
import { Model } from 'mongoose';

describe('XrayDataService', () => {
  let service: XrayDataService;
  let model: Model<XrayData>;
  let signalsService: SignalsDataService;
  let logger: AppLogger;

  const mockXrayData = {
    stuff: {
      time: 123456789000,
      data: [[1, [1, 1, 1]]],
    },
  };

  const mockXrayDataModel = {
    find: jest.fn().mockReturnValue({
      batchSize: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([mockXrayData]),
    }),
    findById: jest.fn().mockResolvedValue(mockXrayData),
    save: jest.fn().mockResolvedValue(mockXrayData),
  };

  const mockSignalsService = {
    processSignalData: jest.fn().mockResolvedValue(undefined),
  };

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    setContext: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        XrayDataService,
        {
          provide: getModelToken(XrayData.name),
          useValue: mockXrayDataModel,
        },
        {
          provide: SignalsDataService,
          useValue: mockSignalsService,
        },
        {
          provide: AppLogger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<XrayDataService>(XrayDataService);
    model = module.get<Model<XrayData>>(getModelToken(XrayData.name));
    signalsService = module.get<SignalsDataService>(SignalsDataService);
    logger = module.get<AppLogger>(AppLogger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get all XrayData', async () => {
    const result = await service.getAll();
    expect(result).toEqual([mockXrayData]);
    expect(model.find).toHaveBeenCalled();
  });

  it('should get one XrayData by ID', async () => {
    const result = await service.getOne('device123');
    expect(result).toEqual(mockXrayData);
    expect(model.findById).toHaveBeenCalledWith('device123');
  });
});
