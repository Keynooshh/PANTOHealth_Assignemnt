import { Test, TestingModule } from '@nestjs/testing';
import { XrayController } from './xray.controller';
import { XrayDataService } from './xray.service';

describe('XrayController', () => {
  let controller: XrayController;
  let service: XrayDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [XrayController],
      providers: [
        {
          provide: XrayDataService,
          useValue: {
            getAll: jest.fn().mockResolvedValue([
              { id: 1, name: 'Xray 1' },
              { id: 2, name: 'Xray 2' },
            ]),
            getOne: jest.fn().mockImplementation((id: number) => 
              Promise.resolve({ id, name: `Xray ${id}` })
            ),
          },
        },
      ],
    }).compile();

    controller = module.get<XrayController>(XrayController);
    service = module.get<XrayDataService>(XrayDataService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllXray', () => {
    it('should return an array of xrays', async () => {
      await expect(controller.getAllXray()).resolves.toEqual([
        { id: 1, name: 'Xray 1' },
        { id: 2, name: 'Xray 2' },
      ]);
      expect(service.getAll).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('should return a single xray', async () => {
      const params = { id: 1 };
      await expect(controller.getById(params)).resolves.toEqual({
        id: 1,
        name: 'Xray 1',
      });
      expect(service.getOne).toHaveBeenCalledWith(1);
    });
  });
});