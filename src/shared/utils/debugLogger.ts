import {
  DebugLogData,
  FileLoggerService,
} from "../../infrastructure/services/FileLoggerService";
import { envsPlugin } from "../../infrastructure/adapters/envs.plugin";

/**
 * Debug logger utility for instrumenting functions and capturing inputs/outputs
 *
 * @example
 * import { debugLog } from '@/shared/utils/debugLogger';
 *
 * function calculateAguinaldo(salary: number) {
 *   debugLog('calculateAguinaldo', { salary }, 'input');
 *
 *   const result = salary * 0.15; // calculation
 *   debugLog('calculateAguinaldo', { intermediate: result }, 'calculation');
 *
 *   debugLog('calculateAguinaldo', { result }, 'output');
 *   return result;
 * }
 */
export async function debugLog(
  functionName: string,
  data: any,
  context: string = "default"
): Promise<void> {
  // Skip if debug logger is disabled
  if (!envsPlugin.DEBUG_LOGGER_ENABLED) {
    return;
  }

  try {
    const logData: DebugLogData = {
      timestamp: new Date().toISOString(),
      functionName,
      context,
      data,
    };

    await FileLoggerService.saveDebugLog(logData);
  } catch (error) {
    // Log error but don't throw - debugging should never crash the app
    console.error("[debugLogger] Failed to save debug log:", error);
  }
}

/**
 * Clear the debug log file. Useful at the start of a debugging session.
 */
export async function clearDebugLog(): Promise<void> {
  await FileLoggerService.clearDebugLog();
}

/**
 * Decorator for automatic logging of method inputs and outputs
 * Usage: @DebugLog('contextName')
 *
 * Note: This is an experimental feature. For most cases, manual debugLog() calls
 * provide better control and clarity.
 *
 * @example
 * class Calculator {
 *   @DebugLog('calculator')
 *   add(a: number, b: number): number {
 *     return a + b;
 *   }
 * }
 */
export function DebugLog(context: string = "default") {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const functionName = `${target.constructor.name}.${propertyKey}`;

      // Log input
      await debugLog(functionName, { args }, `${context}-input`);

      try {
        const result = await originalMethod.apply(this, args);

        // Log output
        await debugLog(functionName, { result }, `${context}-output`);

        return result;
      } catch (error) {
        // Log error
        await debugLog(functionName, { error }, `${context}-error`);
        throw error;
      }
    };

    return descriptor;
  };
}
