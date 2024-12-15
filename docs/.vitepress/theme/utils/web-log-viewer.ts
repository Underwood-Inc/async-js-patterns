import express from 'express';
import { createServer } from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import { resolve, dirname } from 'path';
import open from 'open';
import { LogClient } from './standalone-log-client';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.LOG_WEB_PORT || 3334;
const LOG_SERVER_PORT = process.env.LOG_SERVER_PORT || 3333;

// Create log server client with retry
const logClient = new LogClient(`ws://localhost:${LOG_SERVER_PORT}`, 2000, 20);
const messageBuffer: any[] = [];

// Keep track of connected clients
const clients = new Set<WebSocket>();

// Add initial debug message
messageBuffer.push({
  category: 'system',
  level: 'info',
  message: 'Log viewer started',
  timestamp: Date.now()
});

// Connect to log server with retry
async function connectLogServer() {
  while (true) {
    try {
      await logClient.connect();
      console.log('Connected to log server');
      
      // Send connection status to all clients
      const statusMessage = {
        type: 'log',
        data: {
          category: 'system',
          level: 'info',
          message: 'Log server connected',
          timestamp: Date.now()
        }
      };
      broadcast(statusMessage);
      
      break;
    } catch (error) {
      console.error('Failed to connect to log server, retrying in 2s:', error);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

// Broadcast message to all connected clients
function broadcast(message: any) {
  const messageStr = JSON.stringify(message);
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageStr);
    }
  });
}

// Start connection
connectLogServer().catch(error => {
  console.error('Fatal error connecting to log server:', error);
  const errorMessage = {
    type: 'log',
    data: {
      category: 'system',
      level: 'error',
      message: 'Failed to connect to log server',
      data: { error: error.message },
      timestamp: Date.now()
    }
  };
  broadcast(errorMessage);
});

// Add log formatting utilities
function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const millis = date.getMilliseconds().toString().padStart(3, '0');
  return `${hours}:${minutes}:${seconds}.${millis}`;
}

function formatLogData(data: any): string | null {
  if (!data) return null;

  // Handle special cases
  if (data.error instanceof Error) {
    return `Error: ${data.error.message}\n${data.error.stack || ''}`;
  }

  if (data.duration !== undefined) {
    return `Duration: ${data.duration}ms`;
  }

  if (data.progress !== undefined && data.total !== undefined) {
    const percent = Math.round((data.progress / data.total) * 100);
    return `Progress: ${data.progress}/${data.total} (${percent}%)`;
  }

  // Format objects and arrays
  if (typeof data === 'object') {
    // Filter out null/undefined values and empty objects/arrays
    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => {
        if (v === null || v === undefined) return false;
        if (typeof v === 'object' && Object.keys(v).length === 0) return false;
        if (Array.isArray(v) && v.length === 0) return false;
        return true;
      })
    );

    if (Object.keys(cleaned).length === 0) return null;
    
    return JSON.stringify(cleaned, null, 2)
      .replace(/"([^"]+)":/g, '$1:') // Remove quotes from property names
      .split('\n')
      .map(line => line.trimEnd()) // Remove trailing spaces
      .join('\n');
  }

  return String(data);
}

// Group logs by category for better organization
function groupLogsByCategory(logs: any[]): Record<string, any[]> {
  return logs.reduce((groups: Record<string, any[]>, log) => {
    const category = log.category || 'uncategorized';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(log);
    return groups;
  }, {});
}

// Update the message handler to include formatted data
logClient.onMessage((message) => {
  if (message.type === 'log' && !Array.isArray(message.data)) {
    const enhancedData = {
      ...message.data,
      formattedTimestamp: formatTimestamp(message.data.timestamp || Date.now()),
      formattedData: message.data.data ? formatLogData(message.data.data) : null
    };
    messageBuffer.push(enhancedData);
    if (messageBuffer.length > 1000) {
      messageBuffer.shift();
    }
    broadcast({ type: 'log', data: enhancedData });
  } else if (message.type === 'history') {
    const enhancedHistory = Array.isArray(message.data) 
      ? message.data.map(entry => ({
          ...entry,
          formattedTimestamp: formatTimestamp(entry.timestamp || Date.now()),
          formattedData: entry.data ? formatLogData(entry.data) : null
        }))
      : message.data;
    broadcast({ type: 'history', data: enhancedHistory });
  }
});

