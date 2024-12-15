import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { performanceLogger } from '../performanceLogger';
import { logger } from '../logger';

vi.mock('../logger', () => ({
  logger: {
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}));

describe('PerformanceLogger', () => {
  beforeEach(() => {
    performanceLogger.clearMetrics();
    performanceLogger.enable(false);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('Basic Operations', () => {
    it('should maintain singleton instance', () => {
      const instance1 = performanceLogger;
      const instance2 = performanceLogger;
      expect(instance1).toBe(instance2);
    });

    it('should enable/disable logging', () => {
      performanceLogger.enable(true);
      expect(logger.info).toHaveBeenCalledWith(
        'performance',
        'Performance logging enabled',
        undefined
      );

      performanceLogger.enable(false);
      expect(logger.info).toHaveBeenCalledWith(
        'performance',
        'Performance logging disabled',
        undefined
      );
    });
  });

  describe('Performance Monitoring', () => {
    it('should create and measure marks', () => {
      performanceLogger.enable(true);
      const metadata = { test: 'data' };
      
      performanceLogger.mark('test', metadata);
      vi.advanceTimersByTime(100);
      const measurement = performanceLogger.measure('test');

      expect(measurement).toBeDefined();
      expect(measurement?.duration).toBeGreaterThan(0);
      expect(measurement?.metadata).toEqual(metadata);
    });

    it('should handle non-existent marks', () => {
      performanceLogger.enable(true);
      const measurement = performanceLogger.measure('nonexistent');
      
      expect(measurement).toBeUndefined();
      expect(logger.warn).toHaveBeenCalledWith(
        'performance',
        'No mark found for measurement: nonexistent'
      );
    });

    it('should track multiple marks', () => {
      performanceLogger.mark('test1');
      performanceLogger.mark('test2');
      
      vi.advanceTimersByTime(100);
      performanceLogger.measure('test1');
      
      vi.advanceTimersByTime(100);
      performanceLogger.measure('test2');

      const metrics = performanceLogger.getMetrics();
      expect(metrics).toHaveLength(2);
      expect(metrics[0].duration).toBeLessThan(metrics[1].duration as number);
    });

    it('should merge additional metadata during measurement', () => {
      performanceLogger.mark('test', { initial: 'data' });
      const measurement = performanceLogger.measure('test', { additional: 'info' });

      expect(measurement?.metadata).toEqual({
        initial: 'data',
        additional: 'info'
      });
    });
  });

  describe('Reporting', () => {
    it('should generate accurate report', () => {
      performanceLogger.mark('test1', { type: 'operation1' });
      performanceLogger.mark('test2', { type: 'operation2' });
      
      vi.advanceTimersByTime(100);
      performanceLogger.measure('test1');
      
      vi.advanceTimersByTime(100);
      performanceLogger.measure('test2');

      const report = JSON.parse(performanceLogger.generateReport());
      expect(report).toMatchObject({
        totalMarks: 2,
        metrics: expect.arrayContaining([
          expect.objectContaining({
            name: 'test1',
            metadata: { type: 'operation1' }
          }),
          expect.objectContaining({
            name: 'test2',
            metadata: { type: 'operation2' }
          })
        ])
      });
    });

    it('should clear metrics', () => {
      performanceLogger.mark('test');
      performanceLogger.measure('test');
      expect(performanceLogger.getMetrics()).toHaveLength(1);

      performanceLogger.clearMetrics();
      expect(performanceLogger.getMetrics()).toHaveLength(0);
    });

    it('should finalize and generate summary', () => {
      performanceLogger.enable(true);
      performanceLogger.mark('test1');
      performanceLogger.mark('test2');
      performanceLogger.measure('test1');
      performanceLogger.measure('test2');

      performanceLogger.finalize();

      expect(logger.info).toHaveBeenCalledWith(
        'performance',
        'Performance metrics summary:',
        expect.objectContaining({
          totalMarks: 2,
          metrics: expect.any(Array)
        })
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle marks with no metadata', () => {
      performanceLogger.mark('test');
      const measurement = performanceLogger.measure('test');
      expect(measurement?.metadata).toBeUndefined();
    });

    it('should handle rapid mark/measure operations', () => {
      for (let i = 0; i < 100; i++) {
        performanceLogger.mark(`test${i}`);
        performanceLogger.measure(`test${i}`);
      }

      const metrics = performanceLogger.getMetrics();
      expect(metrics).toHaveLength(100);
      metrics.forEach(metric => {
        expect(metric.duration).toBeDefined();
        expect(metric.duration).toBeGreaterThanOrEqual(0);
      });
    });

    it('should handle disabled state correctly', () => {
      performanceLogger.enable(false);
      performanceLogger.mark('test', { data: 'test' });
      performanceLogger.measure('test');

      expect(logger.debug).not.toHaveBeenCalled();
    });
  });
}); 