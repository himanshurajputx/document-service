import { Injectable, LoggerService } from "@nestjs/common";
import * as winston from "winston";
import * as path from "path";
import * as fs from "fs";
import "winston-daily-rotate-file";

@Injectable()
export class AppLogger implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    const logDir = path.join(__dirname, "..", "..", "..", "logs");

    new winston.transports.DailyRotateFile({
      dirname: logDir,
      filename: "%DATE%-app.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
    });
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    this.logger = winston.createLogger({
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.File({
          filename: path.join(logDir, "error.log"),
          level: "error",
        }),
        new winston.transports.File({
          filename: path.join(logDir, "combined.log"),
        }),
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
      ],
    });
  }

  log(message: string, meta?: any) {
    this.logger.info(message, meta);
  }

  error(message: string, trace?: string, meta?: any) {
    this.logger.error(message, { trace, ...meta });
  }

  warn(message: string, meta?: any) {
    this.logger.warn(message, meta);
  }
}
