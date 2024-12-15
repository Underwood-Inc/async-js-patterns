import chalk from 'chalk';

// Use the appropriate performance API for the current environment
const getPerformanceAPI = () => {
  if (typeof window !== 'undefined') {
    return window.performance || { now: () => Date.now() };
  }
  return { now: () => Date.now() };
};

const performanceAPI = getPerformanceAPI();

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type LogCategory = 'performance' | 'tooltip' | 'markdown' | 'dev' | 'system' | 'build';

interface LogEntry {
  timestamp: number;
  level: LogLevel;
  category: LogCategory;
  message: string;
  data?: any;
  groupId?: string;
  groupLevel?: number;
}

interface PerformanceEntry {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

interface ProgressEntry {
  message: string;
  total?: number;
  current?: number;
}

interface TerminalSection {
  id: string;
  title: string;
  lines: string[];
  height: number;
  position: number;
  visible: boolean;
}

class Logger {
  private static instance: Logger;
  private isEnabled: boolean = false;
  private logHistory: LogEntry[] = [];
  private performanceMarks: Map<string, PerformanceEntry> = new Map();
  private progressLines: Map<string, ProgressEntry> = new Map();
  private sections: Map<string, TerminalSection> = new Map();
  private readonly MAX_HISTORY = 1000;
  private groupStack: string[] = [];
  private groupLevel: number = 0;
  private enabledCategories: Set<LogCategory> = new Set(['system']);
  private enabledLevels: Set<LogLevel> = new Set(['error', 'warn']);
  private isBrowser: boolean = typeof window !== 'undefined';
  private isNode: boolean = typeof process !== 'undefined' && 
    typeof process.versions === 'object' && 
    process.versions !== null && 
    typeof process.versions.node === 'string';
  private terminalHeight: number = this.isNode && process.stdout ? process.stdout.rows : 40;
  private webSocketClient: WebSocket | null = null;
  private isBrowserUI = false;

  private constructor() {
    // Enable logging by default in development mode
    const isDev = 
      (this.isNode && process.env.NODE_ENV === 'development') ||
      (this.isBrowser && (import.meta.env?.DEV || window.location.hostname === 'localhost'));
    
    if (isDev) {
      this.enable(true);
      // Enable all categories and levels in dev mode
      this.enabledCategories = new Set(['performance', 'tooltip', 'markdown', 'dev', 'system', 'build']);
      this.enabledLevels = new Set(['debug', 'info', 'warn', 'error']);
    }

    // Initialize terminal sections in Node environment if not running as log server
    if (this.isNode && !process.env.IS_LOG_SERVER) {
      this.initializeSections();
      
      // Handle terminal resize
      if (process.stdout) {
        process.stdout.on('resize', () => {
          this.terminalHeight = process.stdout.rows;
          this.redrawSections();
        });
      }
    }

    // Set up cleanup handlers
    if (this.isNode) {
      process.on('exit', () => this.cleanup());
    } else if (this.isBrowser) {
      window.addEventListener('unload', () => this.cleanup());
    }

    // Delay WebSocket connection in browser
    if (this.isBrowser) {
      setTimeout(() => this.connectWebSocket(), 1000);
    }

    // Check if we're in the browser UI for logs
    this.isBrowserUI = this.isBrowser && window.location.pathname.includes('/logs');
  }

  private connectWebSocket() {
    if (!this.isBrowser) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // Get the base URL from the meta tag or default to ''
    const baseUrl = document.querySelector('base')?.getAttribute('href') || '/web-patterns/';
    const wsUrl = `${protocol}//${window.location.host}${baseUrl}_logs`;

    this.webSocketClient = new WebSocket(wsUrl);
    
    this.webSocketClient.onopen = () => {
      this.debug('system', 'Connected to logging server');
    };

    this.webSocketClient.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.webSocketClient.onclose = () => {
      // Retry connection after delay
      setTimeout(() => this.connectWebSocket(), 5000);
    };
  }

