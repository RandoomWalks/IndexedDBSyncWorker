import { Service } from "typedi";
import * as winston from "winston";
import * as os from "os";

/**
 * Service class for handling logging throughout the application.
 * This service uses winston for logging with different transports based on the environment.
 */
@Service()
class LoggerService {
  private logger!: winston.Logger; // Use definite assignment assertion as the logger is initialized in configureLogger

  constructor() {
    this.configureLogger();
  }

  /**
   * Configures the logger with appropriate transports and settings depending on the environment.
   */
  private configureLogger() {
    // Combine multiple formatting options for logging
    const logFormat = winston.format.combine(
      winston.format.timestamp(), // Add timestamp to each log entry
      winston.format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`), // Custom log format
      winston.format.json() // Output logs in JSON format
    );

    const transports = [];

    // Use console logging for non-production environments for easier debugging
    if (process.env.NODE_ENV !== 'production') {
      transports.push(new winston.transports.Console({
        format: winston.format.simple(), // Simple format for console output
      }));
    } else {
      // In production, log errors separately and combined logs for general information
      transports.push(new winston.transports.File({ filename: 'logs/error.log', level: 'error' }));
      transports.push(new winston.transports.File({ filename: 'logs/combined.log' }));
    }

    // Create a logger instance with the specified level, format, and transports
    this.logger = winston.createLogger({
      level: 'info', // Default log level
      format: logFormat,
      defaultMeta: { service: 'user-service', hostname: os.hostname() }, // Metadata to include with every log
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
