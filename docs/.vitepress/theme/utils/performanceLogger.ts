import fs from 'fs'

interface TooltipMetrics {
  totalTooltips: number
  processedTooltips: number
  errors: Array<{ term: string, error: string }>
  timing: {
    start: number
    end: number
    duration: number
  }
  tooltipStats: Map<string, {
    count: number
    types: Set<string>
    errors: number
  }>
  parseResults: any[]
  tooltipMap: Map<string, { info: Set<string>, errors: Set<string> }>
}

interface LogEntry {
  timestamp: number
  type: 'file' | 'tooltip' | 'error' | 'summary'
  message: string
  data?: any
}

interface TooltipDebugData {
  term: string
  hasInfo: boolean
  type: string
  hasDocumentation: boolean
  hasTypeDefinition: boolean
  parseResult: {
    totalTokens: number
    hasErrors: boolean
    errors: any[]
  }
}

interface PerformanceLoggerConfig {
  logDir: string
  metricsFile: string
}

class PerformanceLogger {
  private static instance: PerformanceLogger
  
  private metrics = {
    processedTooltips: 0,
    tooltipStats: new Map<string, { count: number; types: Set<string>; errors: number }>(),
    errors: [] as { term: string; error: string }[],
    timing: {
      start: Date.now(),
      end: 0,
      duration: 0
    }
  }

  private fileCount = 0
  private lastProgressUpdate = 0
  private progressUpdateInterval = 333
  private isProcessing = false
  private processStartTime = 0
  private hasFinalized = false

  private colors = {
    blue: '\x1b[34m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
  }

  private log(type: string, message: string, data?: any) {
    if (data) {
      console.debug(`[${type}] ${message}`, data)
    } else {
      console.debug(`[${type}] ${message}`)
    }
  }

  logTooltipDebug(term: string, type: string, hasError = false) {
    this.logTooltip(term, type, hasError)
  }

  startProcess(tooltipCount: number) {
    if (!this.isProcessing) {
      this.isProcessing = true
      this.processStartTime = Date.now()
      this.metrics.timing.start = Date.now()
    }

    this.fileCount++

    const now = Date.now()
    if (now - this.lastProgressUpdate > this.progressUpdateInterval) {
      const elapsedTime = (now - this.processStartTime) / 1000
      const rate = this.metrics.processedTooltips / elapsedTime
      
      // Single line status update with colors
      process.stdout.write('\r\x1b[K') // Clear line
      process.stdout.write(
        `${this.colors.bold}${this.colors.blue}Tooltips:${this.colors.reset} ` +
        `${this.colors.cyan}${this.metrics.processedTooltips.toLocaleString()}${this.colors.reset} | ` +
        `${this.colors.bold}${this.colors.blue}Files:${this.colors.reset} ` +
        `${this.colors.cyan}${this.fileCount.toLocaleString()}${this.colors.reset} | ` +
        `${this.colors.bold}${this.colors.blue}Rate:${this.colors.reset} ` +
        `${this.colors.green}${rate.toFixed(1)}/s${this.colors.reset} | ` +
        `${this.colors.bold}${this.colors.blue}Time:${this.colors.reset} ` +
        `${this.colors.yellow}${elapsedTime.toFixed(1)}s${this.colors.reset}`
      )
      
      this.lastProgressUpdate = now
    }
  }

  logTooltip(term: string, type: string, hasError = false) {
    this.metrics.processedTooltips++
    
    const stats = this.metrics.tooltipStats.get(term) || {
      count: 0,
      types: new Set<string>(),
      errors: 0
    }
    
    stats.count++
    stats.types.add(type)
    if (hasError) stats.errors++
    
    this.metrics.tooltipStats.set(term, stats)

    // Only log if there's an error to reduce noise
    if (hasError) {
      this.log('tooltip', `Error processing: ${term}`, { type, hasError })
    }
  }

  async finalize() {
    if (this.hasFinalized) return
    
    this.metrics.timing.end = Date.now()
    this.metrics.timing.duration = this.metrics.timing.end - this.processStartTime
    
    const summary = {
      duration: `${(this.metrics.timing.duration / 1000).toFixed(1)}s`,
      tooltipsProcessed: this.metrics.processedTooltips.toLocaleString(),
      filesProcessed: this.fileCount.toLocaleString(),
      averageRate: `${(this.metrics.processedTooltips / (this.metrics.timing.duration / 1000)).toFixed(1)}/s`,
      errors: this.metrics.errors.length
    }
    
    console.log('\n\n=== Processing Summary ===')
    console.table(summary)
    
    await this.saveMetrics()
    this.isProcessing = false
    this.hasFinalized = true
  }

  static getInstance(): PerformanceLogger {
    if (!PerformanceLogger.instance) {
      PerformanceLogger.instance = new PerformanceLogger()
    }
    return PerformanceLogger.instance
  }

  private async saveMetrics() {
    try {
      const metricsData = {
        summary: {
          duration: `${(this.metrics.timing.duration / 1000).toFixed(1)}s`,
          tooltipsProcessed: this.metrics.processedTooltips,
          filesProcessed: this.fileCount,
          averageRate: `${(this.metrics.processedTooltips / (this.metrics.timing.duration / 1000)).toFixed(1)}/s`,
          errors: this.metrics.errors.length
        },
        errors: this.metrics.errors,
        tooltipStats: Array.from(this.metrics.tooltipStats.entries()).map(([term, stats]) => ({
          term,
          count: stats.count,
          types: Array.from(stats.types),
          errors: stats.errors
        }))
      };

      const metricsDir = './docs/.vitepress/theme/logs';
      const metricsPath = `${metricsDir}/tooltip-metrics.json`;

      // Ensure directory exists
      if (!fs.existsSync(metricsDir)) {
        fs.mkdirSync(metricsDir, { recursive: true });
      }

      // Save metrics
      await fs.promises.writeFile(metricsPath, JSON.stringify(metricsData, null, 2));
      console.log(`\nMetrics saved to: ${metricsPath}`);
    } catch (err) {
      console.error('Failed to save metrics:', err);
    }
  }
}

// Export a singleton instance
export const performanceLogger = PerformanceLogger.getInstance() 