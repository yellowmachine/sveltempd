import { describe, it, expect } from 'vitest';
import { formatTime, correctVolume } from './utils';

describe('formatTime', () => {
  it('returns empty string for undefined', () => {
    expect(formatTime(undefined)).toBe('');
  });

  it('returns empty string for 0', () => {
    expect(formatTime(0)).toBe('');
  });

  it('formats single-digit seconds', () => {
    expect(formatTime(7)).toBe('0:07');
  });

  it('formats under a minute', () => {
    expect(formatTime(42)).toBe('0:42');
  });

  it('formats minutes and seconds', () => {
    expect(formatTime(125)).toBe('2:05');
    expect(formatTime(3599)).toBe('59:59');
  });

  it('rounds down seconds', () => {
    expect(formatTime(125.9)).toBe('2:05');
  });
});

describe('correctVolume', () => {
  it('returns 0 for negative values', () => {
    expect(correctVolume(-10)).toBe(0);
  });

  it('returns 100 for values over 100', () => {
    expect(correctVolume(150)).toBe(100);
    expect(correctVolume(101)).toBe(100);
  });

  it('returns rounded value for values between 0 and 100', () => {
    expect(correctVolume(50)).toBe(50); 
    expect(correctVolume(75.4)).toBe(75);
  });

  it('returns 0 for 0', () => {
    expect(correctVolume(0)).toBe(0);
  });

  it('returns 100 for 100', () => {
    expect(correctVolume(100)).toBe(100); 
  });
});
