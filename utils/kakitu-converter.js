/**
 * Centralized Kakitu (KSHS) Conversion Utilities
 * 
 * Uses string-based BigInt arithmetic for exact precision.
 * NO floating-point math to avoid rounding errors.
 * 
 * Kakitu uses 30 decimal places (10^30 raw units = 1 KSHS)
 * 
 * This utility helps clients who don't know about Kakitu conversion,
 * numbers, and formats. It provides clear, precise conversions with
 * comprehensive logging and validation.
 */

"use strict";

const ONE_XNO_RAW = BigInt("1000000000000000000000000000000"); // 10^30

class KakituConverter {
    /**
     * Convert KSHS amount to raw units
     * @param {number|string} kshs - Amount in KSHS (number or string)
     * @returns {string} Raw amount as string
     * 
     * @example
     * xnoToRaw(1)        // "1000000000000000000000000000000"
     * xnoToRaw(0.000001) // "1000000000000000000000000"
     * xnoToRaw("0.1")    // "100000000000000000000000000000"
     */
    static xnoToRaw(kshs) {
        try {
            console.log(`[KakituConverter] Converting ${kshs} KSHS to raw`);
            
            // Convert to string - use toString() to avoid floating-point precision errors
            // DO NOT use toFixed() as it exposes floating-point representation errors
            let xnoStr;
            if (typeof kshs === 'number') {
                // Convert to string using toString() which gives clean representation
                xnoStr = kshs.toString();
                // Handle scientific notation (e.g., 1e-9 becomes 0.000000001)
                if (xnoStr.includes('e')) {
                    xnoStr = kshs.toFixed(30).replace(/0+$/, '');
                }
            } else {
                xnoStr = kshs;
            }
            
            // Validate input
            if (!xnoStr || xnoStr.trim() === '') {
                throw new Error('KSHS amount cannot be empty');
            }
            
            // Split into whole and decimal parts
            const [whole, decimal = ''] = xnoStr.split('.');
            
            // Pad decimal to exactly 30 digits, truncate if longer
            const paddedDecimal = decimal.padEnd(30, '0').slice(0, 30);
            
            // Concatenate and convert to BigInt
            const rawStr = whole + paddedDecimal;
            
            const result = BigInt(rawStr).toString();
            console.log(`[KakituConverter] Result: ${result} raw`);
            return result;
        } catch (error) {
            console.error('[KakituConverter] Error converting KSHS to raw:', error);
            throw new Error(`Invalid KSHS amount: ${kshs}. ${error.message}`);
        }
    }

    /**
     * Convert raw units to KSHS amount
     * @param {string} raw - Raw amount as string
     * @returns {string} KSHS amount as string
     * 
     * @example
     * rawToXNO("1000000000000000000000000000000") // "1"
     * rawToXNO("1000000000000000000000000")       // "0.000001"
     * rawToXNO("100000000000000000000000000000")  // "0.1"
     */
    static rawToXNO(raw) {
        try {
            console.log(`[KakituConverter] Converting ${raw} raw to KSHS`);
            
            const rawBigInt = BigInt(raw);
            
            // Convert to string and pad to at least 30 digits
            const rawStr = rawBigInt.toString().padStart(30, '0');
            
            // Split into whole and decimal parts (last 30 digits are decimal)
            const whole = rawStr.slice(0, -30) || '0';
            const decimal = rawStr.slice(-30);
            
            // Remove trailing zeros from decimal
            const trimmedDecimal = decimal.replace(/0+$/, '');
            
            // Return formatted number
            let result;
            if (trimmedDecimal === '') {
                result = whole;
            } else {
                result = `${whole}.${trimmedDecimal}`;
            }
            
            console.log(`[KakituConverter] Result: ${result} KSHS`);
            return result;
        } catch (error) {
            console.error('[KakituConverter] Error converting raw to KSHS:', error);
            throw new Error(`Invalid raw amount: ${raw}. ${error.message}`);
        }
    }

