import queryToQueryParams from './queryToQueryParams';

describe('queryToQueryParams', () => {
  it('should return an empty string for an empty input', () => {
    const input = '';
    const expected = '';
    const result = queryToQueryParams(input);
    expect(result).toBe(expected);
  });

  it('should return a query string with search words', () => {
    const input = 'restaurants near me';
    const expected = '?search=restaurants+near+me';
    const result = queryToQueryParams(input);
    expect(result).toBe(expected);
  });

  it('should return a query string with flag words', () => {
    const input = '-unverified';
    const expected = '?flags=unverified';
    const result = queryToQueryParams(input);
    expect(result).toBe(expected);
  });

  it('should return a query string with search and flag words', () => {
    const input = 'restaurants near me -unverified';
    const expected = '?search=restaurants+near+me&flags=unverified';
    const result = queryToQueryParams(input);
    expect(result).toBe(expected);
  });

  it('should handle leading, trailing, and mid-query spaces', () => {
    const input = '  restaurants near me  -unverified  ';
    const expected = '?search=restaurants+near+me&flags=unverified';
    const result = queryToQueryParams(input);
    expect(result).toBe(expected);
  });

  it('should handle multiple flag words', () => {
    const input = 'restaurants -unverified -new';
    const expected = '?search=restaurants&flags=unverified+new';
    const result = queryToQueryParams(input);
    expect(result).toBe(expected);
  });
});
