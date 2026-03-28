/**
 * Balance Converter Tests - TDD approach
 * Tests for conversion between KSHS and raw units
 */

const { BalanceConverter } = require('../utils/balance-converter');

describe('BalanceConverter', () => {
    describe('rawToKshs conversion', () => {
        test('should convert 1 KSHS (10^30 raw) correctly', () => {
            const raw = '1000000000000000000000000000000'; // 1 KSHS
            const result = BalanceConverter.rawToKshs(raw);
            expect(result).toBe('1');
        });

        test('should convert 0.1 KSHS correctly', () => {
            const raw = '100000000000000000000000000000'; // 0.1 KSHS
            const result = BalanceConverter.rawToKshs(raw);
            expect(result).toBe('0.1');
        });

        test('should convert 0.001 KSHS correctly', () => {
            const raw = '1000000000000000000000000000'; // 0.001 KSHS
            const result = BalanceConverter.rawToKshs(raw);
            expect(result).toBe('0.001');
        });

        test('should convert 0.0011 KSHS correctly (user reported bug)', () => {
            const raw = '1100000000000000000000000000'; // 0.0011 KSHS
            const result = BalanceConverter.rawToKshs(raw);
            expect(result).toBe('0.0011');
        });

        test('should convert 0.000001 KSHS correctly', () => {
            const raw = '1000000000000000000000000'; // 0.000001 KSHS
            const result = BalanceConverter.rawToKshs(raw);
            expect(result).toBe('0.000001');
        });

        test('should convert 0 raw correctly', () => {
            const raw = '0';
            const result = BalanceConverter.rawToKshs(raw);
            expect(result).toBe('0');
        });

        test('should convert large amounts correctly', () => {
            const raw = '133248297920938463463374607431768211455'; // Large amount
            const result = BalanceConverter.rawToKshs(raw);
            // This is actually 133248297.920938463463374607431768211455 KSHS
            expect(parseFloat(result)).toBeCloseTo(133248297.920938, 6);
        });

        test('should handle maximum precision', () => {
            const raw = '1234567890123456789012345678901'; // 1.234567890123... KSHS
            const result = BalanceConverter.rawToKshs(raw);
            expect(result).toMatch(/^1\.234567/);
        });
    });

    describe('kshsToRaw conversion', () => {
        test('should convert 1 KSHS to raw correctly', () => {
            const kakitu = '1';
            const result = BalanceConverter.kshsToRaw(kakitu);
            expect(result).toBe('1000000000000000000000000000000');
        });

        test('should convert 0.1 KSHS to raw correctly', () => {
            const kakitu = '0.1';
            const result = BalanceConverter.kshsToRaw(kakitu);
            expect(result).toBe('100000000000000000000000000000');
        });

        test('should convert 0.001 KSHS to raw correctly', () => {
            const kakitu = '0.001';
            const result = BalanceConverter.kshsToRaw(kakitu);
            expect(result).toBe('1000000000000000000000000000');
        });

        test('should convert 0.0011 KSHS to raw correctly', () => {
            const kakitu = '0.0011';
            const result = BalanceConverter.kshsToRaw(kakitu);
            expect(result).toBe('1100000000000000000000000000');
        });

        test('should handle numeric input', () => {
            const kakitu = 0.5;
            const result = BalanceConverter.kshsToRaw(kakitu);
            expect(result).toBe('500000000000000000000000000000');
        });
    });

    describe('Round-trip conversions', () => {
        test('should maintain value through round-trip conversion', () => {
            const originalKshs = '0.123456';
            const raw = BalanceConverter.kshsToRaw(originalKshs);
            const backToKshs = BalanceConverter.rawToKshs(raw);
            expect(backToKshs).toBe(originalKshs);
        });

        test('should maintain value for small amounts', () => {
            const originalKshs = '0.000001';
            const raw = BalanceConverter.kshsToRaw(originalKshs);
            const backToKshs = BalanceConverter.rawToKshs(raw);
            expect(backToKshs).toBe(originalKshs);
        });

        test('should maintain value for large amounts', () => {
            const originalKshs = '1000';
            const raw = BalanceConverter.kshsToRaw(originalKshs);
            const backToKshs = BalanceConverter.rawToKshs(raw);
            expect(backToKshs).toBe(originalKshs);
        });
    });

    describe('Edge cases', () => {
        test('should handle zero correctly', () => {
            expect(BalanceConverter.kshsToRaw('0')).toBe('0');
            expect(BalanceConverter.rawToKshs('0')).toBe('0');
        });

        test('should remove trailing zeros', () => {
            const raw = '100000000000000000000000000000'; // 0.1
            const result = BalanceConverter.rawToKshs(raw);
            expect(result).toBe('0.1');
            expect(result).not.toBe('0.100000');
        });

        test('should validate raw amounts', () => {
            expect(BalanceConverter.isValidRaw('1000')).toBe(true);
            expect(BalanceConverter.isValidRaw('0')).toBe(true);
            expect(BalanceConverter.isValidRaw('invalid')).toBe(false);
            expect(BalanceConverter.isValidRaw('-100')).toBe(false);
        });
    });

    describe('Logging', () => {
        test('should log conversion for debugging', () => {
            const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
            
            BalanceConverter.rawToKshs('1000000000000000000000000000');
            
            expect(consoleLogSpy).toHaveBeenCalledWith(
                expect.stringContaining('[BalanceConverter] Converting')
            );
            expect(consoleLogSpy).toHaveBeenCalledWith(
                expect.stringContaining('[BalanceConverter] Result:')
            );
            
            consoleLogSpy.mockRestore();
        });
    });
});

