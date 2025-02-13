import { Test, TestingModule } from '@nestjs/testing';
import { SignalsDataService } from './signals.service';
import { SignalsController } from './signals.controller';
import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

describe('SignalController', () => {
  let controller: SignalsController;
  let service: SignalsDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignalsController],
      providers: [
        {
          provide: SignalsDataService,
          useValue: {
            create: jest.fn(),
            getAll: jest.fn(),
            getOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            getFiltered: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SignalsController>(SignalsController);
    service = module.get<SignalsDataService>(SignalsDataService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('insertXrayData', () => {
    it('should call service.create with the correct parameters', async () => {
      const createSignalData = { data: 'test' };
      await controller.insertXrayData(createSignalData);
      expect(service.create).toHaveBeenCalledWith(createSignalData);
    });
  });

  describe('getAllSignals', () => {
    it('should call service.getAll', async () => {
      await controller.getAllSignals();
      expect(service.getAll).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('should call service.getOne with the correct id', async () => {
      const id = new Types.ObjectId().toHexString(); // Mock a valid MongoDB ObjectId
      const mockSignal = { _id: id, data: 'test', __v: 0 }; // Include required fields

      jest.spyOn(service, 'getOne').mockResolvedValue(mockSignal as any); // Cast as `any` to bypass type issues

      const result = await controller.getById({ id });
      expect(service.getOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockSignal);
    });

    it('should throw NotFoundException if signal is not found', async () => {
      jest.spyOn(service, 'getOne').mockResolvedValue(null);

      await expect(controller.getById({ id: '123' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateById', () => {
    it('should call service.update with the correct parameters', async () => {
      const id = '123';
      const updateData = { data: 'updated' };
      await controller.updateById(id, updateData);
      expect(service.update).toHaveBeenCalledWith(id, updateData);
    });
  });

  describe('deleteById', () => {
    it('should call service.delete with the correct id', async () => {
      const id = '123';
      await controller.deleteById({ id });
      expect(service.delete).toHaveBeenCalledWith(id);
    });
  });

  describe('getFilteredSignals', () => {
    it('should call service.getFiltered with the correct filters', async () => {
      const filters = { type: 'xray' };
      await controller.getFilteredSignals(filters);
      expect(service.getFiltered).toHaveBeenCalledWith(filters);
    });
  });
});
