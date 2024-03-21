/**
 * @jest-environment node
 */
/**
 * Because of the way the models are set up, it'll be very difficult
 * mock the model.save() method correctly, so unit tests would be a
 * fragile mess
 * Instead, we're going to do integration tests while connecting to
 * our in-memory database. So, we'll be testing everything between the
 * output of the middleware and the input to our database.
 */

import { NextRequest } from 'next/server';
import { GET, POST } from './route';
import dbConnect from '@/lib/dbConnect';
import queryStringToMongoFilter from '@/lib/queryStringToMongoFilter';
import parseBody from '@/lib/parseBody';
import { createRequest } from 'node-mocks-http';
import mocks from '@/test-utils/mockDbEntries';
import {
  openDatabase,
  closeDatabase,
  primeDatabase,
} from '@/test-utils/mongoMemoryUtils';
import { Business } from '@/models';
import addressToGeoData from '@/lib/addressToGeoData';

// Mock the dependencies
jest.mock('@/lib/dbConnect');
jest.mock('@/lib/queryStringToMongoFilter');
jest.mock('@/lib/parseBody');
jest.mock('@/lib/addressToGeoData');

describe('/api/businesses', () => {
  beforeEach(async () => {
    await openDatabase();
  });

  afterEach(async () => {
    await closeDatabase();
    jest.resetAllMocks();
  });

  describe('GET', () => {
    test('returns all businesses on successful query', async () => {
      // seed database with example businesses
      (addressToGeoData as jest.Mock).mockResolvedValue(mocks.geoDataSuccess);
      await primeDatabase();

      // create request to test
      const req = createRequest({ method: 'GET', url: '/api/businesses' });

      // Mock dependencies' behavior
      (dbConnect as jest.Mock).mockResolvedValueOnce(null);
      (queryStringToMongoFilter as jest.Mock).mockResolvedValueOnce({});

      // get our response from the handler
      const response = await GET(req as unknown as NextRequest);

      expect(response.status).toBe(200);
      const responseBody = await response.json();
      expect(responseBody.success).toBe(true);
      expect(responseBody.data?.businesses?.length).toBe(2);
    });

    test('throws 500 error on failed db connection', async () => {
      // disable console from printing errors
      jest.spyOn(console, 'error').mockImplementation(() => {});

      // make sure the db is shut down
      await closeDatabase();

      // create request to test
      const req = createRequest({ method: 'GET', url: '/api/businesses' });

      // Mock dependencies' behavior
      (dbConnect as jest.Mock).mockRejectedValueOnce(
        new Error('Failed DB connection')
      );

      // get our response from the handler
      const response = await GET(req as unknown as NextRequest);

      expect(response.status).toBe(500);
    });
  });

  describe('POST', () => {
    test('creates new business on successful save', async () => {
      // create request to test
      const mockNewBusiness = mocks.business1;
      const req = createRequest({ method: 'POST', url: '/api/businesses' });

      // Mock dependencies' behavior
      (dbConnect as jest.Mock).mockResolvedValueOnce(null);
      (parseBody as jest.Mock).mockResolvedValueOnce(mockNewBusiness);
      (addressToGeoData as jest.Mock).mockResolvedValue(mocks.geoDataSuccess);

      // create business to act as expected result
      const actualBusiness = new Business(mockNewBusiness);

      // get our response from the handler
      const response = await POST(req as unknown as NextRequest);

      // expect our response to return the new business
      expect(response.status).toBe(200);
      const newBusiness = (await response.json()).data?.business;

      // expect fields in new business document to be correct
      expect(newBusiness.companyName).toBe(actualBusiness.companyName);
      expect(newBusiness.address).toBe(mocks.geoDataSuccess.name);
      expect(newBusiness.addressCity).toBe(mocks.geoDataSuccess.locality);
      expect(newBusiness.addressState).toBe(mocks.geoDataSuccess.region_code);
      expect(newBusiness.addressZip).toBe(mocks.geoDataSuccess.postal_code);
      expect(newBusiness.phone).toBe(actualBusiness.phone);
      expect(newBusiness.website).toBe(actualBusiness.website);
      expect(newBusiness.description).toBe(actualBusiness.description);
      expect(newBusiness.isVerified).toBe(false);
      expect(newBusiness.location.coordinates[0]).toBe(
        mocks.geoDataSuccess.longitude
      );
      expect(newBusiness.location.coordinates[1]).toBe(
        mocks.geoDataSuccess.latitude
      );
      expect(newBusiness.tags).toEqual(actualBusiness.tags);

      // expect new business to be in the database
      const dbBusinesses = await Business.find({});
      expect(dbBusinesses.length).toBe(1);
    });

    test('throws 500 error on failed db connection', async () => {
      // disable console from printing errors
      jest.spyOn(console, 'error').mockImplementation(() => {});

      // make sure the db is shut down
      await closeDatabase();

      // create request to test
      const req = createRequest({ method: 'POST', url: '/api/businesses' });

      // Mock dependencies' behavior
      (dbConnect as jest.Mock).mockRejectedValueOnce(
        new Error('Failed DB connection')
      );

      // get our response from the handler
      const response = await POST(req as unknown as NextRequest);

      expect(response.status).toBe(500);
    });

    test('throws 400 error when body is not included', async () => {
      // create request to test
      const req = createRequest({ method: 'POST', url: '/api/businesses' });

      // Mock dependencies' behavior
      (dbConnect as jest.Mock).mockResolvedValueOnce(null);
      (parseBody as jest.Mock).mockResolvedValueOnce(undefined);

      // get our response from the handler
      const response = await POST(req as unknown as NextRequest);

      expect(response.status).toBe(400);
    });

    test('throws 400 error on business validation failure', async () => {
      // create request to test
      const mockNewBusiness: any = mocks.business1;
      delete mockNewBusiness.companyName;
      const req = createRequest({ method: 'POST', url: '/api/businesses' });

      // Mock dependencies' behavior
      (dbConnect as jest.Mock).mockResolvedValueOnce(null);
      (parseBody as jest.Mock).mockResolvedValueOnce(mockNewBusiness);
      (addressToGeoData as jest.Mock).mockResolvedValueOnce(
        mocks.geoDataSuccess
      );

      // get our response from the handler
      const response = await POST(req as unknown as NextRequest);

      expect(response.status).toBe(400);
      expect((await response.json()).message).toBe('Validation failed');
    });
  });
});
