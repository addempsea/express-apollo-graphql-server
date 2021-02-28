import winston from 'winston';

const myFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.printf(
    msg => `[${new Date(msg.timestamp).toString()}] - ${msg.level}:${msg.message}`
  )
);
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: myFormat
    })
  ]
});

logger.stream = {
  write(message) {
    logger.info(message);
  },
};

export default logger;
