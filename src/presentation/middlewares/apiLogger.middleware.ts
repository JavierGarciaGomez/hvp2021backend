import { NextFunction, Request, Response } from "express";
import {
  ApiLogData,
  FileLoggerService,
} from "../../infrastructure/services/FileLoggerService";
import { envsPlugin } from "../../infrastructure/adapters/envs.plugin";

export class ApiLoggerMiddleware {
  static log(req: Request, res: Response, next: NextFunction): void {
    // Skip if logger is disabled
    if (!envsPlugin.API_LOGGER_ENABLED) {
      return next();
    }

    const startTime = new Date();
    const startTimestamp = startTime.toISOString();

    // Capture request data
    const requestLog = ApiLoggerMiddleware.captureRequest(req);

    // Store original res.json to intercept response
    const originalJson = res.json.bind(res);

    // Override res.json to capture response
    res.json = function (body: any): Response {
      const endTime = new Date();
      const durationMs = endTime.getTime() - startTime.getTime();

      // Capture response data
      const responseLog = {
        statusCode: res.statusCode,
        headers: { ...res.getHeaders() },
        body,
      };

      // Create log data
      const logData: ApiLogData = {
        timestamp: startTimestamp,
        request: requestLog,
        response: responseLog,
        timing: {
          startedAt: startTimestamp,
          completedAt: endTime.toISOString(),
          durationMs,
        },
      };

      // Save log asynchronously (don't block response)
      FileLoggerService.saveApiLog(logData).catch((error) => {
        console.error("[ApiLoggerMiddleware] Failed to save log:", error);
      });

      // Call original json method
      return originalJson(body);
    };

    next();
  }

  private static captureRequest(req: Request) {
    return {
      method: req.method,
      url: req.originalUrl || req.url,
      query: req.query,
      params: req.params,
      headers: { ...req.headers },
      body: req.body,
    };
  }
}
