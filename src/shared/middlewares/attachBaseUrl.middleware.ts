import { NextFunction, Request, Response } from "express";

// Extend the Request interface to include reqUrl

export class AttachBaseUrlMiddleware {
  static async attachBaseUrl(req: Request, res: Response, next: NextFunction) {
    // Determine if the standard ports are being used
    const isStandardPort =
      (req.protocol === "http" && req.socket.localPort === 80) ||
      (req.protocol === "https" && req.socket.localPort === 443);

    // Construct baseUrl with or without port based on environment
    const baseUrl = isStandardPort
      ? `${req.protocol}://${req.hostname}/api/v1`
      : `${req.protocol}://${req.hostname}:${req.socket.localPort}/api/v1`;

    req.body.baseUrl = baseUrl;
    next();
  }
}
