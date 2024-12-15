#!/usr/bin/env node
import { spawn, type ChildProcess } from 'child_process';
import { resolve as pathResolve, dirname } from 'path';
import chalk from 'chalk';
import { createServer } from 'net';
import { fileURLToPath } from 'url';
import { LogClient } from './standalone-log-client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Track child processes for cleanup
const childProcesses: ChildProcess[] = [];

// Convert environment variables to numbers with fallbacks
const LOG_SERVER_PORT = Number(process.env.LOG_SERVER_PORT) || 3333;
const WEB_PORT = Number(process.env.LOG_WEB_PORT) || 3334;

// Create log client for sending logs
const logClient = new LogClient(`ws://localhost:${LOG_SERVER_PORT}`, 2000, 20);

// Function to create a prefixed logger
const createLogger = (prefix: string, color: 'blue' | 'yellow' | 'magenta' | 'green') => ({
  log: (...args: any[]) => {
    // Only log to terminal if it's a critical system message
    if (prefix === '[System]' && args[0]?.includes('Starting') || args[0]?.includes('ready')) {
      console.log(chalk[color](prefix), ...args);
    }
    // Always send to log server if connected
    if (logClient) {
      try {
        logClient.sendLog('system', 'info', `${prefix} ${args.join(' ')}`);
      } catch (error) {
        // Fallback to console only if log server send fails
        console.log(chalk[color](prefix), ...args);
      }
    }
  },
  info: (...args: any[]) => {
    if (logClient) {
      logClient.sendLog('system', 'info', `${prefix} ${args.join(' ')}`);
    }
  },
  debug: (...args: any[]) => {
    if (logClient) {
      logClient.sendLog('system', 'debug', `${prefix} ${args.join(' ')}`);
    }
  },
  warn: (...args: any[]) => {
    // Show warnings in terminal only for critical system issues
    if (prefix === '[System]') {
      console.warn(chalk[color](prefix), ...args);
    }
    if (logClient) {
      logClient.sendLog('system', 'warn', `${prefix} ${args.join(' ')}`);
    }
  },
  error: (...args: any[]) => {
    // Always show errors in terminal
    console.error(chalk[color](prefix), ...args);
    if (logClient) {
      logClient.sendLog('system', 'error', `${prefix} ${args.join(' ')}`);
    }
  }
});

// Create loggers for each component
const systemLogger = createLogger('[System]', 'blue');
const logServerLogger = createLogger('[Log Server]', 'yellow');
const webViewerLogger = createLogger('[Web Viewer]', 'magenta');
const devServerLogger = createLogger('[Dev Server]', 'green');

// Cleanup function
const cleanup = () => {
  systemLogger.log('Cleaning up processes...');
  childProcesses.forEach(proc => {
    if (!proc.killed) {
      try {
        proc.kill();
      } catch (err) {
        // Ignore errors during cleanup
      }
    }
  });
};

// Handle process termination
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
process.on('uncaughtException', (error) => {
  systemLogger.error('Uncaught exception:', error);
  cleanup();
  process.exit(1);
});

// Promise to wait for a specific port to be available
const waitForPort = (port: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    const server = createServer();
    let retries = 0;
    const maxRetries = 3;
    
    const tryPort = () => {
      systemLogger.log(`Checking if port ${port} is available (attempt ${retries + 1}/${maxRetries})...`);
      
      server.once('error', (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE') {
          systemLogger.log(`Port ${port} is in use, retrying...`);
          if (retries >= maxRetries) {
            reject(new Error(`Port ${port} is in use after ${maxRetries} attempts`));
            return;
          }
          retries++;
          setTimeout(tryPort, 1000);
        } else {
          reject(err);
        }
      });

      server.once('listening', () => {
        systemLogger.log(`Port ${port} is available`);
        server.close(() => resolve());
      });

      server.listen(port);
    };

    tryPort();
  });
};

// Start log server and wait for it to be ready
async function startLogServer(): Promise<void> {
  try {
    systemLogger.log('Checking port availability...');
    await waitForPort(LOG_SERVER_PORT);
  } catch (error) {
    logServerLogger.error('Port check failed:', error);
    throw error;
  }
  
  return new Promise((resolve, reject) => {
    try {
      const serverPath = pathResolve(__dirname, 'standalone-log-server.ts');
      systemLogger.log(`Starting log server from: ${serverPath}`);
      
      const logServer = spawn('node', ['--import', 'tsx', serverPath], {
        stdio: 'inherit',
        env: {
          ...process.env,
          LOG_SERVER_PORT: String(LOG_SERVER_PORT),
          FORCE_COLOR: 'true',
          IS_LOG_SERVER: 'true',
          NODE_ENV: 'development'
        }
      });

      childProcesses.push(logServer);

      logServer.on('spawn', () => {
        systemLogger.log('Log server process spawned');
      });

      logServer.on('error', (error) => {
        logServerLogger.error('Failed to start log server:', error);
        reject(error);
      });

      logServer.on('exit', (code) => {
        if (code !== 0) {
          const error = new Error(`Log server exited with code ${code}`);
          logServerLogger.error('Log server failed:', error);
          reject(error);
        }
      });

      // Give the server a moment to start
      setTimeout(() => {
        systemLogger.log('Log server startup timeout completed');
        resolve();
      }, 2000);
    } catch (error) {
      logServerLogger.error('Failed to start log server:', error);
      reject(error);
    }
  });
}

