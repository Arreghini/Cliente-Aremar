// Generated by CodiumAI
const { calculateSquareRoot } = require('./Offers');

describe('calculateSquareRoot', () => {

    // Returns the square root of a positive number
    it('should return the square root of a positive number', () => {
      const result = calculateSquareRoot(9);
      expect(result).toBe(3);
    });

    it('should return undefined for a negative number', () => {
      const result = calculateSquareRoot(-1);
      expect(result).toBeUndefined();
    });

    it('should return 0 for the input 0', () => {
      const result = calculateSquareRoot(0);
      expect(result).toBe(0);
    });

    it('should handle non-integer square roots', () => {
      const result = calculateSquareRoot(2);
      expect(result).toBeCloseTo(Math.sqrt(2));
    });

    // Returns undefined for negative numbers
    it('should return undefined for negative numbers', () => {
      const result = calculateSquareRoot(-1);
      expect(result).toBeUndefined();
    });

    // Returns the correct square root for a large positive floating-point number
    it('should return the square root of a large positive floating-point number', () => {
        const input = 1.44e+16;
        const expectedOutput = 1.2e+8;
        const result = calculateSquareRoot(input);
        expect(result).toBeCloseTo(expectedOutput, 5);
    });

    // Does not return undefined for large positive numbers
    it('should not return undefined for large positive numbers', () => {
      const result = calculateSquareRoot(1000000);
      expect(result).not.toBe(undefined);
      expect(result).toBeCloseTo(1000, 5);
    });

    // Handles very small positive numbers correctly
    it('should return the square root of a very small positive number', () => {
      const result = calculateSquareRoot(0.000001);
      expect(result).toBeCloseTo(0.001);
    });

    // Handles edge case of NaN input
    it('should return undefined when input is negative', () => {
      const result = calculateSquareRoot(-9);
      expect(result).toBeUndefined();
    });

    it('should return NaN when input is not a number', () => {
      const result = calculateSquareRoot(NaN);
      expect(result).toBeNaN();
    });

    it('should return the correct square root for positive numbers', () => {
      const result = calculateSquareRoot(9);
      expect(result).toBe(3);
    });

    it('should return 0 for input 0', () => {
      const result = calculateSquareRoot(0);
      expect(result).toBe(0);
    });

    it('should return NaN when input is a non-numeric string', () => {
      const result = calculateSquareRoot('a');
      expect(result).toBeNaN();
    });

    // Handles edge case of maximum safe integer in JavaScript
    it('should return undefined when input is the maximum safe integer', () => {
        const result = calculateSquareRoot(Number.MAX_SAFE_INTEGER);
        expect(result).toBeUndefined();
    });
});
