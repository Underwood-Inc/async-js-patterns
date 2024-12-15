import { logger, LogLevel, LogCategory } from './logger';

interface LogMessage {
  type: 'log';
  data: {
    category: LogCategory;
    level: LogLevel;
    message: string;
    data?: any;
  };
}

// Initialize logger in Node.js mode
logger.enable(true);

// Enable all categories and levels
const categories: LogCategory[] = ['performance', 'tooltip', 'markdown', 'dev', 'system', 'build'];
const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];

categories.forEach(category => logger.enableCategory(category, true));
levels.forEach(level => logger.enableLevel(level, true));

// Handle process signals
process.on('SIGINT', () => {
  logger.debug('system', 'Log viewer shutting down');
  process.exit(0);
});

process.on('message', (message: LogMessage) => {
  try {
    const { type, data } = message;
    if (type === 'log') {
      const { category, level, message: logMessage, data: logData } = data;
      switch (level) {
        case 'debug':
          logger.debug(category, logMessage, logData);
          break;
        case 'info':
          logger.info(category, logMessage, logData);
          break;
        case 'warn':
          logger.warn(category, logMessage, logData);
          break;
        case 'error':
          logger.error(category, logMessage, logData);
          break;
      }
    }
  } catch (error) {
    logger.error('system', 'Failed to process log message', { error });
  }
});

// Keep the process alive
setInterval(() => {}, 1000); 