import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const date = new Date().toLocaleString();
    console.log(
      `${date} | Url: ${req.url} | Method: ${req.method} | Status: ${res.statusCode}`,
    );
    next();
  }
}
