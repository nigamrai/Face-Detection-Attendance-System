// src/logger.ts
export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export class Logger {
  static log(level: LogLevel, message: string, ...args: any[]) {
    const timestamp = new Date().toISOString();
    switch (level) {
      case 'info':
        console.info(`[INFO] [${timestamp}]`, message, ...args);
        break;
      case 'warn':
        console.warn(`[WARN] [${timestamp}]`, message, ...args);
        break;
      case 'error':
        console.error(`[ERROR] [${timestamp}]`, message, ...args);
        break;
      case 'debug':
        console.debug(`[DEBUG] [${timestamp}]`, message, ...args);
        break;
      default:
        console.log(`[LOG] [${timestamp}]`, message, ...args);
    }
  }

  static info(message: string, ...args: any[]) {
    this.log('info', message, ...args);
  }
  static warn(message: string, ...args: any[]) {
    this.log('warn', message, ...args);
  }
  static error(message: string, ...args: any[]) {
    this.log('error', message, ...args);
  }
  static debug(message: string, ...args: any[]) {
    this.log('debug', message, ...args);
  }
}

export default Logger;
