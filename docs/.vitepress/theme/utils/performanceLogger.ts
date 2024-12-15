import { logger } from './logger';

interface PerformanceEntry {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

class PerformanceLogger {
  private static instance: PerformanceLogger;
  private isEnabled: boolean = false;
  private marks: Map<string, PerformanceEntry> = new Map();

  private constructor() {}

  static getInstance(): PerformanceLogger {
    if (!PerformanceLogger.instance) {
      PerformanceLogger.instance = new PerformanceLogger();
    }
    return PerformanceLogger.instance;
  }

  enable(enabled: boolean = true) {
    this.isEnabled = enabled;
    logger.debug('performance', `Performance logging ${enabled ? 'enabled' : 'disabled'}`);
  }

  mark(name: string, metadata?: Record<string, any>) {
    if (!this.isEnabled) return;

    const mark: PerformanceEntry = {
      name,
      startTime: performance.now(),
      metadata
    };
    this.marks.set(name, mark);
    logger.debug('performance', `Mark started: ${name}`, metadata);
  }

  measure(name: string, additionalMetadata?: Record<string, any>): PerformanceEntry | undefined {
    if (!this.isEnabled) return;

    const mark = this.marks.get(name);
    if (!mark) {
      logger.warn('performance', `No mark found for measurement: ${name}`);
      return;
    }

    const endTime = performance.now();
    const duration = endTime - mark.startTime;

    const updatedMark: PerformanceEntry = {
      ...mark,
      endTime,
      duration,
      metadata: { ...mark.metadata, ...additionalMetadata }
    };
    
    this.marks.set(name, updatedMark);
    logger.debug('performance', `Measurement complete: ${name}`, {
      duration: `${duration.toFixed(2)}ms`,
      ...updatedMark.metadata
    });

    return updatedMark;
  }

  getMetrics(): PerformanceEntry[] {
    return Array.from(this.marks.values());
  }

  clearMetrics() {
    this.marks.clear();
  }

  finalize() {
    if (!this.isEnabled) return;

    const metrics = this.getMetrics();
    const totalDuration = metrics.reduce((sum, m) => sum + (m.duration || 0), 0);
    const avgDuration = totalDuration / metrics.length;

    const summary = {
      totalMeasurements: metrics.length,
      totalDuration: `${totalDuration.toFixed(2)}ms`,
      averageDuration: `${avgDuration.toFixed(2)}ms`,
      measurements: metrics.map(m => ({
        name: m.name,
        duration: `${(m.duration || 0).toFixed(2)}ms`,
        metadata: m.metadata
      }))
    };

    logger.debug('performance', 'Performance metrics summary:', summary);
  }

  generateReport(): string {
    const metrics = this.getMetrics();
    const report = {
      timestamp: new Date().toISOString(),
      totalMeasurements: metrics.length,
      measurements: metrics.map(m => ({
        name: m.name,
        duration: m.duration,
        metadata: m.metadata
      }))
    };
    return JSON.stringify(report, null, 2);
  }
}

export const performanceLogger = PerformanceLogger.getInstance(); 