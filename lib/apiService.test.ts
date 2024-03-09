import axios from 'axios';
import ApiService from './apiService';
import { AppApiRequest, AppApiResponse } from '@/types';
import { ObjectId } from 'mongoose';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ApiService', () => {
  let apiService: ApiService;

  beforeEach(() => {
    apiService = new ApiService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  ///// BUSINESSES /////
  describe('Businesses', () => {
    const mockBusinesses: any[] = [
      { _id: 1, name: 'Business 1' },
      { _id: 2, name: 'Business 2' },
    ];
    const id: ObjectId = '1' as unknown as ObjectId;
    const mockBusiness = mockBusinesses[0];
    const mockError: AppApiResponse['fail'] = {
      success: false,
      message: 'Failed to do the thing',
    };

    describe('getAll', () => {
      test('should fetch businesses successfully', async () => {
        const mockResponse: AppApiResponse['getBusinessList'] = {
          success: true,
          data: { businesses: mockBusinesses },
        };
        mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

        const businesses = await apiService.businesses.getAll();

        expect(axios.get).toHaveBeenCalledWith('/api/businesses');
        expect(businesses).toEqual(mockBusinesses);
      });

      test('should throw an error on failure', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: mockError });

        await expect(apiService.businesses.getAll()).rejects.toThrow(
          mockError.message
        );
      });
    });

    describe('get', () => {
      test('should fetch business details successfully', async () => {
        const mockResponse: AppApiResponse['getBusinessDetails'] = {
          success: true,
          data: { business: mockBusiness },
        };
        mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

        const business = await apiService.businesses.get(id);

        expect(axios.get).toHaveBeenCalledWith('/api/businesses/1');
        expect(business).toEqual(mockBusiness);
      });

      test('should throw an error on failure', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: mockError });

        await expect(apiService.businesses.get(id)).rejects.toThrow(
          mockError.message
        );
      });
    });

    describe('post', () => {
      test('should post business successfully', async () => {
        const mockResponse: AppApiResponse['postNewBusiness'] = {
          success: true,
          data: { business: mockBusiness },
        };
        mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

        const business = await apiService.businesses.post(mockBusiness);

        expect(axios.post).toHaveBeenCalledWith(
          '/api/businesses',
          mockBusiness,
          { headers: { 'Content-Type': 'application/json' } }
        );
        expect(business).toEqual(mockBusiness);
      });

      test('should throw an error on failure', async () => {
        mockedAxios.post.mockResolvedValueOnce({ data: mockError });

        await expect(apiService.businesses.post(mockBusiness)).rejects.toThrow(
          mockError.message
        );
      });
    });

    describe('put', () => {
      test('should edit business details successfully', async () => {
        const mockResponse: AppApiResponse['editBusiness'] = {
          success: true,
          data: { business: mockBusiness },
        };
        mockedAxios.put.mockResolvedValueOnce({ data: mockResponse });

        const business = await apiService.businesses.put(id, mockBusiness);

        expect(axios.put).toHaveBeenCalledWith(
          '/api/businesses/1',
          mockBusiness,
          { headers: { 'Content-Type': 'application/json' } }
        );
        expect(business).toEqual(mockBusiness);
      });

      test('should throw an error on failure', async () => {
        mockedAxios.put.mockResolvedValueOnce({ data: mockError });

        await expect(
          apiService.businesses.put(id, mockBusiness)
        ).rejects.toThrow(mockError.message);
      });
    });

    describe('delete', () => {
      test('should delete business successfully', async () => {
        const mockResponse: AppApiResponse['deleteBusiness'] = {
          success: true,
          data: null,
        };
        mockedAxios.delete.mockResolvedValueOnce({ data: mockResponse });

        const business = await apiService.businesses.delete(id);

        expect(axios.delete).toHaveBeenCalledWith('/api/businesses/1');
        expect(business).toBeNull();
      });

      test('should throw an error on failure', async () => {
        mockedAxios.delete.mockResolvedValueOnce({ data: mockError });

        await expect(apiService.businesses.delete(id)).rejects.toThrow(
          mockError.message
        );
      });
    });

    // Add tests for other Businesses methods (post, put, delete)
  });

  ///// USERS /////
  // nothing here yet

  ///// AUTH /////
  describe('Auth', () => {
    const mockUser = {
      _id: '1',
      userName: 'John Doe',
      email: 'john@website.com',
      role: 'user',
    };
    const mockAuthData = {
      userName: 'John Doe',
      email: 'john@website.com',
      password: 'password',
      passwordConfirm: 'password',
    };
    const mockError = { success: false, message: 'Invalid credentials' };

    describe('login', () => {
      test('should login successfully', async () => {
        const mockResponse: AppApiResponse['login'] = {
          success: true,
          data: { user: mockUser },
        };
        mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

        const user = await apiService.auth.login(mockAuthData);

        expect(axios.post).toHaveBeenCalledWith(
          '/api/auth/login',
          mockAuthData,
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
        expect(user).toEqual(mockUser);
      });

      test('should throw an error on failure', async () => {
        mockedAxios.post.mockResolvedValueOnce({ data: mockError });

        await expect(apiService.auth.login(mockAuthData)).rejects.toThrow(
          mockError.message
        );
      });
    });

    describe('logout', () => {
      test('should logout successfully', async () => {
        const mockResponse: AppApiResponse['logout'] = { success: true };
        mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

        const user = await apiService.auth.logout();

        expect(axios.post).toHaveBeenCalledWith(
          '/api/auth/logout',
          {},
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
        expect(user).toBeNull();
      });

      test('should throw an error on failure', async () => {
        mockedAxios.post.mockResolvedValueOnce({ data: mockError });

        await expect(apiService.auth.logout()).rejects.toThrow(
          mockError.message
        );
      });
    });

    describe('signup', () => {
      test('should signup successfully', async () => {
        const mockResponse: AppApiResponse['signup'] = {
          success: true,
          data: { user: mockUser },
        };
        mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

        const user = await apiService.auth.signup(mockAuthData);

        expect(axios.post).toHaveBeenCalledWith(
          '/api/auth/signup',
          mockAuthData,
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
        expect(user).toEqual(mockUser);
      });

      test('should throw an error on failure', async () => {
        mockedAxios.post.mockResolvedValueOnce({ data: mockError });

        await expect(apiService.auth.signup(mockAuthData)).rejects.toThrow(
          mockError.message
        );
      });
    });

    // Add tests for other Auth methods (logout, signup)
  });

  ///// REVIEWS /////
  // nothing here yet
});
