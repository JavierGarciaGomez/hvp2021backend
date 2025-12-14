import { NextFunction, Request, Response } from "express";
export class PrintRouteMiddleware {
  static print(req: Request, res: Response, next: NextFunction) {
    console.log(
      `Method: ${req.method}, Path: ${req.path}, IP: ${
        req.ip
      }, Query: ${JSON.stringify(req.query)}`
    );
    next();
  }
}
