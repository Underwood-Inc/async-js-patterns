import WebSocket, { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { logger, LogLevel, LogCategory } from './logger';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set environment variables before importing logger
process.env.IS_LOG_SERVER = 'true';
process.env.NODE_ENV = 'development';

interface LogMessage {
  type: 'log';
  entry: {
    category: LogCategory;
    level: LogLevel;
    message: string;
    data?: any;
  };
}

const PORT = Number(process.env.LOG_SERVER_PORT) || 3333;

// Create HTTP server
const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Log Server Running');
});

// Create WebSocket server
const wss = new WebSocketServer({ server });

// Store connected clients
const clients = new Set<WebSocket>();

// Initialize logger with development settings
logger.enable(true);
logger.enableCategory('system', true);
logger.enableCategory('performance', true);
logger.enableLevel('debug', true);
logger.enableLevel('info', true);

// Handle WebSocket connections
wss.on('connection', (ws: WebSocket) => {
  const clientId = Math.random().toString(36).substr(2, 9);
  console.log(`Client ${clientId} connected`);
  clients.add(ws);
  
  // Send welcome message
  const welcomeMessage = {
    type: 'log',
    data: {
      category: 'system',
      level: 'info',
      message: `Client ${clientId} connected to log server`,
      timestamp: Date.now()
    }
  };
  ws.send(JSON.stringify(welcomeMessage));

  // Send initial log history
  const history = logger.getLogHistory();
  console.log(`Sending ${history.length} history entries to client ${clientId}`);
  ws.send(JSON.stringify({ type: 'history', data: history }));

  ws.on('message', (data: Buffer) => {
    try {
      console.log(`Received message from client ${clientId}:`, data.toString());
      const message = JSON.parse(data.toString()) as LogMessage;
      if (message.type === 'log') {
        const { entry } = message;
        // Forward log to Node.js logger
        switch (entry.level) {
          case 'debug':
            logger.debug(entry.category, entry.message, entry.data);
            break;
          case 'info':
            logger.info(entry.category, entry.message, entry.data);
            break;
          case 'warn':
            logger.warn(entry.category, entry.message, entry.data);
            break;
          case 'error':
            logger.error(entry.category, entry.message, entry.data);
            break;
        }

        // Broadcast to all connected clients
        const broadcastMessage = JSON.stringify({
          type: 'log',
          data: entry
        });
        
        console.log(`Broadcasting message to ${clients.size} clients`);
        clients.forEach(client => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(broadcastMessage);
          }
        });
      }
    } catch (error) {
      console.error(`Error processing message from client ${clientId}:`, error);
      logger.error('system', 'Failed to process log message', { error });
    }
  });

  ws.on('close', () => {
    console.log(`Client ${clientId} disconnected`);
    clients.delete(ws);
    logger.debug('system', `Client ${clientId} disconnected from log server`);
  });

  ws.on('error', (error) => {
    console.error(`Error from client ${clientId}:`, error);
    logger.error('system', 'WebSocket error', { error });
  });
});

// Start server
try {
  server.listen(PORT, () => {
    logger.info('system', `Log server listening on port ${PORT}`);
    logger.info('system', `WebSocket URL: ws://localhost:${PORT}`);
  });

  server.on('error', (error) => {
    logger.error('system', 'Server error', { error });
    process.exit(1);
  });
} catch (error) {
  logger.error('system', 'Failed to start server', { error });
  process.exit(1);
}

// Handle server shutdown
process.on('SIGINT', () => {
  logger.info('system', 'Shutting down log server...');
  wss.close(() => {
    server.close(() => {
      process.exit(0);
    });
  });
});

// Export for programmatic usage
export { server, wss }; 