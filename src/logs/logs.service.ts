import { Injectable } from '@nestjs/common';
import { io } from 'socket.io-client';
import { Log } from '../types/log.interface';

@Injectable()
export class LogsService {
  private logs: Log[] = [];

  constructor() {
    const logServerAddress =
      process.env.LOG_SERVER_ADDRESS || 'http://127.0.0.1:8000';
    const socket = io(logServerAddress, {
      transports: ['websocket'],
      upgrade: false,
    });

    socket.on('connect', () => {
      console.log('Socket connected successfully');
    });

    socket.on('packet', ({ type, data }) => {
      console.log('Packet Received', { type, data });
    });

    socket.on('connect_error', (error) => {
      console.log('Socket error:', error);
    });

    // This is a guess. I can't find documentation on what event to listen for changes on.
    socket.on('log', (log: string) => {
      console.log('Received log', log);
      const parsedLog = this.parseLog(log);
      this.logs.push(parsedLog);
    });
  }

  isValidLog(log: string): boolean {
    // Modify this regular expression to match your expected log format
    const logRegex =
      /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}) - (.*?) \[(.*?)\] "(.*?)" (\d{3}) (\d+|-)$/;

    return logRegex.test(log);
  }

  private parseLog(log: string): Log {
    const logPattern =
      /^(\S+)\s+-\s+(\S+)\s+\[(.+)\]\s+"(\S+)\s+(\S+)\s+(HTTP\/1.0)"\s+(\d+)\s+(\d+)$/;

    const match = log.match(logPattern);
    if (match) {
      return {
        ip: match[1],
        user: match[2],
        date: new Date(match[3]).toISOString(),
        method: match[4],
        url: match[5],
        httpVersion: match[6],
        statusCode: parseInt(match[7], 10),
        responseSize: parseInt(match[8], 10),
      };
    }

    return null;
  }

  /**
   * Finds and returns array of log.
   * @param query
   */
  filterLogs(query: { code?: string; method?: string; user?: string }): Log[] {
    const filteredLogs = this.logs.filter((log) => {
      const conditions = [
        !query.method || log.method === query.method,
        !query.user || log.user === query.user,
        !query.code || log.statusCode === parseInt(query.code, 10),
      ];
      return conditions.every((condition) => condition);
    });

    return filteredLogs.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }
}
