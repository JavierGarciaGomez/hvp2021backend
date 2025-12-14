import fs from "fs/promises";
import path from "path";

export interface ApiLogData {
  timestamp: string;
  request: {
    method: string;
    url: string;
    query: any;
    params: any;
    headers: Record<string, any>;
    body: any;
  };
  response: {
    statusCode: number;
    headers: Record<string, any>;
    body: any;
  };
  timing: {
    startedAt: string;
    completedAt: string;
    durationMs: number;
  };
}

export interface DebugLogData {
  timestamp: string;
  functionName: string;
  context: string;
  data: any;
}

export class FileLoggerService {
  private static readonly LOG_BASE_DIR = "logs";
  private static readonly API_LOG_DIR = path.join(
    FileLoggerService.LOG_BASE_DIR,
    "api"
  );
  private static readonly DEBUG_LOG_FILE = path.join(
    FileLoggerService.LOG_BASE_DIR,
    "debug.log"
  );
  private static readonly MAX_BODY_SIZE = 100 * 1024; // 100KB
  private static readonly SENSITIVE_HEADERS = [
    "x-token",
    "authorization",
    "cookie",
    "set-cookie",
  ];

  static async saveApiLog(data: ApiLogData): Promise<void> {
    try {
      await this.ensureDirectoryExists(this.API_LOG_DIR);

      const filename = this.generateApiLogFilename(data);
      const filePath = path.join(this.API_LOG_DIR, filename);

      // Redact sensitive data
      const sanitizedData = this.redactSensitiveData(data);

      // Truncate large response bodies
      if (sanitizedData.response.body) {
        const bodyStr = JSON.stringify(sanitizedData.response.body);
        if (bodyStr.length > this.MAX_BODY_SIZE) {
          sanitizedData.response.body = {
            _truncated: true,
            _originalSize: bodyStr.length,
            _preview: bodyStr.substring(0, this.MAX_BODY_SIZE),
          };
        }
      }

      await fs.writeFile(filePath, JSON.stringify(sanitizedData, null, 2));
    } catch (error) {
      // Log error but don't throw - logging should never crash the app
      console.error("FileLoggerService: Failed to save API log", error);
    }
  }

  static async saveDebugLog(data: DebugLogData): Promise<void> {
    try {
      await this.ensureDirectoryExists(this.LOG_BASE_DIR);

      const time = data.timestamp.replace("T", " ").replace("Z", "").slice(0, 19);
      const separator = "=".repeat(80);
      const subSeparator = "-".repeat(80);
      const jsonData = JSON.stringify(data.data, null, 2);

      const block = `${separator}\n[${time}] ${data.functionName} (${data.context})\n${subSeparator}\n${jsonData}\n\n`;
      await fs.appendFile(this.DEBUG_LOG_FILE, block);
    } catch (error) {
      // Log error but don't throw - logging should never crash the app
      console.error("FileLoggerService: Failed to save debug log", error);
    }
  }

  static async clearDebugLog(): Promise<void> {
    try {
      await fs.writeFile(this.DEBUG_LOG_FILE, "");
    } catch (error) {
      // Ignore if file doesn't exist
    }
  }

  private static async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  private static generateApiLogFilename(data: ApiLogData): string {
    const timestamp = data.timestamp.replace(/:/g, "-").replace(/\./g, "-");
    const method = data.request.method;
    const urlPath = this.sanitizeForFilename(data.request.url);
    return `${timestamp}-${method}-${urlPath}.json`;
  }

  private static sanitizeForFilename(str: string): string {
    return str
      .replace(/\//g, "-")
      .replace(/\\/g, "-")
      .replace(/[^a-zA-Z0-9\-_]/g, "_")
      .substring(0, 100); // Limit filename length
  }

  private static redactSensitiveData(data: ApiLogData): ApiLogData {
    const redacted = JSON.parse(JSON.stringify(data));

    // Redact sensitive headers
    if (redacted.request.headers) {
      Object.keys(redacted.request.headers).forEach((key) => {
        if (
          this.SENSITIVE_HEADERS.includes(key.toLowerCase())
        ) {
          redacted.request.headers[key] = "[REDACTED]";
        }
      });
    }

    if (redacted.response.headers) {
      Object.keys(redacted.response.headers).forEach((key) => {
        if (
          this.SENSITIVE_HEADERS.includes(key.toLowerCase())
        ) {
          redacted.response.headers[key] = "[REDACTED]";
        }
      });
    }

    // Redact password fields in request body
    if (redacted.request.body && typeof redacted.request.body === "object") {
      this.redactPasswordFields(redacted.request.body);
    }

    return redacted;
  }

  private static redactPasswordFields(obj: any): void {
    if (!obj || typeof obj !== "object") return;

    Object.keys(obj).forEach((key) => {
      if (key.toLowerCase().includes("password")) {
        obj[key] = "[REDACTED]";
      } else if (typeof obj[key] === "object") {
        this.redactPasswordFields(obj[key]);
      }
    });
  }
}