// Start web viewer and wait for it to be ready
async function startWebViewer(): Promise<void> {
  systemLogger.log('Checking web viewer port availability...');
  await waitForPort(WEB_PORT);
  
  return new Promise((resolve, reject) => {
    try {
      const viewerPath = pathResolve(__dirname, 'web-log-viewer.ts');
      systemLogger.log(`Starting web viewer from: ${viewerPath}`);
      
      const webViewer = spawn('node', ['--import', 'tsx', viewerPath], {
        stdio: 'inherit',
        env: {
          ...process.env,
          LOG_SERVER_PORT: String(LOG_SERVER_PORT),
          LOG_WEB_PORT: String(WEB_PORT),
          FORCE_COLOR: 'true'
        }
      });

      childProcesses.push(webViewer);

      webViewer.on('spawn', () => {
        systemLogger.log('Web viewer process spawned');
      });

      webViewer.on('error', (error) => {
        webViewerLogger.error('Failed to start web viewer:', error);
        reject(error);
      });

      webViewer.on('exit', (code) => {
        if (code !== 0) {
          const error = new Error(`Web viewer exited with code ${code}`);
          webViewerLogger.error('Web viewer failed:', error);
          reject(error);
        }
      });

      // Give the viewer a moment to start
      setTimeout(() => {
        systemLogger.log('Web viewer startup timeout completed');
        resolve();
      }, 2000);
    } catch (error) {
      webViewerLogger.error('Failed to start web viewer:', error);
      reject(error);
    }
  });
}

// Start VitePress dev server
async function startDevServer(): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      // Connect to log server first
      await logClient.connect();
      
      // Change directory to workspace root
      const workspaceRoot = pathResolve(__dirname, '../../../../');
      systemLogger.log(`Changing to workspace root: ${workspaceRoot}`);
      process.chdir(workspaceRoot);

      systemLogger.log('Starting VitePress dev server...');
      const devServer = spawn('pnpm', ['run', 'docs:dev'], {
        // Redirect stdin to inherit for interactive mode, but capture stdout/stderr
        stdio: ['inherit', 'pipe', 'pipe'],
        env: {
          ...process.env,
          FORCE_COLOR: 'true',
          NODE_ENV: 'development',
          // Disable noisy npm logs
          npm_config_loglevel: 'warn'
        },
        shell: true
      });

      childProcesses.push(devServer);

      devServer.stdout?.on('data', (data) => {
        const message = data.toString().trim();
        if (message) {
          // Only send to web viewer
          logClient.sendLog('dev', 'info', message);
        }
      });

      devServer.stderr?.on('data', (data) => {
        const message = data.toString().trim();
        if (message) {
          // Only show errors in terminal if they're critical
          if (message.includes('Error') || message.includes('error')) {
            console.error(chalk.red('[Dev Server Error]'), message);
          }
          logClient.sendLog('dev', 'error', message);
        }
      });

      devServer.on('spawn', () => {
        logClient.sendLog('system', 'info', 'VitePress dev server process spawned');
      });

      devServer.on('error', (error) => {
        logClient.sendLog('dev', 'error', `Failed to start dev server: ${error.message}`);
        reject(error);
      });

      devServer.on('exit', (code) => {
        if (code !== 0) {
          const error = new Error(`Dev server exited with code ${code}`);
          logClient.sendLog('dev', 'error', `Dev server failed: ${error.message}`);
          reject(error);
        }
      });

      // Give VitePress a moment to start
      setTimeout(() => {
        logClient.sendLog('system', 'info', 'VitePress startup timeout completed');
        resolve();
      }, 3000);
    } catch (error) {
      logClient.sendLog('dev', 'error', `Failed to start dev server: ${error.message}`);
      reject(error);
    }
  });
}

// Main startup sequence
async function start() {
  try {
    systemLogger.log('Starting services...');

    // Start log server first
    systemLogger.log('Starting log server...');
    await startLogServer();
    systemLogger.log('Log server is ready');

    // Then start web viewer
    systemLogger.log('Starting web viewer...');
    await startWebViewer();
    systemLogger.log('Web viewer is ready');

    // Finally start dev server
    systemLogger.log('Starting dev server...');
    await startDevServer();
    systemLogger.log('All services started successfully');

  } catch (error) {
    systemLogger.error('Failed to start services:', error);
    cleanup();
    process.exit(1);
  }
}

// Start everything
start(); 