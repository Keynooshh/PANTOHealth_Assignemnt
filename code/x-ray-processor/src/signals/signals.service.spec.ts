import { Test, TestingModule } from '@nestjs/testing';
import { SignalsDataService } from './signals.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignalData } from './signals.schema';
import { DeviceData } from '../xray/xray.schema';
import { NotFoundException } from '@nestjs/common';

describe('SignalsDataService', () => {
  let service: SignalsDataService;
  let model: Model<SignalData>;

  const mockSignalData = {
    deviceId: 'device123',
    dataLength: 10,
    time: 1234567890,
    save: jest.fn().mockResolvedValue({}),
  };

  mockSignalData.save.mockResolvedValue(mockSignalData);

  const mockDeviceData: DeviceData = {
    data: [
      {
        time: 1234567890,
        location: {
          x: 1,
          y: 2,
          speed: 3,
        },
      },
    ],
    time: 1234567890,
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
                exec: jest.fn().mockResolvedValue(id === 'nonExistentId' ? null : { ...mockSignalData }),
              })),
                            
            findByIdAndDelete: jest.fn().mockResolvedValue(mockSignalData),
            findByIdAndUpdate: jest.fn().mockResolvedValue(mockSignalData),
            exec: jest.fn().mockResolvedValue([mockSignalData]),
          },
        },
      ],
    }).compile();

    service = module.get<SignalsDataService>(SignalsDataService);
    model = module.get<Model<SignalData>>(getModelToken(SignalData.name));
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
      const deviceId = 'device123';
      await service.processSignalData(mockDeviceData, deviceId);
      expect(model.create).toHaveBeenCalledWith({
        deviceId: deviceId,
        time: mockDeviceData.time,
        dataLength: mockDeviceData.data.length,
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