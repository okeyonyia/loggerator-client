import { Controller, Get, Query } from '@nestjs/common';
import { LogsService } from './logs.service';
import { Log } from '../types/log.interface';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  filterLogs(
    @Query('code') code: string,
    @Query('method') method: string,
    @Query('user') user: string,
  ): Log[] {
    return this.logsService.filterLogs({ code, method, user });
  }
}