// Serve static files
app.use(express.static(resolve(__dirname, '../public')));

// Serve the viewer page
app.get('/', (_, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Log Viewer</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          margin: 0;
          padding: 0;
          background: #1e1e1e;
          color: #d4d4d4;
          height: 100vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .log-container {
          display: flex;
          gap: 20px;
          padding: 20px;
          height: calc(100vh - 60px); /* Account for controls height */
          overflow: hidden;
        }
        .category-section {
          flex: 1;
          min-width: 300px;
          background: #252526;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          max-height: 100%;
        }
        .category-header {
          font-size: 14px;
          font-weight: bold;
          padding: 10px;
          border-bottom: 1px solid #3e3e42;
          color: #569cd6;
          background: #2d2d2d;
          position: sticky;
          top: 0;
          z-index: 1;
        }
        .category-logs {
          flex: 1;
          overflow-y: auto;
          padding: 10px;
          scrollbar-width: thin;
          scrollbar-color: #454545 #2d2d2d;
        }
        .category-logs::-webkit-scrollbar {
          width: 8px;
        }
        .category-logs::-webkit-scrollbar-track {
          background: #2d2d2d;
        }
        .category-logs::-webkit-scrollbar-thumb {
          background-color: #454545;
          border-radius: 4px;
        }
        .log-entry {
          font-family: 'Consolas', 'Monaco', monospace;
          font-size: 12px;
          margin-bottom: 8px;
          padding: 4px 8px;
          border-radius: 2px;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .timestamp {
          color: #808080;
        }
        .level {
          font-weight: bold;
          padding: 2px 4px;
          border-radius: 2px;
          margin: 0 4px;
        }
        .level-debug { color: #569cd6; }
        .level-info { color: #6a9955; }
        .level-warn { color: #dcdcaa; }
        .level-error { color: #f14c4c; }
        .data {
          margin-top: 4px;
          padding: 4px 8px;
          background: #2d2d2d;
          border-radius: 2px;
          color: #9cdcfe;
        }
        .controls {
          padding: 10px;
          background: #252526;
          border-top: 1px solid #3e3e42;
          display: flex;
          gap: 10px;
          align-items: center;
          height: 40px;
        }
        button {
          background: #0e639c;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 2px;
          cursor: pointer;
          font-size: 12px;
          height: 28px;
          display: flex;
          align-items: center;
        }
        button:hover {
          background: #1177bb;
        }
        button.active {
          background: #1177bb;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
        }
        .auto-scroll-indicator {
          margin-left: auto;
          color: #808080;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div id="log-container" class="log-container"></div>
      <div class="controls">
        <button onclick="clearLogs()">Clear Logs</button>
        <button id="autoScrollBtn" onclick="toggleAutoScroll()">Auto-scroll</button>
        <button id="timestampsBtn" onclick="toggleTimestamps()">Timestamps</button>
        <span class="auto-scroll-indicator" id="autoScrollIndicator"></span>
      </div>
      <script>
        let autoScroll = true;
        let showTimestamps = true;
        const logContainer = document.getElementById('log-container');
        const autoScrollBtn = document.getElementById('autoScrollBtn');
        const timestampsBtn = document.getElementById('timestampsBtn');
        const autoScrollIndicator = document.getElementById('autoScrollIndicator');
        const ws = new WebSocket('ws://' + window.location.host);
        const categoryScrollStates = new Map();
        
        function updateButtonStates() {
          autoScrollBtn.className = autoScroll ? 'active' : '';
          timestampsBtn.className = showTimestamps ? 'active' : '';
          autoScrollIndicator.textContent = autoScroll ? 'Auto-scrolling enabled' : '';
        }
        updateButtonStates();
        
        ws.onmessage = (event) => {
          const message = JSON.parse(event.data);
          
          if (message.type === 'history') {
            clearLogs();
            message.data.forEach(entry => addLogEntry(entry));
          } else if (message.type === 'log') {
            addLogEntry(message.data);
          }
        };

        function addLogEntry(entry) {
          const categoryId = 'category-' + entry.category;
          let categorySection = document.getElementById(categoryId);
          
          if (!categorySection) {
            categorySection = document.createElement('div');
            categorySection.id = categoryId;
            categorySection.className = 'category-section';
            categorySection.innerHTML = \`
              <div class="category-header">\${entry.category.toUpperCase()}</div>
              <div class="category-logs"></div>
            \`;
            logContainer.appendChild(categorySection);
            
            // Set up scroll tracking for the new category
            const logsContainer = categorySection.querySelector('.category-logs');
            logsContainer.addEventListener('scroll', () => {
              const { scrollTop, scrollHeight, clientHeight } = logsContainer;
              categoryScrollStates.set(categoryId, {
                isAtBottom: Math.abs(scrollHeight - clientHeight - scrollTop) < 2
              });
            });
          }
          
          const logsContainer = categorySection.querySelector('.category-logs');
          const wasAtBottom = !categoryScrollStates.has(categoryId) || 
            categoryScrollStates.get(categoryId).isAtBottom;
          
          const logEntry = document.createElement('div');
          logEntry.className = 'log-entry';
          
          const timestamp = showTimestamps 
            ? \`<span class="timestamp">\${entry.formattedTimestamp}</span>\` 
            : '';
          
          logEntry.innerHTML = \`
            \${timestamp}
            <span class="level level-\${entry.level}">\${entry.level.toUpperCase()}</span>
            <span class="message">\${entry.message}</span>
            \${entry.formattedData ? \`<div class="data">\${entry.formattedData}</div>\` : ''}
          \`;
          
          logsContainer.appendChild(logEntry);
          
          // Keep only last 1000 logs per category
          const logs = logsContainer.children;
          while (logs.length > 1000) {
            logs[0].remove();
          }
          
          // Auto-scroll only if we were at the bottom before adding the new entry
          if (autoScroll && wasAtBottom) {
            logsContainer.scrollTop = logsContainer.scrollHeight;
          }
        }

        function clearLogs() {
          logContainer.innerHTML = '';
          categoryScrollStates.clear();
        }

        function toggleAutoScroll() {
          autoScroll = !autoScroll;
          updateButtonStates();
        }

        function toggleTimestamps() {
          showTimestamps = !showTimestamps;
          const timestamps = document.querySelectorAll('.timestamp');
          timestamps.forEach(ts => ts.style.display = showTimestamps ? '' : 'none');
          updateButtonStates();
        }
      </script>
    </body>
    </html>
  `);
});

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('Web client connected');
  clients.add(ws);
  
  // Send connection status message
  const statusMessage = {
    type: 'log',
    data: {
      category: 'system',
      level: 'info',
      message: 'Connected to log viewer',
      timestamp: Date.now()
    }
  };
  ws.send(JSON.stringify(statusMessage));

  // Send message buffer to new client
  if (messageBuffer.length > 0) {
    console.log('Sending message buffer:', messageBuffer.length, 'messages');
    ws.send(JSON.stringify({
      type: 'history',
      data: messageBuffer
    }));
  }

  ws.on('close', () => {
    console.log('Web client disconnected');
    clients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clients.delete(ws);
  });
});

// Update test message generation to use a dedicated category
function sendTestMessages() {
  const levels = ['debug', 'info', 'warn', 'error'] as const;
  let counter = 0;

  setInterval(() => {
    const level = levels[counter % levels.length];
    const message = {
      type: 'log',
      data: {
        category: 'test',
        level,
        message: 'Test message (updates every 2s) - Count: ' + (counter + 1),
        timestamp: Date.now(),
        data: { counter }
      }
    };

    broadcast(message);
    
    // Update the last test message in buffer instead of adding new ones
    const lastTestIndex = messageBuffer.findIndex(m => m.category === 'test');
    if (lastTestIndex >= 0) {
      messageBuffer[lastTestIndex] = message.data;
    } else {
      messageBuffer.push(message.data);
    }

    counter++;
  }, 2000);
}

// Start server and services
server.listen(PORT, () => {
  console.log(`Web viewer running at http://localhost:${PORT}`);
  
  // Start sending test messages
  sendTestMessages();
  
  // Open the viewer in the default browser
  open(`http://localhost:${PORT}`);
}); 