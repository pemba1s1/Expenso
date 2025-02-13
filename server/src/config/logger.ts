import winston from "winston";
import expressWinston from "express-winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()],
});

export const requestLogger = expressWinston.logger({
  winstonInstance: logger,
  meta: true,
  expressFormat: true,
  colorize: false,
});

export const errorLogger = expressWinston.errorLogger({
  winstonInstance: logger,
});

export default logger;
