#!/usr/bin/env node
import { connectToLogServer } from './standalone-log-client';
import chalk from 'chalk';
import { createInterface } from 'readline';
import { spawn } from 'child_process';
import open from 'open';

const PORT = process.env.LOG_SERVER_PORT || 3333;
const WEB_PORT = process.env.LOG_WEB_PORT || 3334;

interface FilterState {
  categories: Set<string>;
  levels: Set<string>;
}

const filters: FilterState = {
  categories: new Set(['system', 'performance', 'tooltip', 'markdown', 'dev', 'build']),
  levels: new Set(['debug', 'info', 'warn', 'error'])
};

// ANSI escape codes for terminal control
const clearScreen = '\x1b[2J\x1b[0;0H';
const hideCursor = '\x1b[?25l';
const showCursor = '\x1b[?25h';

// Create readline interface
const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

// Connect to log server
const client = connectToLogServer();

// Format log entry
function formatLogEntry(entry: any) {
  const timestamp = new Date(entry.timestamp || Date.now()).toISOString();
  const level = chalk[getLevelColor(entry.level)](entry.level.toUpperCase());
  const category = chalk.cyan(`[${entry.category}]`);
  
  let output = `${chalk.gray(timestamp)} ${level} ${category} ${entry.message}`;
  
  if (entry.data) {
    try {
      const dataStr = JSON.stringify(entry.data, null, 2);
      output += '\n' + chalk.gray(dataStr.split('\n').map(line => '  ' + line).join('\n'));
    } catch (e) {
      output += '\n  [Complex Data]';
    }
  }
  
  return output;
}

function getLevelColor(level: string): keyof typeof chalk {
  switch (level) {
    case 'debug': return 'blue';
    case 'info': return 'green';
    case 'warn': return 'yellow';
    case 'error': return 'red';
    default: return 'white';
  }
}

// Handle log messages
client.onMessage((message) => {
  if (message.type === 'history') {
    console.clear();
    const entries = Array.isArray(message.data) ? message.data : [message.data];
    entries
      .filter(entry => 
        filters.categories.has(entry.category) && 
        filters.levels.has(entry.level)
      )
      .forEach(entry => {
        console.log(formatLogEntry(entry));
      });
  } else if (message.type === 'log') {
    const entry = message.data;
    if (filters.categories.has(entry.category) && filters.levels.has(entry.level)) {
      console.log(formatLogEntry(entry));
    }
  }
});

// Print help menu
function printHelp() {
  console.log(chalk.bold('\nCommands:'));
  console.log('  h, help     - Show this help menu');
  console.log('  c, clear    - Clear the screen');
  console.log('  f, filter   - Toggle filters');
  console.log('  o, open     - Open web viewer in browser');
  console.log('  q, quit     - Quit the viewer');
  console.log('\nPress any key to continue...');
}

// Handle user input
rl.on('line', (input) => {
  switch (input.trim().toLowerCase()) {
    case 'h':
    case 'help':
      printHelp();
      break;
      
    case 'c':
    case 'clear':
      console.clear();
      break;
      
    case 'f':
    case 'filter':
      console.log('\nCategories (space to toggle):');
      Array.from(filters.categories).forEach(cat => 
        console.log(`  [${filters.categories.has(cat) ? 'x' : ' '}] ${cat}`)
      );
      console.log('\nLevels (space to toggle):');
      Array.from(filters.levels).forEach(level => 
        console.log(`  [${filters.levels.has(level) ? 'x' : ' '}] ${level}`)
      );
      break;
      
    case 'o':
    case 'open':
      open(`http://localhost:${WEB_PORT}`);
      break;
      
    case 'q':
    case 'quit':
      process.stdout.write(showCursor);
      client.disconnect();
      rl.close();
      process.exit(0);
      break;
  }
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  process.stdout.write(showCursor);
  client.disconnect();
  rl.close();
  process.exit(0);
});

// Initialize viewer
console.clear();
process.stdout.write(hideCursor);
console.log(chalk.bold('Log Viewer'));
console.log(chalk.gray(`Connected to ws://localhost:${PORT}`));
console.log(chalk.gray('Type "h" or "help" for commands\n'));

// Connect to server
client.connect();

// Start web viewer in background
const webViewer = spawn('node', ['-r', 'ts-node/register', './web-log-viewer.ts'], {
  detached: true,
  stdio: 'ignore'
});
webViewer.unref(); 