import fs from "fs/promises";
import path from "path";
import { envsPlugin } from "../adapters/envs.plugin";

export class LogCleanupService {
  private static readonly LOG_BASE_DIR = "logs";
  private static readonly API_LOG_DIR = path.join(
    LogCleanupService.LOG_BASE_DIR,
    "api"
  );
  private static readonly DEBUG_LOG_DIR = path.join(
    LogCleanupService.LOG_BASE_DIR,
    "debug"
  );

  static async cleanupOldLogs(): Promise<void> {
    try {
      const retentionDays = envsPlugin.LOG_RETENTION_DAYS || 7;

      console.log(
        `[LogCleanupService] Starting log cleanup (retention: ${retentionDays} days)`
      );

      const apiDeleted = await this.cleanupDirectory(
        this.API_LOG_DIR,
        retentionDays
      );
      const debugDeleted = await this.cleanupDirectory(
        this.DEBUG_LOG_DIR,
        retentionDays
      );

      console.log(
        `[LogCleanupService] Cleanup complete - API logs deleted: ${apiDeleted}, Debug logs deleted: ${debugDeleted}`
      );
    } catch (error) {
      console.error("[LogCleanupService] Cleanup failed:", error);
      // Don't throw - cleanup failures shouldn't crash the server
    }
  }

  private static async cleanupDirectory(
    dirPath: string,
    retentionDays: number
  ): Promise<number> {
    try {
      // Check if directory exists
      try {
        await fs.access(dirPath);
      } catch {
        // Directory doesn't exist, nothing to clean
        return 0;
      }

      const files = await fs.readdir(dirPath);
      let deletedCount = 0;

      for (const file of files) {
        const filePath = path.join(dirPath, file);

        try {
          const isOld = await this.isFileOlderThan(filePath, retentionDays);
          if (isOld) {
            await fs.unlink(filePath);
            deletedCount++;
          }
        } catch (error) {
          console.error(
            `[LogCleanupService] Failed to process file ${filePath}:`,
            error
          );
          // Continue with other files
        }
      }

      return deletedCount;
    } catch (error) {
      console.error(
        `[LogCleanupService] Failed to cleanup directory ${dirPath}:`,
        error
      );
      return 0;
    }
  }

  private static async isFileOlderThan(
    filePath: string,
    days: number
  ): Promise<boolean> {
    const stats = await fs.stat(filePath);
    const fileAge = Date.now() - stats.mtime.getTime();
    const maxAge = days * 24 * 60 * 60 * 1000; // Convert days to milliseconds
    return fileAge > maxAge;
  }
}
