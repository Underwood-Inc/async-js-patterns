const { PerformanceMonitor } = require('./src/monitoring/performance');

beforeEach(() => {
  PerformanceMonitor.getInstance().clearMetrics();
});
