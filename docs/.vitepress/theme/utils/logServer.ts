import { WebSocketServer, WebSocket } from 'ws';
import { ViteDevServer } from 'vite';
import { logger, LogLevel, LogCategory } from './logger';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import type { IncomingMessage } from 'node:http';
import type { Socket } from 'node:net';

interface LogMessage {
  type: 'log';
  entry: {
    category: LogCategory;
    level: LogLevel;
    message: string;
    data?: any;
  };
}

export function createLogServer(viteServer: ViteDevServer) {
  // Create WebSocket server
  const wss = new WebSocketServer({ noServer: true });

  // Handle WebSocket connections
  wss.on('connection', (ws: WebSocket) => {
    logger.debug('system', 'Browser connected to log server');

    ws.on('message', (data: Buffer) => {
      try {
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
        }
      } catch (error) {
        logger.error('system', 'Failed to process browser log', { error });
      }
    });

    ws.on('close', () => {
      logger.debug('system', 'Browser disconnected from log server');
    });
  });

  // Upgrade HTTP connections to WebSocket
  viteServer.httpServer?.on('upgrade', (request: IncomingMessage, socket: Socket, head: Buffer) => {
    // Handle both /_logs and /web-patterns/_logs paths
    if (request.url === '/_logs' || request.url === '/web-patterns/_logs') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    }
  });

  // Clean up on server close
  viteServer.httpServer?.on('close', () => {
    wss.close();
  });
}

// Export function to initialize the log server
export function setupLogServer(app: ViteDevServer) {
  // Create a new terminal for logs
  const logViewerPath = resolve(__dirname, 'logViewer.ts');
  const logTerminal = spawn('node', ['-r', 'ts-node/register', logViewerPath], {
    stdio: ['pipe', 'pipe', 'pipe'],
    shell: true
  });

  // Handle log terminal output
  logTerminal.stdout?.on('data', (data: Buffer) => {
    process.stdout.write(data);
  });

  logTerminal.stderr?.on('data', (data: Buffer) => {
    process.stderr.write(data);
  });

  // Create WebSocket server for browser logs
  createLogServer(app);

  return () => {
    // Cleanup function
    logTerminal.kill();
  };
} 