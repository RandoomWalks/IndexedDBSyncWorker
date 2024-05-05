import { Service } from "typedi";
import * as winston from "winston";

@Service()
export class LoggerService {
  private logger = winston.createLogger({
    level: 'info',
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'sync.log' })
    ]
  });

  public log(message: string, level: string = 'info') {
    console.log(`[LoggerService] Logging message: ${message} (level: ${level})`);

    this.logger.log({ level, message });
  }
}

