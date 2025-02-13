import { Test, TestingModule } from '@nestjs/testing';
import { SignalsDataService } from './signals.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignalData } from './signals.schema';
import { Coordinates, DataPoint, XrayData } from '../xray/xray.schema';
import { NotFoundException } from '@nestjs/common';
import { AppLogger } from 'src/AppLogger.service';

describe('SignalsDataService', () => {
  let service: SignalsDataService;
  let model: Model<SignalData>;
  let xrayDataModel: Model<XrayData>;
  let logger: AppLogger;

  const coordinates: Coordinates = {
    x: 1,
    y: 2,
  };
  const dataPoint: DataPoint = {
    speed: 3,
    time: 1234,
    coordinates: coordinates,
  };

  const mockXrayData = {
    deviceId: 'SomeDevice',
    time: 123456789000,
    data: [{ speed: 3, time: 1234, coordinates: { x: 1, y: 2 } }],
  };

  const mockSignalData = {
    deviceId: mockXrayData.deviceId,
    time: mockXrayData.time,
    dataLength: mockXrayData.data.length,
    timeRange: { minTime: dataPoint.time, maxTime: dataPoint.time },
    averageSpeed: dataPoint.speed,
    totalDistance: Math.sqrt(
      Math.pow(coordinates.x - coordinates.x, 2) +
        Math.pow(coordinates.y - coordinates.y, 2),
    ),
    geoData: {
      minX: coordinates.x,
      maxX: coordinates.x,
      minY: coordinates.y,
      maxY: coordinates.y,
    },

    save: jest.fn().mockResolvedValue({}),
  };

  mockSignalData.save.mockResolvedValue(mockSignalData);

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    setContext: jest.fn(),
  };

  const mockXrayDataModel = {
    create: jest.fn().mockResolvedValue(mockXrayData),
    find: jest.fn().mockReturnValue({
      batchSize: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([mockXrayData]),
    }),
    findById: jest.fn().mockResolvedValue(mockXrayData),
    save: jest.fn().mockResolvedValue(mockXrayData),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignalsDataService,
        {
          provide: getModelToken(SignalData.name),
          useValue: {
            create: jest.fn().mockResolvedValue(mockSignalData),
            find: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnThis(),
              equals: jest.fn().mockReturnThis(),
              batchSize: jest.fn().mockReturnThis(),
              exec: jest.fn().mockResolvedValue([mockSignalData]),
            }),
            findById: jest.fn().mockImplementation((id) => ({
              exec: jest
                .fn()
                .mockResolvedValue(
                  id === 'nonExistentId' ? null : { ...mockSignalData },
                ),
            })),

            findByIdAndDelete: jest.fn().mockResolvedValue(mockSignalData),
            findByIdAndUpdate: jest.fn().mockResolvedValue(mockSignalData),
            exec: jest.fn().mockResolvedValue([mockSignalData]),
          },
        },
        {
          provide: AppLogger,
          useValue: mockLogger,
        },
        {
          provide: getModelToken(XrayData.name),
          useValue: mockXrayDataModel,
        },
      ],
    }).compile();

    service = module.get<SignalsDataService>(SignalsDataService);
    model = module.get<Model<SignalData>>(getModelToken(SignalData.name));
    xrayDataModel = module.get<Model<XrayData>>(getModelToken(XrayData.name));
    logger = module.get<AppLogger>(AppLogger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new signal data', async () => {
      const result = await service.create(mockSignalData);
      expect(result).toEqual(mockSignalData);
      expect(model.create).toHaveBeenCalledWith(mockSignalData);
    });
  });

  describe('processSignalData', () => {
    it('should process signal data and create a new signal data entry', async () => {
      const xrayData = await xrayDataModel.create(mockXrayData);
      await service.processSignalData(xrayData);
      expect(model.create).toHaveBeenCalledWith({
        deviceId: mockXrayData.deviceId,
        time: mockXrayData.time,
        dataLength: mockXrayData.data.length,
        timeRange: { minTime: dataPoint.time, maxTime: dataPoint.time },
        averageSpeed: dataPoint.speed,
        totalDistance: Math.sqrt(
          Math.pow(coordinates.x - coordinates.x, 2) +
            Math.pow(coordinates.y - coordinates.y, 2),
        ),
        geoData: {
          minX: coordinates.x,
          maxX: coordinates.x,
          minY: coordinates.y,
          maxY: coordinates.y,
        },
      });
    });
  });

  describe('getAll', () => {
    it('should return all signal data with batch size 10', async () => {
      const result = await service.getAll();
      expect(result).toEqual([mockSignalData]);
      expect(model.find).toHaveBeenCalled();
      expect(model.find().batchSize(10).exec).toHaveBeenCalled();
    });
  });

  describe('getOne', () => {
    it('should return a signal data by id', async () => {
      const id = 'someId';
      const result = await service.getOne(id);
      expect(result).toEqual(mockSignalData);
      expect(model.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a signal data by id', async () => {
      const id = 'someId';
      const updateData = { dataLength: 20 };
      const result = await service.update(id, updateData);
      expect(result).toEqual(mockSignalData);
      expect(model.findById).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException if signal data not found', async () => {
      const id = 'nonExistentId';
      const updateData = { dataLength: 20 };
      await expect(service.update(id, updateData)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a signal data by id', async () => {
      const id = 'someId';
      const result = await service.delete(id);
      expect(result).toEqual(mockSignalData);
      expect(model.findByIdAndDelete).toHaveBeenCalledWith(id);
    });
  });

  describe('getFiltered', () => {
    it('should return filtered signal data based on time', async () => {
      const filters = { time: 1234567890 };
      const result = await service.getFiltered(filters);
      expect(result).toEqual([mockSignalData]);
      expect(model.find).toHaveBeenCalled();
      expect(model.find().where).toHaveBeenCalledWith('time');
      expect(model.find().where('time').equals).toHaveBeenCalledWith(
        filters.time,
      );
    });
  });
});
