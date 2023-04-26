import winston from "winston";

/**
 * defined logger instance definition used for debugging with 2 level error and info
 */

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({
      filename: `log/${new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "_")}/error.log`,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      level: "error",
    }),
    new winston.transports.File({
      filename: `log/${new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "_")}/combined.log`,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
  handleExceptions: true,
  exitOnError: false,
});
