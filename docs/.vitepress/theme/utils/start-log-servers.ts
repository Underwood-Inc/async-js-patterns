#!/usr/bin/env node
import { spawn } from 'child_process';
import { resolve } from 'path';
import open from 'open';

const LOG_SERVER_PORT = process.env.LOG_SERVER_PORT || 3333;
const WEB_PORT = process.env.LOG_WEB_PORT || 3334;

// Start log server
const logServer = spawn('node', ['-r', 'ts-node/register', './standalone-log-server.ts'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    LOG_SERVER_PORT
  }
});

// Start web viewer
const webViewer = spawn('node', ['-r', 'ts-node/register', './web-log-viewer.ts'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    LOG_SERVER_PORT,
    LOG_WEB_PORT: WEB_PORT
  }
});

// Start CLI viewer
const cliViewer = spawn('node', ['-r', 'ts-node/register', './cli-log-viewer.ts'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    LOG_SERVER_PORT,
    LOG_WEB_PORT: WEB_PORT,
    OPENED_FROM_CLI: 'true'
  }
});

// Handle process termination
process.on('SIGINT', () => {
  logServer.kill();
  webViewer.kill();
  cliViewer.kill();
  process.exit(0);
});

// Handle child process errors
[logServer, webViewer, cliViewer].forEach(proc => {
  proc.on('error', (error) => {
    console.error(`Process error:`, error);
  });
  
  proc.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`Process exited with code ${code}`);
    }
  });
}); 