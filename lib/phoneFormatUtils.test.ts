import {
  formatPhoneNumber,
  unformatPhoneNumber,
  isValidPhoneNumber,
} from './phoneFormatUtils';

describe('formatPhoneNumber', () => {
  test('formats a 10-digit number', () => {
    const result = formatPhoneNumber('5555555555');
    expect(result).toBe('+1 (555) 555-5555');
  });

  test('formats an 11-digit number', () => {
    const result = formatPhoneNumber('15555555555');
    expect(result).toBe('+1 (555) 555-5555');
  });

  test('returns undefined for undefined input', () => {
    const result = formatPhoneNumber(undefined);
    expect(result).toBeUndefined();
  });

  test('returns undefined for a number shorter than 10 digits', () => {
    const result = formatPhoneNumber('123');
    expect(result).toBeUndefined();
  });
});

describe('unformatPhoneNumber', () => {
  test('unformats a formatted number', () => {
    const result = unformatPhoneNumber('+1 (555) 555-5555');
    expect(result).toBe('15555555555');
  });

  test('returns input for an already unformatted number', () => {
    const result = unformatPhoneNumber('1234567890');
    expect(result).toBe('1234567890');
  });
});

describe('isValidPhoneNumber', () => {
  test('returns true for a valid number', () => {
    const result = isValidPhoneNumber('5555555555');
    expect(result).toBe(true);
  });

  test('returns false for an undefined input', () => {
    const result = isValidPhoneNumber(undefined);
    expect(result).toBe(false);
  });

  test('returns false for an invalid number', () => {
    const result = isValidPhoneNumber('invalid-number');
    expect(result).toBe(false);
  });
});
