---
title: Performance Monitoring Examples
description: Learn how to implement performance monitoring in JavaScript applications. Master metrics collection, analysis, and optimization techniques.
date: 2024-12-01
author: Underwood Inc
tags:
  - JavaScript
  - Performance
  - Monitoring
  - Metrics
  - Examples
  - Best Practices
image: /web-patterns/images/performance-monitoring-examples-banner.png
---

# Performance Monitoring Examples

This page demonstrates practical examples of implementing and using performance monitoring patterns for tracking and analyzing application performance.

## Basic Performance Monitoring

```typescript:preview
// Basic performance monitoring
class PerformanceMonitor {
  private metrics: Map<
    string,
    {
      count: number;
      totalDuration: number;
      minDuration: number;
      maxDuration: number;
    }
  > = new Map();

  async measure<T>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<T> {
    const startTime = performance.now();

    try {
      return await operation();
    } finally {
      const duration = performance.now() - startTime;
      this.recordMetrics(operationName, duration);
    }
  }

  private recordMetrics(operationName: string, duration: number): void {
    const existing = this.metrics.get(operationName) ?? {
      count: 0,
      totalDuration: 0,
      minDuration: Infinity,
      maxDuration: -Infinity,
    };

    this.metrics.set(operationName, {
      count: existing.count + 1,
      totalDuration: existing.totalDuration + duration,
      minDuration: Math.min(existing.minDuration, duration),
      maxDuration: Math.max(existing.maxDuration, duration),
    });
  }

  getMetrics(operationName: string): OperationMetrics {
    const metrics = this.metrics.get(operationName);
    if (!metrics) {
      throw new Error(`No metrics for ${operationName}`);
    }

    return {
      count: metrics.count,
      averageDuration: metrics.totalDuration / metrics.count,
      minDuration: metrics.minDuration,
      maxDuration: metrics.maxDuration,
    };
  }
}

// Usage
const monitor = new PerformanceMonitor();

const result = await monitor.measure('fetchUserData', async () => {
  const response = await fetch('/api/users/123');
  return response.json();
});

console.log('Metrics:', monitor.getMetrics('fetchUserData'));
```

## Advanced Performance Monitoring

