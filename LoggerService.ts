import { Service } from "typedi";
import * as winston from "winston";
import * as os from "os";

@Service()
class LoggerService {
  private logger!: winston.Logger;

  constructor() {
    this.configureLogger();
  }

  private configureLogger() {
    const logFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`),
      winston.format.json()
    );

    const transports = [];

    if (process.env.NODE_ENV !== 'production') {
      transports.push(new winston.transports.Console({
        format: winston.format.simple(),
      }));
    } else {
      transports.push(new winston.transports.File({ filename: 'logs/error.log', level: 'error' }));
      transports.push(new winston.transports.File({ filename: 'logs/combined.log' }));
    }

    this.logger = winston.createLogger({
      level: 'info',
      format: logFormat,
      defaultMeta: { service: 'user-service', hostname: os.hostname() },
      transports
    });
  }

  log(message: string, level: string = 'info') {
    this.logger.log({ level, message });
  }

  info(message: string) {
    this.log(message, 'info');
  }

  error(message: string) {
    this.log(message, 'error');
  }

  debug(message: string) {
    this.log(message, 'debug');
  }
}

export { LoggerService };
