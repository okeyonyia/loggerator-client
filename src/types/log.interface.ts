export interface Log {
  ip: string;
  user: string;
  date: string;
  method: string;
  url: string;
  httpVersion: string;
  statusCode: number;
  responseSize: number;
}
