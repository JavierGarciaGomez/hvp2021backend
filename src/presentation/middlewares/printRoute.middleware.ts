import { NextFunction, Request, Response } from "express";

export class PrintRouteMiddleware {
  static print(req: Request, res: Response, next: NextFunction) {
    console.error(`Method: ${req.method}, Path: ${req.path}, IP: ${req.ip}`);
    next();
  }
}