```typescript:preview
class AdvancedPerformanceMonitor {
  private metrics: Map<string, OperationMetrics> = new Map();
  private thresholds: Map<string, number> = new Map();
  private listeners: Set<MetricsListener> = new Set();
  private samples: Map<string, number[]> = new Map();

  constructor(
    private readonly options: {
      sampleSize?: number;
      alertThreshold?: number;
    } = {}
  ) {}

  setThreshold(operationName: string, threshold: number): void {
    this.thresholds.set(operationName, threshold);
  }

  addListener(listener: MetricsListener): void {
    this.listeners.add(listener);
  }

  removeListener(listener: MetricsListener): void {
    this.listeners.delete(listener);
  }

  async measure<T>(
    operationName: string,
    operation: () => Promise<T>,
    context: Record<string, any> = {}
  ): Promise<T> {
    const startTime = performance.now();
    const startMemory = process.memoryUsage().heapUsed;

    try {
      const result = await operation();
      const duration = performance.now() - startTime;
      const memoryUsed = process.memoryUsage().heapUsed - startMemory;

      this.recordMetrics(operationName, {
        duration,
        memoryUsed,
        success: true,
        context,
      });

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      const memoryUsed = process.memoryUsage().heapUsed - startMemory;

      this.recordMetrics(operationName, {
        duration,
        memoryUsed,
        success: false,
        error,
        context,
      });

      throw error;
    }
  }

  private recordMetrics(operationName: string, data: OperationData): void {
    // Update samples
    const samples = this.samples.get(operationName) ?? [];
    samples.push(data.duration);

    if (samples.length > (this.options.sampleSize ?? 100)) {
      samples.shift();
    }

    this.samples.set(operationName, samples);

    // Calculate metrics
    const metrics = this.calculateMetrics(operationName, samples, data);

    // Update stored metrics
    this.metrics.set(operationName, metrics);

    // Check thresholds
    this.checkThresholds(operationName, metrics);

    // Notify listeners
    this.notifyListeners(operationName, metrics);
  }

  private calculateMetrics(
    operationName: string,
    samples: number[],
    currentData: OperationData
  ): OperationMetrics {
    const sorted = [...samples].sort((a, b) => a - b);
    const p95Index = Math.floor(samples.length * 0.95);
    const p99Index = Math.floor(samples.length * 0.99);

    return {
      count: samples.length,
      averageDuration: samples.reduce((a, b) => a + b, 0) / samples.length,
      p95Duration: sorted[p95Index] ?? 0,
      p99Duration: sorted[p99Index] ?? 0,
      minDuration: sorted[0] ?? 0,
      maxDuration: sorted[sorted.length - 1] ?? 0,
      lastDuration: currentData.duration,
      lastMemoryUsed: currentData.memoryUsed,
      successRate:
        samples.length > 0
          ? ((samples.length - 1) / samples.length) * 100
          : 100,
      timestamp: Date.now(),
    };
  }

  private checkThresholds(
    operationName: string,
    metrics: OperationMetrics
  ): void {
    const threshold = this.thresholds.get(operationName);
    if (threshold && metrics.lastDuration > threshold) {
      this.handleThresholdExceeded(operationName, metrics, threshold);
    }
  }

  private handleThresholdExceeded(
    operationName: string,
    metrics: OperationMetrics,
    threshold: number
  ): void {
    const alert: PerformanceAlert = {
      operationName,
      threshold,
      actualDuration: metrics.lastDuration,
      timestamp: Date.now(),
    };

    this.listeners.forEach((listener) => listener.onThresholdExceeded?.(alert));
  }

  private notifyListeners(
    operationName: string,
    metrics: OperationMetrics
  ): void {
    this.listeners.forEach((listener) =>
      listener.onMetricsUpdated?.(operationName, metrics)
    );
  }

  getMetrics(operationName: string): OperationMetrics {
    const metrics = this.metrics.get(operationName);
    if (!metrics) {
      throw new Error(`No metrics for ${operationName}`);
    }
    return { ...metrics };
  }

  getAllMetrics(): Map<string, OperationMetrics> {
    return new Map(this.metrics);
  }

  clearMetrics(operationName?: string): void {
    if (operationName) {
      this.metrics.delete(operationName);
      this.samples.delete(operationName);
    } else {
      this.metrics.clear();
      this.samples.clear();
    }
  }
}

// Usage
const monitor = new AdvancedPerformanceMonitor({
  sampleSize: 100,
  alertThreshold: 1000, // 1 second
});

// Add listeners
monitor.addListener({
  onMetricsUpdated: (operation, metrics) => {
    console.log(`Metrics updated for ${operation}:`, metrics);
  },
  onThresholdExceeded: (alert) => {
    console.warn(
      `Performance threshold exceeded for ${alert.operationName}:`,
      alert
    );
  },
});

// Set thresholds
monitor.setThreshold('apiRequest', 500); // 500ms

// Measure operations
try {
  const result = await monitor.measure(
    'apiRequest',
    async () => {
      const response = await fetch('/api/data');
      return response.json();
    },
    { endpoint: '/api/data', method: 'GET' }
  );
  console.log('Operation successful:', result);
} catch (error) {
  console.error('Operation failed:', error);
}
```

## Real-World Example: API Performance Monitoring

