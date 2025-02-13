import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { XrayDataService } from './xray.service';
import { XrayData } from './xray.schema';
import { SignalsDataService } from '../signals/signals.service';

describe('XrayDataService', () => {
  let service: XrayDataService;
  let xrayDataModel: Model<XrayData>;
  let signalsDataService: SignalsDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        XrayDataService,
        {
          provide: getModelToken(XrayData.name),
          useValue: {
            create: jest.fn().mockResolvedValue({ _id: 'someId', deviceId: new Map([['key', 'value']]) }),
            save: jest.fn().mockResolvedValue({ _id: 'someId' }),
            find: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue([]),
            }),
            findById: jest.fn().mockResolvedValue(null),
          },
        },
        {
          provide: SignalsDataService,
          useValue: {
            processSignalData: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<XrayDataService>(XrayDataService);
    xrayDataModel = module.get<Model<XrayData>>(getModelToken(XrayData.name));
    signalsDataService = module.get<SignalsDataService>(SignalsDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new XrayData document', async () => {
      const xrayData = { deviceId: '123', data: 'some data' };

      const result = await service.create(xrayData);

      expect(xrayDataModel.create).toHaveBeenCalledWith(expect.objectContaining({
        deviceId: expect.any(Map),
      }));

      expect(result).toEqual({ _id: 'someId', deviceId: new Map([['key', 'value']]) });
    });
  });

  describe('processData', () => {
    it('should process data and call processSignalData for each device', async () => {
      const message = { deviceId: '123', data: 'some data' };
      const createdXrayData = {
        deviceId: new Map(Object.entries(message)),
        _id: 'someId',
      };

      jest.spyOn(service, 'create').mockResolvedValue(createdXrayData as any);
      jest.spyOn(signalsDataService, 'processSignalData').mockResolvedValue(undefined);

      await service.processData(message);

      expect(service.create).toHaveBeenCalledWith(message);
      expect(signalsDataService.processSignalData).toHaveBeenCalledWith(expect.any(String), expect.any(String));
    });
  });

  describe('getAll', () => {
    it('should return all XrayData documents', async () => {
      const xrayDataArray = [{ deviceId: '123', data: 'some data' }];

      jest.spyOn(xrayDataModel, 'find').mockReturnValue({
        batchSize: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(xrayDataArray),
      } as any);

      const result = await service.getAll();

      expect(xrayDataModel.find).toHaveBeenCalled();
      expect(result).toEqual(xrayDataArray);
    });
  });

  describe('getOne', () => {
    it('should return a single XrayData document by id', async () => {
      const xrayData = { deviceId: '123', data: 'some data', _id: 'someId' };

      jest.spyOn(xrayDataModel, 'findById').mockResolvedValue(xrayData);

      const result = await service.getOne('someId');

      expect(xrayDataModel.findById).toHaveBeenCalledWith('someId');
      expect(result).toEqual(xrayData);
    });
  });
});