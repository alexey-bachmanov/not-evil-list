import queryToQueryParams from './queryToQueryParams';

describe('queryToQueryParams', () => {
  test('should return an empty string for an empty input', () => {
    const input = '';
    const expected = '';
    const result = queryToQueryParams(input);
    expect(result).toBe(expected);
  });

  test('should return an empty string for a spaces-only input', () => {
    const input = '    ';
    const expected = '';
    const result = queryToQueryParams(input);
    expect(result).toBe(expected);
  });

  test('should return a query string with search words', () => {
    const input = 'restaurants near me';
    const expected = '?search=restaurants+near+me';
    const result = queryToQueryParams(input);
    expect(result).toBe(expected);
  });

  test('should return a query string with flag words', () => {
    const input = '-unverified';
    const expected = '?flags=unverified';
    const result = queryToQueryParams(input);
    expect(result).toBe(expected);
  });

  test('should return a query string with search and flag words', () => {
    const input = 'restaurants near me -unverified';
    const expected = '?search=restaurants+near+me&flags=unverified';
    const result = queryToQueryParams(input);
    expect(result).toBe(expected);
  });

  test('should handle leading, trailing, and mid-query spaces', () => {
    const input = '  restaurants near me  -unverified  ';
    const expected = '?search=restaurants+near+me&flags=unverified';
    const result = queryToQueryParams(input);
    expect(result).toBe(expected);
  });

  test('should handle multiple flag words', () => {
    const input = 'restaurants -unverified -new';
    const expected = '?search=restaurants&flags=unverified+new';
    const result = queryToQueryParams(input);
    expect(result).toBe(expected);
  });

  test('should handle two-word tags (eg food truck)', () => {
    const input = 'food truck';
    const expected = '?search=food+truck';
    const result = queryToQueryParams(input);
    expect(result).toBe(expected);
  });
});