```typescript:preview
class ApiPerformanceMonitor {
  private monitor: AdvancedPerformanceMonitor;
  private endpoints: Map<string, EndpointStats> = new Map();
  private alerting: AlertingService;
  private reporting: ReportingService;

  constructor(
    private readonly options: {
      sampleSize?: number;
      defaultThreshold?: number;
      alertingConfig?: AlertingConfig;
      reportingConfig?: ReportingConfig;
    } = {}
  ) {
    this.monitor = new AdvancedPerformanceMonitor({
      sampleSize: options.sampleSize,
    });
    this.setupMonitoring();
    this.alerting = new AlertingService(options.alertingConfig);
    this.reporting = new ReportingService(options.reportingConfig);
  }

  private setupMonitoring(): void {
    this.monitor.addListener({
      onMetricsUpdated: this.handleMetricsUpdate.bind(this),
      onThresholdExceeded: this.handleThresholdExceeded.bind(this),
    });
  }

  async trackRequest<T>(
    endpoint: string,
    request: () => Promise<T>
  ): Promise<T> {
    this.ensureEndpointTracking(endpoint);

    return this.monitor.measure(
      endpoint,
      request,
      this.getRequestContext(endpoint)
    );
  }

  private ensureEndpointTracking(endpoint: string): void {
    if (!this.endpoints.has(endpoint)) {
      this.endpoints.set(endpoint, {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        lastStatus: 'unknown',
      });

      this.monitor.setThreshold(
        endpoint,
        this.options.defaultThreshold ?? 1000
      );
    }
  }

  private getRequestContext(endpoint: string): RequestContext {
    const stats = this.endpoints.get(endpoint)!;
    return {
      endpoint,
      totalRequests: stats.totalRequests,
      successRate:
        stats.totalRequests > 0
          ? (stats.successfulRequests / stats.totalRequests) * 100
          : 100,
    };
  }

  private handleMetricsUpdate(
    endpoint: string,
    metrics: OperationMetrics
  ): void {
    const stats = this.endpoints.get(endpoint)!;
    stats.totalRequests++;

    if (metrics.lastDuration <= (this.options.defaultThreshold ?? 1000)) {
      stats.successfulRequests++;
      stats.lastStatus = 'success';
    } else {
      stats.failedRequests++;
      stats.lastStatus = 'slow';
    }

    this.reporting.recordMetrics(endpoint, metrics);
  }

  private handleThresholdExceeded(alert: PerformanceAlert): void {
    this.alerting.sendAlert({
      type: 'PERFORMANCE',
      severity: 'WARNING',
      message: `Performance threshold exceeded for ${alert.operationName}`,
      details: {
        threshold: alert.threshold,
        actual: alert.actualDuration,
        timestamp: alert.timestamp,
      },
    });
  }

  getEndpointStats(endpoint: string): EndpointStats {
    const stats = this.endpoints.get(endpoint);
    if (!stats) {
      throw new Error(`No stats for endpoint ${endpoint}`);
    }
    return { ...stats };
  }

  getEndpointMetrics(endpoint: string): OperationMetrics {
    return this.monitor.getMetrics(endpoint);
  }

  async generateReport(
    options: ReportOptions = {}
  ): Promise<PerformanceReport> {
    const metrics = this.monitor.getAllMetrics();
    const stats = Object.fromEntries(this.endpoints);

    return this.reporting.generateReport({
      metrics,
      stats,
      ...options,
    });
  }
}

// Usage
const apiMonitor = new ApiPerformanceMonitor({
  sampleSize: 1000,
  defaultThreshold: 500,
  alertingConfig: {
    channels: ['slack', 'email'],
    throttleMs: 60000,
  },
  reportingConfig: {
    interval: 3600000,
    format: 'json',
  },
});

// Track API requests
const api = {
  async get<T>(endpoint: string): Promise<T> {
    return apiMonitor.trackRequest(endpoint, async () => {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    });
  },
};

// Make requests
try {
  const users = await api.get('/api/users');
  const posts = await api.get('/api/posts');
  console.log('Data fetched successfully');
} catch (error) {
  console.error('Failed to fetch data:', error);
}

// Generate report
const report = await apiMonitor.generateReport({
  startTime: Date.now() - 86400000, // Last 24 hours
  format: 'json',
});

console.log('Performance report:', report);
```

## Best Practices

1. Memory monitoring:

   ```typescript:preview
   class MemoryMonitor {
     private samples: number[] = [];
     private readonly maxSamples: number;
     private readonly threshold: number;

     constructor(
       options: {
         maxSamples?: number;
         threshold?: number;
       } = {}
     ) {
       this.maxSamples = options.maxSamples ?? 100;
       this.threshold = options.threshold ?? 0.9; // 90%
     }

     recordSample(): void {
       const { heapUsed, heapTotal } = process.memoryUsage();
       const usage = heapUsed / heapTotal;

       this.samples.push(usage);
       if (this.samples.length > this.maxSamples) {
         this.samples.shift();
       }

       if (usage > this.threshold) {
         this.handleHighMemoryUsage(usage);
       }
     }

     private handleHighMemoryUsage(usage: number): void {
       console.warn(`High memory usage detected: ${(usage * 100).toFixed(2)}%`);
       // Implement memory cleanup strategies
     }

     getStats(): MemoryStats {
       const average =
         this.samples.reduce((a, b) => a + b, 0) / this.samples.length;

       return {
         current: this.samples[this.samples.length - 1],
         average,
         max: Math.max(...this.samples),
         trend: this.calculateTrend(),
       };
     }

     private calculateTrend(): 'increasing' | 'stable' | 'decreasing' {
       if (this.samples.length < 2) return 'stable';

       const recent = this.samples.slice(-10);
       const slope = this.calculateSlope(recent);

       if (slope > 0.1) return 'increasing';
       if (slope < -0.1) return 'decreasing';
       return 'stable';
     }

     private calculateSlope(samples: number[]): number {
       // Simple linear regression
       const n = samples.length;
       const sumX = samples.reduce((a, _, i) => a + i, 0);
       const sumY = samples.reduce((a, b) => a + b, 0);
       const sumXY = samples.reduce((a, b, i) => a + b * i, 0);
       const sumXX = samples.reduce((a, _, i) => a + i * i, 0);

       return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
     }
   }
   ```

