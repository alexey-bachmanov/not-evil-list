import fetchData from './fetchData';

// Mock the global fetch function
global.fetch = jest.fn();
// let typescript know that global.fetch will be a mocked function
const mockedFetch = fetch as jest.MockedFunction<any>;

describe('fetchData', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch data successfully with no body', async () => {
    const mockResponse = { data: 'success' };
    const mockFetchPromise = Promise.resolve({
      json: () => Promise.resolve(mockResponse),
    });
    mockedFetch.mockReturnValue(mockFetchPromise);

    const url = 'https://example.com/api';
    const response = await fetchData<undefined, typeof mockResponse>(url);

    expect(fetch).toHaveBeenCalledWith(url, {});
    expect(response).toEqual(mockResponse);
  });

  it('should fetch data successfully with a body', async () => {
    const mockRequestBody = { value: 'test' };
    const mockResponse = { data: 'success' };
    const mockFetchPromise = Promise.resolve({
      json: () => Promise.resolve(mockResponse),
    });
    mockedFetch.mockReturnValue(mockFetchPromise);

    const url = 'https://example.com/api';
    const options = { headers: { 'Content-Type': 'application/json' } };
    const response = await fetchData<
      typeof mockRequestBody,
      typeof mockResponse
    >(url, mockRequestBody, options);

    expect(fetch).toHaveBeenCalledWith(url, {
      body: JSON.stringify(mockRequestBody),
      headers: { 'Content-Type': 'application/json' },
    });
    expect(response).toEqual(mockResponse);
  });

  it('should throw an error if no response is received', async () => {
    const mockFetchPromise = Promise.resolve(null);
    mockedFetch.mockReturnValue(mockFetchPromise);

    const url = 'https://example.com/api';
    await expect(fetchData<undefined, never>(url)).rejects.toThrow(
      `No response recieved from ${url}`
    );
  });

  it('should throw an error if an invalid response is received', async () => {
    const mockFetchPromise = Promise.resolve({
      json: () => Promise.resolve(null),
    });
    mockedFetch.mockReturnValue(mockFetchPromise);

    const url = 'https://example.com/api';
    await expect(fetchData<undefined, never>(url)).rejects.toThrow(
      `Invalid response recieved from ${url}`
    );
  });
});
