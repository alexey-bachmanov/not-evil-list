import axios from 'axios';
import addressToGeoData from './addressToGeoData';
import mocks from '@/test-utils/mockDbEntries';

// Mock the axios module
jest.mock('axios');
const mockAxiosGet = axios.get as jest.MockedFunction<typeof axios.get>;

const mockApiKey = 'YOUR_POSITIONSTACK_API_KEY';

describe('addressToGeoData', () => {
  beforeEach(() => {
    process.env.POSITIONSTACK_API_KEY = mockApiKey;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns geo data on successful API response', async () => {
    // Mock a successful API response
    mockAxiosGet.mockResolvedValueOnce({
      data: { data: [mocks.geoDataSuccess] },
    });

    const result = await addressToGeoData(
      mocks.business1.address,
      mocks.business1.addressCity,
      mocks.business1.addressState
    );

    expect(result).toEqual(mocks.geoDataSuccess);
    expect(axios.get).toHaveBeenCalledWith(
      `http://api.positionstack.com/v1/forward?access_key=${mockApiKey}&query=${mocks.business1.address}, ${mocks.business1.addressCity} ${mocks.business1.addressState}`
    );
  });

  test('throws ApiError on API error response', async () => {
    // Mock an API error response
    mockAxiosGet.mockRejectedValueOnce({
      data: { data: mocks.geoDataFail },
    });

    await expect(
      addressToGeoData(
        mocks.business1.address,
        mocks.business1.addressCity,
        mocks.business1.addressState
      )
    ).rejects.toThrow('GeoLocation API failed to return data');
    expect(axios.get).toHaveBeenCalledWith(
      `http://api.positionstack.com/v1/forward?access_key=${mockApiKey}&query=${mocks.business1.address}, ${mocks.business1.addressCity} ${mocks.business1.addressState}`
    );
  });
});
