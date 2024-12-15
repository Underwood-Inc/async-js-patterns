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

// Handle log server messages
logClient.onMessage((message) => {
  console.log('Received message from log server:', message);
  broadcast(message);
  
  // Store in buffer for new clients
  if (message.type === 'log' && !Array.isArray(message.data)) {
    messageBuffer.push(message.data);
    if (messageBuffer.length > 1000) {
      messageBuffer.shift();
    }
  }
});

// Serve static files
app.use(express.static(resolve(__dirname, '../public')));

// Serve the viewer page
app.get('/', (req, res) => {
  const html = `<!DOCTYPE html>
    <html>
      <head>
        <title>Log Viewer</title>
        <style>
          body { font-family: monospace; margin: 0; padding: 20px; background: #1e1e1e; color: #d4d4d4; }
          #logs { 
            white-space: pre-wrap; 
            height: calc(100vh - 60px); 
            overflow-y: auto;
            padding: 10px;
            background: #252526;
            border-radius: 4px;
          }
          .debug { color: #888; }
          .info { color: #4fc1ff; }
          .warn { color: #ff9; }
          .error { color: #f66; }
          #status {
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 1000;
          }
          .connected { background: #1b4; color: #fff; }
          .disconnected { background: #911; color: #fff; }
          .timestamp { color: #666; }
          .test-message { border-top: 1px solid #333; margin-top: 10px; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div id="status" class="disconnected">Connecting...</div>
        <div id="logs"></div>
        <script>
          const logs = document.getElementById('logs');
          const status = document.getElementById('status');
          let ws;
          let reconnectTimer;
          let reconnectAttempts = 0;
          const MAX_RECONNECT_ATTEMPTS = 20;

          function connect() {
            if (ws && ws.readyState === WebSocket.OPEN) return;
            
            ws = new WebSocket('ws://localhost:${PORT}');
            
            ws.onopen = () => {
              console.log('WebSocket connected');
              status.className = 'connected';
              status.textContent = 'Connected';
              reconnectAttempts = 0;
            };

            ws.onmessage = (event) => {
              console.log('Received message:', event.data);
              const data = JSON.parse(event.data);
              if (data.type === 'log' && data.data) {
                if (data.data.category === 'test') {
                  updateTestMessage(data.data);
                } else {
                  addLogEntry(data.data);
                }
              } else if (data.type === 'history' && Array.isArray(data.data)) {
                console.log('Received history:', data.data.length, 'entries');
                data.data.forEach(entry => {
                  if (entry.category === 'test') {
                    updateTestMessage(entry);
                  } else {
                    addLogEntry(entry);
                  }
                });
              }
            };

            ws.onerror = (error) => {
              console.error('WebSocket error:', error);
              status.className = 'disconnected';
              status.textContent = 'Error';
            };

            ws.onclose = () => {
              console.log('WebSocket closed');
              status.className = 'disconnected';
              status.textContent = 'Disconnected (reconnecting...)';
              scheduleReconnect();
            };
          }

          function updateTestMessage(entry) {
            let testDiv = document.getElementById('test-message');
            if (!testDiv) {
              testDiv = document.createElement('div');
              testDiv.id = 'test-message';
              testDiv.className = 'test-message ' + entry.level;
              logs.appendChild(testDiv);
            }
            const timestamp = new Date(entry.timestamp).toISOString();
            testDiv.innerHTML = '<span class="timestamp">' + timestamp + '</span> [' + 
              entry.category.toUpperCase() + '] [' + entry.level.toUpperCase() + '] ' + entry.message;
            if (entry.data) {
              testDiv.innerHTML += '<br>' + JSON.stringify(entry.data, null, 2);
            }
          }

          function addLogEntry(entry) {
            if (entry.category === 'test') return;
            const div = document.createElement('div');
            div.className = entry.level;
            const timestamp = new Date(entry.timestamp).toISOString();
            div.innerHTML = '<span class="timestamp">' + timestamp + '</span> [' + 
              entry.category.toUpperCase() + '] [' + entry.level.toUpperCase() + '] ' + entry.message;
            if (entry.data) {
              div.innerHTML += '<br>' + JSON.stringify(entry.data, null, 2);
            }
            logs.appendChild(div);
            logs.scrollTop = logs.scrollHeight;
          }

          function scheduleReconnect() {
            if (reconnectTimer) clearTimeout(reconnectTimer);
            if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
              status.textContent = 'Disconnected (max retries reached)';
              return;
            }
            
            const delay = Math.min(1000 * Math.pow(1.5, reconnectAttempts), 10000);
            reconnectAttempts++;
            
            reconnectTimer = setTimeout(() => {
              status.textContent = 'Reconnecting (attempt ' + reconnectAttempts + '/' + MAX_RECONNECT_ATTEMPTS + ')...';
              connect();
            }, delay);
          }

          // Start initial connection
          connect();

          // Handle page visibility changes
          document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible' && (!ws || ws.readyState !== WebSocket.OPEN)) {
              connect();
            }
          });
        </script>
      </body>
    </html>`;
  res.send(html);
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
        message: \`Test message (updates every 2s) - Count: \${counter + 1}\`,
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