  private initializeSections() {
    if (!this.isNode) return;

    // Ensure minimum terminal height with a safe default
    this.terminalHeight = Math.max(20, Math.min(this.terminalHeight || 40, 1000));
    const defaultSectionHeight = Math.max(3, Math.min(Math.floor(this.terminalHeight / 10), 20));

    // Define terminal sections with guaranteed minimum heights
    const sections: TerminalSection[] = [
      { 
        id: 'build', 
        title: '📦 Build Progress', 
        lines: [], 
        height: Math.max(3, Math.min(defaultSectionHeight + 1, 20)), 
        position: 0, 
        visible: true 
      },
      { 
        id: 'tooltip', 
        title: '🔍 Tooltip Processing', 
        lines: [], 
        height: Math.max(3, Math.min(defaultSectionHeight + 2, 20)), 
        position: defaultSectionHeight + 1, 
        visible: true 
      },
      { 
        id: 'performance', 
        title: '⚡ Performance Metrics', 
        lines: [], 
        height: Math.max(3, Math.min(defaultSectionHeight, 15)), 
        position: (defaultSectionHeight * 2) + 3, 
        visible: true 
      },
      { 
        id: 'errors', 
        title: '❌ Errors', 
        lines: [], 
        height: Math.max(3, Math.min(defaultSectionHeight, 15)), 
        position: (defaultSectionHeight * 3) + 3, 
        visible: true 
      },
      { 
        id: 'debug', 
        title: '🔧 Debug Output', 
        lines: [], 
        height: Math.max(3, Math.min(defaultSectionHeight + 2, 20)), 
        position: (defaultSectionHeight * 4) + 3, 
        visible: true 
      }
    ];

    // Initialize sections with safe array lengths
    sections.forEach(section => {
      try {
        // Ensure height is within safe bounds
        const minHeight = 2; // Minimum 2 lines (1 for title, 1 for content)
        const maxHeight = 20; // Maximum 20 lines per section
        const safeHeight = Math.max(minHeight, Math.min(section.height - 1, maxHeight));
        
        // Create array with validated length
        const emptyLines = new Array(safeHeight);
        for (let i = 0; i < safeHeight; i++) {
          emptyLines[i] = '';
        }

        this.sections.set(section.id, {
          ...section,
          lines: emptyLines
        });
      } catch (error) {
        // Fallback to minimum size if array creation fails
        const fallbackLines = new Array(2).fill('');
        this.sections.set(section.id, {
          ...section,
          height: 3,
          lines: fallbackLines
        });
        console.error(`Failed to initialize section ${section.id}, using fallback size`, error);
      }
    });

    // Clear screen and initialize sections
    process.stdout.write('\x1b[2J\x1b[0;0H'); // Clear screen and move to top
    this.redrawSections();
  }

  private updateSection(sectionId: string, lines: string[]) {
    if (!this.isNode) return;

    const section = this.sections.get(sectionId);
    if (!section || !this.isEnabled) return;

    // Store lines with rotation
    section.lines = lines.slice(-section.height + 1);

    // Build output buffer
    let output = '';

    // Add section header
    output += `\x1b[1m${section.title}\x1b[0m\n`;

    // Add content lines
    section.lines.forEach((line, index) => {
      if (index < section.height - 1) {
        output += `${line}\n`;
      }
    });

    // Fill remaining lines with empty lines
    const remainingLines = section.height - 1 - section.lines.length;
    if (remainingLines > 0) {
      output += '\n'.repeat(remainingLines);
    }

    // Write the entire section at once
    process.stdout.write('\x1b[s');  // Save cursor position
    process.stdout.write(`\x1b[${section.position};0H`);  // Move to section start
    process.stdout.write(output);
    process.stdout.write('\x1b[u');  // Restore cursor position
  }

  private redrawSections() {
    if (!this.isNode || !this.isEnabled) return;

    // Calculate total height needed
    const totalHeight = Array.from(this.sections.values())
      .filter(s => s.visible)
      .reduce((sum, s) => sum + s.height, 0);

    // Clear the entire area
    process.stdout.write('\x1b[2J');  // Clear screen
    process.stdout.write('\x1b[0;0H');  // Move to top

    // Draw all visible sections
    let currentPosition = 0;
    this.sections.forEach(section => {
      if (section.visible) {
        section.position = currentPosition;
        this.updateSection(section.id, section.lines);
        currentPosition += section.height;
      }
    });

    // Ensure cursor is at the bottom
    process.stdout.write(`\x1b[${totalHeight + 1};0H`);
  }