2. CPU profiling:

   ```typescript:preview
   class CpuProfiler {
     private profiling = false;
     private profile: any = null;

     async startProfiling(): Promise<void> {
       if (this.profiling) return;

       this.profiling = true;
       this.profile = new (await import('v8')).Profile();
       this.profile.start();
     }

     async stopProfiling(): Promise<ProfileResult> {
       if (!this.profiling) {
         throw new Error('Profiling not started');
       }

       const profile = this.profile;
       this.profile = null;
       this.profiling = false;

       profile.stop();
       return this.analyzeProfile(profile);
     }

     private analyzeProfile(profile: any): ProfileResult {
       // Analyze CPU profile data
       return {
         duration: profile.duration,
         timestamp: Date.now(),
         hotspots: this.findHotspots(profile),
       };
     }

     private findHotspots(profile: any): HotspotInfo[] {
       // Identify CPU intensive operations
       return [];
     }
   }
   ```

3. Event loop monitoring:

   ```typescript:preview
   class EventLoopMonitor {
     private samples: number[] = [];
     private timer?: NodeJS.Timer;

     start(interval: number = 1000): void {
       if (this.timer) return;

       let lastCheck = process.hrtime.bigint();

       this.timer = setInterval(() => {
         const now = process.hrtime.bigint();
         const lag = Number(now - lastCheck) / 1_000_000 - interval;

         this.recordSample(lag);
         lastCheck = now;
       }, interval);
     }

     stop(): void {
       if (this.timer) {
         clearInterval(this.timer);
         this.timer = undefined;
       }
     }

     private recordSample(lag: number): void {
       this.samples.push(lag);
       if (this.samples.length > 100) {
         this.samples.shift();
       }

       if (lag > 100) {
         // 100ms threshold
         this.handleHighLatency(lag);
       }
     }

     private handleHighLatency(lag: number): void {
       console.warn(`Event loop lag detected: ${lag.toFixed(2)}ms`);
     }

     getStats(): EventLoopStats {
       return {
         currentLag: this.samples[this.samples.length - 1],
         averageLag:
           this.samples.reduce((a, b) => a + b, 0) / this.samples.length,
         maxLag: Math.max(...this.samples),
         samples: [...this.samples],
       };
     }
   }
   ```

4. Resource utilization:

   ```typescript:preview
   class ResourceMonitor {
     private readonly monitors: Map<string, Monitor> = new Map();
     private aggregator: MetricsAggregator;

     constructor() {
       this.aggregator = new MetricsAggregator();
       this.setupMonitors();
     }

     private setupMonitors(): void {
       this.monitors.set('memory', new MemoryMonitor());
       this.monitors.set('cpu', new CpuProfiler());
       this.monitors.set('eventLoop', new EventLoopMonitor());
     }

     startMonitoring(): void {
       for (const monitor of this.monitors.values()) {
         monitor.start();
       }
     }

     stopMonitoring(): void {
       for (const monitor of this.monitors.values()) {
         monitor.stop();
       }
     }

     getResourceStats(): ResourceStats {
       const stats: ResourceStats = {
         timestamp: Date.now(),
         metrics: {},
       };

       for (const [name, monitor] of this.monitors) {
         stats.metrics[name] = monitor.getStats();
       }

       return stats;
     }

     async generateReport(): Promise<ResourceReport> {
       const stats = this.getResourceStats();
       return this.aggregator.generateReport(stats);
     }
   }
   ```
