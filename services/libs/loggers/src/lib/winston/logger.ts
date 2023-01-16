import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import DailyRotateFile = require('winston-daily-rotate-file');
import * as winston from 'winston';
export interface LoggerFactoryOptions {
  serviceName: string;
}
export const winstonLoggerFactory = (options: LoggerFactoryOptions) =>
  WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
          }),
          nestWinstonModuleUtilities.format.nestLike()
        ),
      }),
      new DailyRotateFile({
        filename: `logs/${options.serviceName}-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
      }),
    ],
  });
