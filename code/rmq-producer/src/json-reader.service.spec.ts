import { Test, TestingModule } from '@nestjs/testing';
import { JsonReaderService } from './json-reader.service';
import * as fs from 'fs';

describe('JsonReaderService', () => {
  let service: JsonReaderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JsonReaderService],
    }).compile();

    service = module.get<JsonReaderService>(JsonReaderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('reader', () => {
    it('should read and parse a JSON file', () => {
      const mockFilePath = './json/x-ray.json';
      const mockFileContent = '{"key": "value"}';
      const mockParsedData = { key: 'value' };

      jest.spyOn(fs, 'readFileSync').mockReturnValue(mockFileContent);

      const result = service.reader(mockFilePath);

      expect(fs.readFileSync).toHaveBeenCalledWith(mockFilePath);
      expect(result).toEqual(mockParsedData);
    });

    it('should throw an error if the file does not exist', () => {
      const mockFilePath = './json/nonexistent.json';

      jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
        throw new Error('File not found');
      });

      expect(() => service.reader(mockFilePath)).toThrow('File not found');
      expect(fs.readFileSync).toHaveBeenCalledWith(mockFilePath);
    });

    it('should throw an error if the file content is not valid JSON', () => {
      const mockFilePath = './json/invalid.json';
      const invalidJsonContent = 'invalid json';

      jest.spyOn(fs, 'readFileSync').mockReturnValue(invalidJsonContent);

      expect(() => service.reader(mockFilePath)).toThrow(SyntaxError);
      expect(fs.readFileSync).toHaveBeenCalledWith(mockFilePath);
    });
  });
});