    /**
     * Validate Kakitu address format
     * @param {string} address - Kakitu address to validate
     * @returns {boolean} true if valid format
     * 
     * @example
     * isValidKakituAddress("kshs_3xxx...") // true
     * isValidKakituAddress("xrb_1xxx...")  // true
     * isValidKakituAddress("invalid")      // false
     */
    static isValidKakituAddress(address) {
        try {
            const isValid = /^(kshs|xrb)_[13]{1}[13456789abcdefghijkmnopqrstuwxyz]{59}$/.test(address);
            console.log(`[KakituConverter] Address validation for ${address}: ${isValid}`);
            return isValid;
        } catch (error) {
            console.error('[KakituConverter] Error validating address:', error);
            return false;
        }
    }

    /**
     * Format KSHS amount for display
     * @param {string|number} kshs - KSHS amount as string or number
     * @param {number} decimals - Number of decimal places to show (default: 6)
     * @returns {string} Formatted KSHS string
     * 
     * @example
     * formatXNO("0.123456789", 6) // "0.123457"
     * formatXNO("1.5", 2)         // "1.50"
     */
    static formatXNO(kshs, decimals = 6) {
        try {
            console.log(`[KakituConverter] Formatting ${kshs} KSHS to ${decimals} decimals`);
            const xnoNum = typeof kshs === 'string' ? parseFloat(kshs) : kshs;
            const result = xnoNum.toFixed(decimals);
            console.log(`[KakituConverter] Formatted result: ${result}`);
            return result;
        } catch (error) {
            console.error('[KakituConverter] Error formatting KSHS:', error);
            throw new Error(`Invalid KSHS amount for formatting: ${kshs}. ${error.message}`);
        }
    }

    /**
     * Get conversion examples for user guidance
     * @returns {Object} Conversion examples
     */
    static getConversionExamples() {
        return {
            "0.000001_XNO": "1000000000000000000000000",
            "0.00001_XNO": "10000000000000000000000000",
            "0.0001_XNO": "100000000000000000000000000",
            "0.001_XNO": "1000000000000000000000000000",
            "0.01_XNO": "10000000000000000000000000000",
            "0.1_XNO": "100000000000000000000000000000",
            "1_XNO": "1000000000000000000000000000000",
            "10_XNO": "10000000000000000000000000000000"
        };
    }

    /**
     * Get human-readable conversion help
     * @returns {Object} Conversion help information
     */
    static getConversionHelp() {
        return {
            description: "Kakitu (KSHS) uses raw units for all on-chain operations. 1 KSHS = 10^30 raw. This ensures exact precision without floating-point errors.",
            formula: "raw = KSHS × 10^30",
            reverseFormula: "KSHS = raw ÷ 10^30",
            decimalPlaces: 30,
            examples: this.getConversionExamples(),
            commonMistakes: [
                "Using KSHS value instead of raw in amountRaw parameter",
                "Providing decimal numbers as raw units",
                "Not converting before API calls",
                "Using floating-point arithmetic which causes rounding errors",
                "Confusing KSHS with KSHS (they are the same currency)"
            ],
            tools: {
                xnoToRaw: "KakituConverter.xnoToRaw('0.1') => '100000000000000000000000000000'",
                rawToXNO: "KakituConverter.rawToXNO('100000000000000000000000000000') => '0.1'",
                isValidKakituAddress: "KakituConverter.isValidKakituAddress('kshs_3xxx...') => true",
                formatXNO: "KakituConverter.formatXNO('0.123456789', 6) => '0.123457'"
            },
            bestPractices: [
                "Always use string-based BigInt arithmetic for conversions",
                "Never use floating-point math for currency calculations",
                "Validate addresses before transactions",
                "Use formatXNO for display purposes only, not for calculations",
                "Store amounts in raw format for precision"
            ]
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
        } catch (error) {
            console.error('[KakituConverter] Error validating raw amount:', error);
            return false;
        }
    }

    /**
     * Format balance for display with both raw and KSHS
     * @param {string} rawAmount - Amount in raw
     * @returns {Object} Formatted balance
     */
    static formatBalance(rawAmount) {
        try {
            const kshs = this.rawToXNO(rawAmount);
            return {
                raw: rawAmount,
                kshs: kshs,
                formatted: this.formatXNO(kshs, 6),
                display: `${this.formatXNO(kshs, 6)} KSHS`
            };
        } catch (error) {
            console.error('[KakituConverter] Error formatting balance:', error);
            throw new Error(`Invalid raw amount for formatting: ${rawAmount}. ${error.message}`);
        }
    }
}

module.exports = { KakituConverter };

