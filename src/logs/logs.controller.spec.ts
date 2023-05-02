import { Test, TestingModule } from '@nestjs/testing';
import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';
import { Log } from '../types/log.interface';
import { Query } from '../types/query.interface';

describe('LogsController', () => {
  let logsController: LogsController;
  let logsService: LogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogsController],
      providers: [LogsService],
    }).compile();

    logsController = module.get<LogsController>(LogsController);
    logsService = module.get<LogsService>(LogsService);
  });

  describe('getFilteredLogs', () => {
    it('should return filtered logs based on query parameters', async () => {
      const query: Query = { user: 'annstewart', method: 'POST', code: '200' };

      const expectedResult: Log[] = [
        {
          ip: '23.59.50.157',
          user: 'annstewart',
          date: '18/Jul/2000 02:12:31 +0000',
          method: 'POST',
          url: '/photos/90',
          httpVersion: 'HTTP/1.0',
          statusCode: 500,
          responseSize: 97,
        },
        {
          ip: '23.59.50.157',
          user: 'annstewart',
          date: '08/Jul/2000 08:08:53 +0000',
          method: 'POST',
          url: '/bookmarks/123',
          httpVersion: 'HTTP/1.0',
          statusCode: 200,
          responseSize: 562,
        },
      ];

      jest
        .spyOn(logsService, 'filterLogs')
        .mockImplementation(() => expectedResult);

      expect(
        logsController.filterLogs(query.code, query.method, query.user),
      ).toEqual(expectedResult);
    });
  });
});
