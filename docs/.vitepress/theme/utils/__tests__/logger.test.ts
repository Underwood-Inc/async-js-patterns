import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger, debugLog, toggleDebugLogging, measurePerformance } from '../logger';

describe('Logger', () => {
  beforeEach(() => {
    logger.clearHistory();
    toggleDebugLogging(false);
    vi.useFakeTimers();
    vi.spyOn(console, 'group');
    vi.spyOn(console, 'groupEnd');
    vi.spyOn(console, 'dir');
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('Basic Logging', () => {
    it('should not output logs when disabled', () => {
      const consoleSpy = vi.spyOn(console, 'debug');
      debugLog('dev', 'test message');
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('should output logs when enabled', () => {
      const consoleSpy = vi.spyOn(console, 'debug');
      toggleDebugLogging(true);
      debugLog('dev', 'test message');
      expect(consoleSpy).toHaveBeenCalledWith('[DEV]', 'test message', undefined);
    });

    it('should handle all log levels', () => {
      toggleDebugLogging(true);
      const spies = {
        debug: vi.spyOn(console, 'debug'),
        info: vi.spyOn(console, 'info'),
        warn: vi.spyOn(console, 'warn'),
        error: vi.spyOn(console, 'error')
      };

      logger.debug('dev', 'debug message');
      logger.info('dev', 'info message');
      logger.warn('dev', 'warn message');
      logger.error('dev', 'error message');

      expect(spies.debug).toHaveBeenCalledWith('[DEV]', 'debug message', undefined);
      expect(spies.info).toHaveBeenCalledWith('[DEV]', 'info message', undefined);
      expect(spies.warn).toHaveBeenCalledWith('[DEV]', 'warn message', undefined);
      expect(spies.error).toHaveBeenCalledWith('[DEV]', 'error message', undefined);
    });

    it('should maintain log history even when disabled', () => {
      debugLog('dev', 'test message');
      const history = logger.getLogHistory();
      expect(history).toHaveLength(1);
      expect(history[0]).toMatchObject({
        level: 'debug',
        category: 'dev',
        message: 'test message'
      });
    });

    it('should rotate history when exceeding MAX_HISTORY', () => {
      const MAX_HISTORY = 1000;
      for (let i = 0; i < MAX_HISTORY + 10; i++) {
        debugLog('dev', `message ${i}`);
      }
      const history = logger.getLogHistory();
      expect(history).toHaveLength(MAX_HISTORY);
      expect(history[0].message).toBe('message 10');
    });
  });

  describe('Group Management', () => {
    it('should handle group creation and nesting', () => {
      toggleDebugLogging(true);
      logger.group('Group 1');
      logger.debug('dev', 'message in group 1');
      logger.group('Group 2');
      logger.debug('dev', 'message in group 2');
      logger.groupEnd();
      logger.debug('dev', 'back in group 1');
      logger.groupEnd();

      const history = logger.getLogHistory();
      expect(history[0].groupId).toBe('Group 1');
      expect(history[0].groupLevel).toBe(1);
      expect(history[1].groupId).toBe('Group 2');
      expect(history[1].groupLevel).toBe(2);
      expect(history[2].groupId).toBe('Group 1');
      expect(history[2].groupLevel).toBe(1);
    });

    it('should handle group operations when disabled', () => {
      logger.group('Test Group');
      logger.debug('dev', 'test message');
      logger.groupEnd();

      expect(console.group).not.toHaveBeenCalled();
      expect(console.groupEnd).not.toHaveBeenCalled();
    });

    it('should handle unbalanced group ends', () => {
      toggleDebugLogging(true);
      logger.group('Group 1');
      logger.groupEnd();
      logger.groupEnd(); // Extra end
      logger.debug('dev', 'message');

      const history = logger.getLogHistory();
      expect(history[0].groupLevel).toBe(0);
    });
  });

  describe('Enhanced Debug Features', () => {
    it('should use console.dir for object inspection', () => {
      toggleDebugLogging(true);
      const complexObject = { nested: { data: 'test' } };
      logger.debug('dev', 'complex data', complexObject);

      expect(console.dir).toHaveBeenCalledWith(complexObject, { depth: null });
    });

    it('should include indentation for nested groups', () => {
      toggleDebugLogging(true);
      const debugSpy = vi.spyOn(console, 'debug');

      logger.group('Level 1');
      logger.debug('dev', 'message');
      logger.group('Level 2');
      logger.debug('dev', 'nested message');
      logger.groupEnd();
      logger.groupEnd();

      expect(debugSpy).toHaveBeenCalledWith('[DEV]  ', 'message', undefined);
      expect(debugSpy).toHaveBeenCalledWith('[DEV]    ', 'nested message', undefined);
    });

    it('should generate report with group information', () => {
      toggleDebugLogging(true);
      logger.group('Test Group');
      logger.debug('dev', 'message 1');
      logger.debug('dev', 'message 2');
      logger.groupEnd();

      const report = JSON.parse(logger.generateReport());
      expect(report.logsByGroup).toHaveProperty('Test Group', 2);
    });
  });

  describe('Performance Monitoring', () => {
    it('should measure sync function execution time', () => {
      toggleDebugLogging(true);
      const result = measurePerformance('test', () => 'result');
      expect(result).toBe('result');
      const metrics = logger.getPerformanceMetrics();
      expect(metrics).toHaveLength(1);
      expect(metrics[0].name).toBe('test');
      expect(typeof metrics[0].duration).toBe('number');
    });

    it('should measure async function execution time', async () => {
      toggleDebugLogging(true);
      const result = await measurePerformance('test', async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return 'async result';
      });
      expect(result).toBe('async result');
      const metrics = logger.getPerformanceMetrics();
      expect(metrics).toHaveLength(1);
      expect(metrics[0].name).toBe('test');
      expect(typeof metrics[0].duration).toBe('number');
    });

    it('should handle performance marks with metadata', () => {
      logger.mark('test', { custom: 'data' });
      const mark = logger.measure('test', { additional: 'info' });
      expect(mark).toBeDefined();
      expect(mark?.metadata).toEqual({
        custom: 'data',
        additional: 'info'
      });
    });

    it('should warn when measuring non-existent mark', () => {
      const warnSpy = vi.spyOn(console, 'warn');
      toggleDebugLogging(true);
      logger.measure('nonexistent');
      expect(warnSpy).toHaveBeenCalledWith(
        '[PERFORMANCE]',
        'No mark found for measurement: nonexistent'
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined data parameters', () => {
      toggleDebugLogging(true);
      const consoleSpy = vi.spyOn(console, 'debug');
      debugLog('dev', 'message', undefined);
      expect(consoleSpy).toHaveBeenCalledWith('[DEV]', 'message', undefined);
    });

    it('should handle complex data objects', () => {
      toggleDebugLogging(true);
      const complexData = {
        nested: {
          array: [1, 2, 3],
          date: new Date(),
          regex: /test/,
          circular: {}
        }
      };
      complexData.nested.circular = complexData;

      const consoleSpy = vi.spyOn(console, 'debug');
      debugLog('dev', 'message', complexData);
      expect(consoleSpy).toHaveBeenCalledWith('[DEV]', 'message', complexData);
      expect(console.dir).toHaveBeenCalledWith(complexData, { depth: null });
    });

    it('should maintain singleton instance', () => {
      const instance1 = logger;
      const instance2 = logger;
      expect(instance1).toBe(instance2);
    });

    it('should clear groups on history clear', () => {
      toggleDebugLogging(true);
      logger.group('Test');
      logger.debug('dev', 'message');
      logger.clearHistory();
      logger.debug('dev', 'new message');

      const history = logger.getLogHistory();
      expect(history[0].groupLevel).toBe(0);
      expect(history[0].groupId).toBeUndefined();
    });
  });
}); 