  private log(category: LogCategory, level: LogLevel, message: string, data?: any) {
    if (!this.isEnabled || !this.enabledCategories.has(category) || !this.enabledLevels.has(level)) {
      return;
    }

    // Skip only clear screen and cursor positioning commands
    if (this.shouldSkipMessage(message)) {
      return;
    }

    const entry: LogEntry = {
      timestamp: Date.now(),
      level,
      category,
      message,
      data,
      groupId: this.getCurrentGroup(),
      groupLevel: this.groupLevel
    };

    // Add to history with rotation
    this.logHistory.push(entry);
    if (this.logHistory.length > this.MAX_HISTORY) {
      this.logHistory.shift();
    }

    // Format the log message
    const formattedMessage = this.isNode 
      ? this.formatNodeOutput(level, category, message, data)
      : this.formatOutput(level, category, message, data);

    // Skip empty outputs
    if (!formattedMessage) return;

    // Handle browser environment
    if (this.isBrowser) {
      if (this.isBrowserUI) {
        const method = {
          debug: console.debug,
          info: console.info,
          warn: console.warn,
          error: console.error
        }[level] || console.log;
        method(formattedMessage);
      }

      if (this.webSocketClient?.readyState === WebSocket.OPEN) {
        this.webSocketClient.send(JSON.stringify({
          type: 'log',
          entry: {
            ...entry,
            formattedMessage
          }
        }));
      }
    } 
    // Handle Node/terminal environment
    else if (this.isNode) {
      const cleanOutput = this.cleanTerminalOutput(formattedMessage);
      if (cleanOutput) {
        process.stdout.write(cleanOutput + '\n');
      }

      if (process.env.IS_LOG_SERVER) {
        this.routeToSection(category, level, formattedMessage);
      }
    }
  }

  private shouldSkipMessage(message: string): boolean {
    // Only skip completely empty messages
    return message.trim().length === 0;
  }

  private isStartupMessage(message: string): boolean {
    return message.includes('vitepress') || 
           message.includes('web-patterns') ||
           message.includes('Local:') ||
           message.includes('Network:') ||
           message.includes('press h to show help');
  }

