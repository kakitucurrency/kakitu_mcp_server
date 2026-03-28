/**
 * Kakitu Converter Tests - TDD approach
 * Tests for centralized Kakitu (KSHS) conversion utilities
 * 
 * Uses string-based BigInt arithmetic for exact precision
 * NO floating-point math to avoid rounding errors
 * Kakitu uses 30 decimal places (10^30 raw units = 1 KSHS)
 */

const { KakituConverter } = require('../utils/kakitu-converter');

describe('KakituConverter', () => {
    describe('kshsToRaw conversion', () => {
        test('should convert 1 KSHS to raw correctly', () => {
            const result = KakituConverter.kshsToRaw(1);
            expect(result).toBe('1000000000000000000000000000000');
        });

        test('should convert 0.000001 KSHS to raw correctly', () => {
            const result = KakituConverter.kshsToRaw(0.000001);
            expect(result).toBe('1000000000000000000000000');
        });

        test('should convert 0.1 KSHS as string to raw correctly', () => {
            const result = KakituConverter.kshsToRaw('0.1');
            expect(result).toBe('100000000000000000000000000000');
        });

        test('should convert 0.5 KSHS to raw correctly', () => {
            const result = KakituConverter.kshsToRaw(0.5);
            expect(result).toBe('500000000000000000000000000000');
        });

        test('should convert 2.5 KSHS to raw correctly', () => {
            const result = KakituConverter.kshsToRaw(2.5);
            expect(result).toBe('2500000000000000000000000000000');
        });

        test('should convert 100 KSHS to raw correctly', () => {
            const result = KakituConverter.kshsToRaw(100);
            expect(result).toBe('100000000000000000000000000000000');
        });

        test('should handle very small amounts (0.000000001)', () => {
            const result = KakituConverter.kshsToRaw('0.000000001');
            expect(result).toBe('1000000000000000000000');
        });

        test('should handle scientific notation (1e-9)', () => {
            const result = KakituConverter.kshsToRaw(1e-9);
            // Note: JavaScript floating-point may have precision issues with scientific notation
            // The result should be close to 1000000000000000000000 (within floating-point error)
            expect(BigInt(result)).toBeGreaterThan(BigInt('999999999999999999999'));
            expect(BigInt(result)).toBeLessThan(BigInt('1000000000000001000000'));
        });

        test('should handle zero', () => {
            const result = KakituConverter.kshsToRaw(0);
            expect(result).toBe('0');
        });

        test('should truncate to 30 decimal places if longer', () => {
            const result = KakituConverter.kshsToRaw('0.1234567890123456789012345678901234567890');
            expect(result).toBe('123456789012345678901234567890');
        });

        test('should handle string input with many decimals', () => {
            const result = KakituConverter.kshsToRaw('0.123456');
            expect(result).toBe('123456000000000000000000000000');
        });
    });

    describe('rawToKshs conversion', () => {
        test('should convert 1 KSHS raw to KSHS correctly', () => {
            const result = KakituConverter.rawToKshs('1000000000000000000000000000000');
            expect(result).toBe('1');
        });

        test('should convert 0.000001 KSHS raw to KSHS correctly', () => {
            const result = KakituConverter.rawToKshs('1000000000000000000000000');
            expect(result).toBe('0.000001');
        });

        test('should convert 0.1 KSHS raw to KSHS correctly', () => {
            const result = KakituConverter.rawToKshs('100000000000000000000000000000');
            expect(result).toBe('0.1');
        });

        test('should convert 0 raw to KSHS correctly', () => {
            const result = KakituConverter.rawToKshs('0');
            expect(result).toBe('0');
        });

        test('should handle large amounts correctly', () => {
            const result = KakituConverter.rawToKshs('133248297920938463463374607431768211455');
            expect(result).toBe('133248297.920938463463374607431768211455');
        });

        test('should remove trailing zeros', () => {
            const result = KakituConverter.rawToKshs('100000000000000000000000000000');
            expect(result).toBe('0.1');
            expect(result).not.toContain('0.100000');
        });

        test('should handle minimum raw value (1)', () => {
            const result = KakituConverter.rawToKshs('1');
            expect(result).toBe('0.000000000000000000000000000001');
        });
    });

        describe('isValidKakituAddress', () => {
        test('should validate correct kshs_ address', () => {
            const address = 'kshs_3h3m6kfckrxpc4t33jn36eu8smfpukwuq1zq4hy35dh4a7drs6ormhwhkncn';
            expect(KakituConverter.isValidKakituAddress(address)).toBe(true);
        });

        test('should validate correct kshs_ address', () => {
            const address = 'kshs_3h3m6kfckrxpc4t33jn36eu8smfpukwuq1zq4hy35dh4a7drs6ormhwhkncn';
            expect(KakituConverter.isValidKakituAddress(address)).toBe(true);
        });

        test('should reject invalid prefix', () => {
            const address = 'invalid_3h3m6kfckrxpc4t33jn36eu8smfpukwuq1zq4hy35dh4a7drs6ormhwhkncn';
            expect(KakituConverter.isValidKakituAddress(address)).toBe(false);
        });

        test('should reject short address', () => {
            const address = 'kshs_3h3m6k';
            expect(KakituConverter.isValidKakituAddress(address)).toBe(false);
        });

        test('should reject empty string', () => {
            expect(KakituConverter.isValidKakituAddress('')).toBe(false);
        });

        test('should reject address with invalid characters', () => {
            const address = 'kshs_3h3m6kfckrxpc4t33jn36eu8smfpukwuq1zq4hy35dh4a7drs6ormhwhk!!!';
            expect(KakituConverter.isValidKakituAddress(address)).toBe(false);
        });

        test('should reject address not starting with 1 or 3', () => {
            const address = 'kshs_2h3m6kfckrxpc4t33jn36eu8smfpukwuq1zq4hy35dh4a7drs6ormhwhkncn';
            expect(KakituConverter.isValidKakituAddress(address)).toBe(false);
        });
    });

    describe('formatKshs', () => {
        test('should format KSHS with default 6 decimals', () => {
            const result = KakituConverter.formatKshs('0.123456789');
            expect(result).toBe('0.123457');
        });

        test('should format KSHS with custom decimals', () => {
            const result = KakituConverter.formatKshs('1.5', 2);
            expect(result).toBe('1.50');
        });

        test('should format KSHS with 0 decimals', () => {
            const result = KakituConverter.formatKshs('1.9999', 0);
            expect(result).toBe('2');
        });

        test('should format KSHS from number input', () => {
            const result = KakituConverter.formatKshs(1.234567, 4);
            expect(result).toBe('1.2346');
        });

        test('should handle large numbers', () => {
            const result = KakituConverter.formatKshs('1000000.123456', 2);
            expect(result).toBe('1000000.12');
        });

        test('should round correctly', () => {
            const result = KakituConverter.formatKshs('0.9999', 2);
            expect(result).toBe('1.00');
        });
    });

    describe('Round-trip conversions', () => {
        test('should maintain value through round-trip conversion', () => {
            const originalKshs = '0.123456';
            const raw = KakituConverter.kshsToRaw(originalKshs);
            const backToKshs = KakituConverter.rawToKshs(raw);
            expect(backToKshs).toBe(originalKshs);
        });

        test('should maintain value for very small amounts', () => {
            const originalKshs = '0.000001';
            const raw = KakituConverter.kshsToRaw(originalKshs);
            const backToKshs = KakituConverter.rawToKshs(raw);
            expect(backToKshs).toBe(originalKshs);
        });

        test('should maintain value for large amounts', () => {
            const originalKshs = '1000000';
            const raw = KakituConverter.kshsToRaw(originalKshs);
            const backToKshs = KakituConverter.rawToKshs(raw);
            expect(backToKshs).toBe(originalKshs);
        });
    });

    describe('Edge cases', () => {
        test('should handle empty string in kshsToRaw', () => {
            expect(() => KakituConverter.kshsToRaw('')).toThrow();
        });

        test('should handle invalid string in rawToKshs', () => {
            expect(() => KakituConverter.rawToKshs('invalid')).toThrow();
        });

        test('should handle negative numbers in kshsToRaw', () => {
            const result = KakituConverter.kshsToRaw('-1');
            expect(result).toBe('-1000000000000000000000000000000');
        });

        test('should handle very large numbers', () => {
            const result = KakituConverter.kshsToRaw('999999999999');
            expect(result).toBe('999999999999000000000000000000000000000000');
        });
    });

    describe('Logging and Debugging', () => {
        test('should log conversion for debugging', () => {
            const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
            
            KakituConverter.kshsToRaw('1');
            
            expect(consoleLogSpy).toHaveBeenCalledWith(
                expect.stringContaining('[KakituConverter]')
            );
            
            consoleLogSpy.mockRestore();
        });

        test('should log errors for invalid input', () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            
            try {
                KakituConverter.rawToKshs('invalid');
            } catch (error) {
                // Expected to throw
            }
            
            expect(consoleErrorSpy).toHaveBeenCalled();
            
            consoleErrorSpy.mockRestore();
        });
    });

    describe('getConversionExamples', () => {
        test('should return conversion examples', () => {
            const examples = KakituConverter.getConversionExamples();
            expect(examples).toHaveProperty('1_KSHS');
            expect(examples['1_KSHS']).toBe('1000000000000000000000000000000');
            expect(examples['0.1_KSHS']).toBe('100000000000000000000000000000');
        });
    });

    describe('getConversionHelp', () => {
        test('should return helpful conversion information', () => {
            const help = KakituConverter.getConversionHelp();
            expect(help).toHaveProperty('description');
            expect(help).toHaveProperty('formula');
            expect(help).toHaveProperty('examples');
            expect(help).toHaveProperty('commonMistakes');
        });
    });
});

