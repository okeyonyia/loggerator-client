import { Test, TestingModule } from '@nestjs/testing';
import { LogsService } from './logs.service';
import { Log } from '../types/log.interface';

describe('LogsService', () => {
  let service: LogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogsService],
    }).compile();

    service = module.get<LogsService>(LogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('isValidLog', () => {
    it('should return true for a valid log', () => {
      const validLog =
        '192.168.1.1 - JohnDoe [08/Jul/2000 18:20:35 +0000] "GET / HTTP/1.1" 200 1234';
      expect(service.isValidLog(validLog)).toBeTruthy();
    });

    it('should return false for an invalid log', () => {
      const invalidLog = 'Invalid log format';
      expect(service.isValidLog(invalidLog)).toBeFalsy();
    });
  });

  describe('parseLog', () => {
    it('should parse a log correctly', () => {
      const log =
        '23.59.50.157 - annstewart [18/Jul/2000 02:12:31 +0000] "POST /photos/90 HTTP/1.0" 500 97';
      const expectedResult: Log = {
        ip: '23.59.50.157',
        user: 'annstewart',
        date: '2000-07-18T02:12:31.000Z',
        method: 'POST',
        url: '/photos/90',
        httpVersion: 'HTTP/1.0',
        statusCode: 500,
        responseSize: 97,
      };

      const result = (service as any).parseLog(log); // Cast to 'any' to access the private method for testing purposes

      expect(result).toEqual(expectedResult);
    });

    it('should return null for an invalid log', () => {
      const invalidLog = 'Invalid log string';

      const result = (service as any).parseLog(invalidLog); // Cast to 'any' to access the private method for testing purposes

      expect(result).toBeNull();
    });
  });
});