  private cleanTerminalOutput(message: string): string {
    // First pass - clean up control sequences and formatting
    let cleaned = message
      .replace(/\u001b\[[0-9;]*[a-zA-Z]/g, '') // ANSI escape codes
      .replace(/\[[\d;]*[A-Za-z]/g, '')        // Square bracket codes
      .replace(/\[s\[\d+;\d+H/g, '')           // Cursor positioning
      .replace(/\[u/g, '')                     // Cursor restore
      .trim();

    // Format npm commands nicely
    if (cleaned.match(/^\s*>.*?(clear|vitepress)/)) {
      cleaned = cleaned
        .replace(/^\s*>\s*web-patterns@[\d.]+ /, '')  // Remove package version
        .replace(/\/home\/.*?\/web-patterns\//, '')    // Simplify paths
        .trim();
    }

    // Format VitePress messages nicely
    if (cleaned.includes('vitepress v')) {
      cleaned = cleaned
        .replace(/vitepress v[\d.]+/, 'VitePress')
        .replace(/Local:.*(:\d+\/.*?)\s+Network:.*$/, 'Server: http://localhost$1')
        .replace(/press h to show help/, '')
        .trim();
    }

    // Format tooltip messages nicely
    if (cleaned.includes('Tooltips:')) {
      const matches = message.match(/Tooltips: (\d+)\/(\d+) processed, (\d+) added \((.*?)\)/);
      if (matches) {
        const [_, current, total, added, types] = matches;
        const typesList = types.split(', ')
          .map(t => {
            // Extract just the type and count
            const [type, count] = t.split(':').map(s => s.trim());
            return type && count ? `${type.replace(/[()]/g, '')}: ${count}` : null;
          })
          .filter(Boolean)
          .join(', ');
        
        cleaned = `Processed ${current}/${total} tooltips, added ${added} (${typesList})`;
      }
    }

    // Format Sass warnings consistently
    if (cleaned.includes('DEPRECATION WARNING: The legacy JS API')) {
      cleaned = 'Sass: Legacy JS API deprecation warning';
    }

    // Clean up any remaining formatting
    cleaned = cleaned
      .replace(/\s+/g, ' ')           // Collapse multiple spaces
      .replace(/\n\s*\n+/g, '\n')     // Collapse multiple newlines
      .replace(/^\s+|\s+$/gm, '')     // Trim each line
      .trim();

    return cleaned;
  }

  private routeToSection(category: LogCategory, level: LogLevel, message: string) {
    let sectionId: string;
    switch (category) {
      case 'build':
        sectionId = 'build';
        break;
      case 'tooltip':
        sectionId = 'tooltip';
        break;
      case 'performance':
        sectionId = 'performance';
        break;
      case 'system':
        sectionId = level === 'error' ? 'errors' : 'debug';
        break;
      default:
        sectionId = 'debug';
    }

    const section = this.sections.get(sectionId);
    if (section) {
      section.lines.push(message);
      this.updateSection(sectionId, section.lines);
    }
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  enable(enabled: boolean = true) {
    this.isEnabled = enabled;
    this.log('system', 'info', `Logging ${enabled ? 'enabled' : 'disabled'}`);
  }

  private cleanup() {
    // Clear all progress tracking
    this.progressLines.clear();
    // Clear performance marks
    this.performanceMarks.clear();
    // Clear groups
    this.groupStack = [];
    this.groupLevel = 0;
  }

  // Progress tracking methods
  startProgress(id: string, total?: number) {
    this.progressLines.set(id, { 
      message: '',
      total,
      current: 0
    });
    this.debug('system', `Started progress tracking: ${id}`, { total });
  }

  updateProgress(id: string, message: string, current?: number) {
    const progress = this.progressLines.get(id);
    if (progress) {
      progress.message = message;
      if (typeof current === 'number') {
        progress.current = current;
      }
      this.progressLines.set(id, progress);

      const progressInfo = {
        message,
        current: progress.current,
        total: progress.total,
        percentage: progress.total ? Math.round((progress.current || 0) / progress.total * 100) : undefined
      };

      this.debug('system', `Progress update [${id}]`, progressInfo);
    }
  }

  endProgress(id: string) {
    const progress = this.progressLines.get(id);
    if (progress) {
      const finalInfo = {
        message: progress.message,
        current: progress.current,
        total: progress.total,
        percentage: progress.total ? Math.round((progress.current || 0) / progress.total * 100) : undefined
      };
      this.progressLines.delete(id);
      this.debug('system', `Completed progress [${id}]`, finalInfo);
    }
  }

  isLoggingEnabled(): boolean {
    return this.isEnabled;
  }

  private getCurrentGroup(): string | undefined {
    return this.groupStack[this.groupStack.length - 1];
  }

  private formatOutput(level: LogLevel, category: LogCategory, message: string, data?: any): string {
    if (this.shouldSkipMessage(message)) {
      return '';
    }

    const timestamp = this.formatTimestamp(new Date());
    const indent = this.groupLevel ? ' '.repeat(this.groupLevel * 2) : '';
    const cleaned = this.cleanTerminalOutput(message);
    
    if (!cleaned) return '';

    let output = `${timestamp} ${level.toUpperCase().padEnd(5)} ${cleaned}`;

    // Format data if present
    if (data) {
      try {
        const formattedData = this.formatData(data);
        if (formattedData) {
          if (category === 'performance' && data.duration !== undefined) {
            output += ` (${data.duration}ms)`;
          } else {
            const dataLines = formattedData.split('\n')
              .filter(line => line.trim().length > 0)
              .map(line => indent + '  ' + line)
              .join('\n');
            if (dataLines) {
              output += '\n' + dataLines;
            }
          }
        }
      } catch (e) {
        // Ignore formatting errors
      }
    }

    return output;
  }

  private formatNodeOutput(level: LogLevel, category: LogCategory, message: string, data?: any): string {
    const timestamp = this.formatTimestamp(new Date());
    const cleaned = this.cleanTerminalOutput(message);
    
    if (!cleaned) return '';

    // Use consistent coloring
    const levelColor = {
      debug: chalk.blue,
      info: chalk.green,
      warn: chalk.yellow,
      error: chalk.red
    }[level] || chalk.white;

    let output = `${timestamp} ${levelColor(level.toUpperCase().padEnd(5))} ${cleaned}`;

    // Add formatted data
    if (data) {
      try {
        const formattedData = this.formatData(data);
        if (formattedData) {
          if (category === 'performance' && data.duration !== undefined) {
            output += chalk.gray(` (${data.duration}ms)`);
          } else {
            output += '\n  ' + chalk.gray(formattedData);
          }
        }
      } catch (e) {
        // Ignore formatting errors
      }
    }

    return output;
  }

  private formatTimestamp(date: Date): string {
    const time = date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    const ms = date.getMilliseconds().toString().padStart(3, '0');
    return chalk.gray(`${time}.${ms}`);
  }

  private formatData(data: any): string | null {
    if (!data) return null;

    // Handle errors
    if (data.error instanceof Error) {
      return data.error.message;
    }

    // Handle objects
    if (typeof data === 'object') {
      // Filter out empty/null values
      const cleaned = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => {
          if (v === null || v === undefined) return false;
          if (typeof v === 'object' && Object.keys(v).length === 0) return false;
          if (Array.isArray(v) && v.length === 0) return false;
          return true;
        })
      );

      if (Object.keys(cleaned).length === 0) return null;

      // Simplify file paths
      if (cleaned.file) {
        cleaned.file = cleaned.file.split('/').pop();
      }

      // Format as single line if simple object
      if (Object.keys(cleaned).length === 1) {
        const [key, value] = Object.entries(cleaned)[0];
        return `${key}: ${value}`;
      }

      // Otherwise format as multi-line
      return Object.entries(cleaned)
        .map(([k, v]) => `${k}: ${v}`)
        .join('\n');
    }

    return String(data);
  }

  debug(category: LogCategory, message: string, data?: any) {
    this.log(category, 'debug', message, data);
  }

  info(category: LogCategory, message: string, data?: any) {
    this.log(category, 'info', message, data);
  }

  warn(category: LogCategory, message: string, data?: any) {
    this.log(category, 'warn', message, data);
  }

  error(category: LogCategory, message: string, data?: any) {
    this.log(category, 'error', message, data);
  }

  group(name: string) {
    if (!this.isEnabled) return;
    
    this.groupStack.push(name);
    this.groupLevel++;
    
    if (this.isBrowser) {
      console.group(name);
    }
  }

  groupEnd() {
    if (!this.isEnabled || this.groupStack.length === 0) return;
    
    this.groupStack.pop();
    this.groupLevel = Math.max(0, this.groupLevel - 1);
    
    if (this.isBrowser) {
      console.groupEnd();
    }
  }

  // Performance monitoring
  mark(name: string, metadata?: Record<string, any>) {
    const mark: PerformanceEntry = {
      name,
      startTime: performanceAPI.now(),
      metadata
    };
    this.performanceMarks.set(name, mark);
    this.debug('performance', `Mark started: ${name}`, metadata);
  }

  measure(name: string, additionalMetadata?: Record<string, any>) {
    const mark = this.performanceMarks.get(name);
    if (!mark) {
      this.warn('performance', `No mark found for measurement: ${name}`);
      return;
    }

    const endTime = performanceAPI.now();
    const duration = endTime - mark.startTime;

    const updatedMark: PerformanceEntry = {
      ...mark,
      endTime,
      duration,
      metadata: { ...mark.metadata, ...additionalMetadata }
    };
    
    this.performanceMarks.set(name, updatedMark);
    this.debug('performance', `Measurement complete: ${name}`, {
      duration,
      ...updatedMark.metadata
    });

    return updatedMark;
  }

  // Analytics and reporting
  getLogHistory(): LogEntry[] {
    return [...this.logHistory];
  }

  getPerformanceMetrics(): PerformanceEntry[] {
    return Array.from(this.performanceMarks.values());
  }

  clearHistory() {
    this.logHistory = [];
    this.performanceMarks.clear();
    this.groupStack = [];
    this.groupLevel = 0;
  }

  generateReport(): string {
    const report = {
      timestamp: new Date().toISOString(),
      totalLogs: this.logHistory.length,
      enabledCategories: Array.from(this.enabledCategories),
      enabledLevels: Array.from(this.enabledLevels),
      logsByLevel: this.logHistory.reduce((acc, entry) => {
        acc[entry.level] = (acc[entry.level] || 0) + 1;
        return acc;
      }, {} as Record<LogLevel, number>),
      logsByCategory: this.logHistory.reduce((acc, entry) => {
        acc[entry.category] = (acc[entry.category] || 0) + 1;
        return acc;
      }, {} as Record<LogCategory, number>),
      logsByGroup: this.logHistory.reduce((acc, entry) => {
        if (entry.groupId) {
          acc[entry.groupId] = (acc[entry.groupId] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>),
      performanceMetrics: Array.from(this.performanceMarks.entries()).map(([name, mark]) => ({
        name,
        duration: mark.duration,
        metadata: mark.metadata
      }))
    };

    return JSON.stringify(report, null, 2);
  }

  enableCategory(category: LogCategory, enabled: boolean = true) {
    if (enabled) {
      this.enabledCategories.add(category);
    } else {
      this.enabledCategories.delete(category);
    }
    this.log('system', 'info', `Log category '${category}' ${enabled ? 'enabled' : 'disabled'}`);
  }

  enableLevel(level: LogLevel, enabled: boolean = true) {
    if (enabled) {
      this.enabledLevels.add(level);
    } else {
      this.enabledLevels.delete(level);
    }
    this.log('system', 'info', `Log level '${level}' ${enabled ? 'enabled' : 'disabled'}`);
  }

  isCategoryEnabled(category: LogCategory): boolean {
    return this.enabledCategories.has(category);
  }

  isLevelEnabled(level: LogLevel): boolean {
    return this.enabledLevels.has(level);
  }

  // Add section management methods
  toggleSection(sectionId: string, visible: boolean) {
    const section = this.sections.get(sectionId);
    if (section) {
      section.visible = visible;
      this.redrawSections();
    }
  }

  setSectionHeight(sectionId: string, height: number) {
    const section = this.sections.get(sectionId);
    if (section) {
      section.height = height;
      this.redrawSections();
    }
  }

  clearSection(sectionId: string) {
    const section = this.sections.get(sectionId);
    if (section) {
      section.lines = Array(section.height - 1).fill('');
      this.updateSection(sectionId, section.lines);
    }
  }

  clearAllSections() {
    this.sections.forEach(section => {
      section.lines = Array(section.height - 1).fill('');
    });
    this.redrawSections();
  }
}

// Export singleton instance
export const logger = Logger.getInstance();

// Export convenience methods
export const debugLog = (category: LogCategory, message: string, data?: any) => {
  if (logger.isLevelEnabled('debug') && logger.isCategoryEnabled(category)) {
    logger.debug(category, message, data);
  }
};

export const toggleDebugLogging = (enabled: boolean) => logger.enable(enabled);

export const measurePerformance = (name: string, fn: () => Promise<any> | any, metadata?: Record<string, any>) => {
  if (logger.isLevelEnabled('debug') && logger.isCategoryEnabled('performance')) {
    logger.mark(name, metadata);
    const result = fn();
    if (result instanceof Promise) {
      return result.finally(() => logger.measure(name));
    }
    logger.measure(name);
    return result;
  }
  // Just execute the function if logging is disabled
  return fn();
};

// Add new exports for category and level toggling
export const enableLogCategory = (category: LogCategory, enabled: boolean = true) => 
  logger.enableCategory(category, enabled);

export const enableLogLevel = (level: LogLevel, enabled: boolean = true) => 
  logger.enableLevel(level, enabled);

export const isLogCategoryEnabled = (category: LogCategory) => 
  logger.isCategoryEnabled(category);

export const isLogLevelEnabled = (level: LogLevel) => 
  logger.isLevelEnabled(level); 