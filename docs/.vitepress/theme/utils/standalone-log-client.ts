import WebSocket from 'ws';
import { logger, LogLevel, LogCategory } from './logger';

interface LogMessage {
  type: 'log' | 'history';
  data: LogEntry | LogEntry[];
}

interface LogEntry {
  category: LogCategory;
  level: LogLevel;
  message: string;
  data?: any;
  timestamp?: number;
}

export class LogClient {
  private ws: WebSocket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private readonly url: string;
  private readonly reconnectInterval: number;
  private readonly maxRetries: number;
  private retryCount: number = 0;
  private onMessageCallback: ((message: LogMessage) => void) | null = null;
  private messageBuffer: LogEntry[] = [];
  private readonly maxBufferSize: number = 1000;
  private isConnecting: boolean = false;

  constructor(url: string = 'ws://localhost:3333', reconnectInterval: number = 5000, maxRetries: number = 10) {
    this.url = url;
    this.reconnectInterval = reconnectInterval;
    this.maxRetries = maxRetries;
  }

  async connect(): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) return;

    this.isConnecting = true;

    try {
      await this.attemptConnection();
    } catch (error) {
      logger.error('system', 'Failed to connect to log server', { error });
      this.scheduleReconnect();
    } finally {
      this.isConnecting = false;
    }
  }

  private attemptConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.on('open', () => {
          logger.info('system', 'Connected to log server');
          this.retryCount = 0;
          if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
          }

          // Send buffered messages
          this.flushBuffer();
          resolve();
        });

        this.ws.on('message', (data: Buffer) => {
          try {
            const message = JSON.parse(data.toString()) as LogMessage;
            if (this.onMessageCallback) {
              this.onMessageCallback(message);
            }

            if (message.type === 'history') {
              const entries = Array.isArray(message.data) ? message.data : [message.data];
              logger.info('system', 'Received log history', { 
                entries: entries.length 
              });
            }
          } catch (error) {
            logger.error('system', 'Failed to parse message', { error });
          }
        });

        this.ws.on('close', () => {
          logger.warn('system', 'Disconnected from log server');
          this.scheduleReconnect();
        });

        this.ws.on('error', (error) => {
          logger.error('system', 'WebSocket error', { error });
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  private scheduleReconnect() {
    if (!this.reconnectTimer && this.retryCount < this.maxRetries) {
      this.retryCount++;
      const delay = Math.min(this.reconnectInterval * Math.pow(1.5, this.retryCount - 1), 30000);
      
      this.reconnectTimer = setTimeout(() => {
        logger.info('system', 'Attempting to reconnect...', { 
          attempt: this.retryCount,
          maxRetries: this.maxRetries
        });
        this.connect();
      }, delay);
    } else if (this.retryCount >= this.maxRetries) {
      logger.error('system', 'Max reconnection attempts reached', {
        attempts: this.retryCount
      });
    }
  }

  private flushBuffer() {
    if (this.messageBuffer.length > 0) {
      logger.info('system', 'Sending buffered messages', { 
        count: this.messageBuffer.length 
      });

      while (this.messageBuffer.length > 0) {
        const entry = this.messageBuffer.shift();
        if (entry) {
          this.sendLog(entry.category, entry.level, entry.message, entry.data);
        }
      }
    }
  }

  sendLog(category: LogCategory, level: LogLevel, message: string, data?: any) {
    const entry = {
      category,
      level,
      message,
      data,
      timestamp: Date.now()
    };

    if (this.ws?.readyState !== WebSocket.OPEN) {
      // Buffer the message if not connected
      if (this.messageBuffer.length < this.maxBufferSize) {
        this.messageBuffer.push(entry);
        if (this.messageBuffer.length === this.maxBufferSize) {
          logger.warn('system', 'Message buffer full, oldest messages will be dropped');
        }
      }
      return;
    }

    const logMessage = {
      type: 'log' as const,
      entry
    };

    try {
      this.ws.send(JSON.stringify(logMessage));
    } catch (error) {
      logger.error('system', 'Failed to send log message', { error });
      this.messageBuffer.push(entry);
    }
  }

  onMessage(callback: (message: LogMessage) => void) {
    this.onMessageCallback = callback;
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  getBufferedMessages() {
    return [...this.messageBuffer];
  }

  clearBuffer() {
    this.messageBuffer = [];
  }
}

// Export singleton instance
export const logClient = new LogClient();

// Export convenience methods
export const connectToLogServer = (url?: string) => {
  if (url) {
    return new LogClient(url);
  }
  return logClient;
}; 