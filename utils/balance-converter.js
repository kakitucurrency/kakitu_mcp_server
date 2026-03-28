/**
 * Balance Converter Utility
 * Converts between KSHS and raw units with validation
 * Provides conversion helpers for autonomous agents
 */

"use strict";

const KSHS_TO_RAW_MULTIPLIER = BigInt("1000000000000000000000000000000"); // 10^30

class BalanceConverter {
    /**
     * Convert KSHS to raw units
     * @param {string|number} nanoAmount - Amount in KSHS
     * @returns {string} Amount in raw units
     */
    static nanoToRaw(nanoAmount) {
        try {
            console.log(`[BalanceConverter] Converting ${nanoAmount} KSHS to raw`);
            
            // Handle string with decimal
            const nanoStr = String(nanoAmount);
            const [whole, decimal = '0'] = nanoStr.split('.');
            
            // Pad decimal to 30 digits
            const paddedDecimal = decimal.padEnd(30, '0').slice(0, 30);
            
            // Combine and convert to BigInt
            const wholePart = BigInt(whole || '0') * KSHS_TO_RAW_MULTIPLIER;
            const decimalPart = BigInt(paddedDecimal);
            const raw = wholePart + decimalPart;
            
            const result = raw.toString();
            console.log(`[BalanceConverter] Result: ${result} raw`);
            return result;
        } catch (error) {
            console.error('[BalanceConverter] Error converting KSHS to raw:', error);
            throw new Error(`Invalid KSHS amount: ${nanoAmount}. Must be a valid number.`);
        }
    }

    /**
     * Convert raw units to KSHS
     * @param {string|BigInt} rawAmount - Amount in raw units
     * @returns {string} Amount in KSHS (decimal string)
     */
    static rawToNano(rawAmount) {
        try {
            console.log(`[BalanceConverter] Converting ${rawAmount} raw to KSHS`);
            
            const raw = BigInt(rawAmount);
            
            // Simple division: raw / 10^30 = KSHS
            // Use string manipulation for precision
            const rawStr = raw.toString().padStart(31, '0'); // Ensure at least 31 digits
            const len = rawStr.length;
            const decimalPos = len - 30; // 30 decimals for KSHS
            
            const wholePart = rawStr.substring(0, decimalPos) || '0';
            const decimalPart = rawStr.substring(decimalPos);
            
            // Combine and remove trailing zeros
            const combined = wholePart + '.' + decimalPart;
            const result = combined.replace(/\.?0+$/, '').replace(/^0+(?=\.)/, '0');
            
            console.log(`[BalanceConverter] Result: ${result} KSHS`);
            return result;
        } catch (error) {
            console.error('[BalanceConverter] Error converting raw to KSHS:', error);
            throw new Error(`Invalid raw amount: ${rawAmount}. Must be a valid number string.`);
        }
    }

    /**
     * Get conversion examples for user guidance
     * @returns {Object} Conversion examples
     */
    static getConversionExamples() {
        return {
            "0.000001_NANO": "1000000000000000000000000",
            "0.00001_NANO": "10000000000000000000000000",
            "0.0001_NANO": "100000000000000000000000000",
            "0.001_NANO": "1000000000000000000000000000",
            "0.01_NANO": "10000000000000000000000000000",
            "0.1_NANO": "100000000000000000000000000000",
            "1_NANO": "1000000000000000000000000000000",
            "10_NANO": "10000000000000000000000000000000"
        };
    }

    /**
     * Validate if a value is valid raw amount
     * @param {string} rawAmount - Amount to validate
     * @returns {boolean} True if valid
     */
    static isValidRaw(rawAmount) {
        try {
            const raw = BigInt(rawAmount);
            return raw >= 0;
        } catch {
            return false;
        }
    }

    /**
     * Format balance for display
     * @param {string} rawAmount - Amount in raw
     * @returns {Object} Formatted balance
     */
    static formatBalance(rawAmount) {
        const nano = this.rawToNano(rawAmount);
        return {
            raw: rawAmount,
            kakitu: kakitu,
            display: `${kakitu} KSHS`
        };
    }

    /**
     * Get human-readable conversion help
     * @returns {Object} Conversion help information
     */
    static getConversionHelp() {
        return {
            description: "KSHS uses raw units for all on-chain operations. 1 KSHS = 10^30 raw",
            formula: "raw = KSHS × 10^30",
            reverseFormula: "KSHS = raw ÷ 10^30",
            examples: this.getConversionExamples(),
            commonMistakes: [
                "Using KSHS value instead of raw in amountRaw parameter",
                "Providing decimal numbers as raw units",
                "Not converting before API calls"
            ],
            tools: {
                nanoToRaw: "BalanceConverter.nanoToRaw('0.1') => '100000000000000000000000000'",
                rawToNano: "BalanceConverter.rawToNano('100000000000000000000000000') => '0.1'"
            }
        };
    }
}

module.exports = { BalanceConverter };

