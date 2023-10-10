import winston, {format} from "winston";

const {colorize, timestamp, simple, combine} = format;

const logLevel = process.env['LOG_LEVEL'] || "info";

const logger = winston.createLogger({
    level: logLevel,
    format: combine(colorize(), timestamp(), simple()),
    defaultMeta: { service: 'state' },
    transports: [
      //
      // - Write all logs with importance level of `error` or less to `error.log`
      // - Write all logs with importance level of `info` or less to `combined.log`
      //
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
  });

  export {logger};