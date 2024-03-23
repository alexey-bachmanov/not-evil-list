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
import { GET, PUT, DELETE } from './route';
import dbConnect from '@/lib/dbConnect';
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
import authCheck from '@/lib/authCheck';

// Mock the dependencies
jest.mock('@/lib/dbConnect');
jest.mock('@/lib/queryStringToMongoFilter');
jest.mock('@/lib/parseBody');
jest.mock('@/lib/addressToGeoData');
jest.mock('@/lib/authCheck');

describe('/api/businesses/[id]', () => {
  beforeEach(async () => {
    await openDatabase();
  });

  afterEach(async () => {
    await closeDatabase();
    jest.resetAllMocks();
  });

  describe('GET', () => {
    test('returns business details on successful query', async () => {
      // seed database with example businesses
      (addressToGeoData as jest.Mock).mockResolvedValue(mocks.geoDataSuccess);
      await primeDatabase();

      // get valid business from database
      const actualBusiness = await Business.findOne({});
      const businessId = actualBusiness._id;

      // create request to test
      const req = createRequest({
        method: 'GET',
        url: `/api/businesses/${businessId}`,
      });

      // Mock dependencies' behavior
      (dbConnect as jest.Mock).mockResolvedValueOnce(null);

      // get our response from the handler
      const response = await GET(req as unknown as NextRequest);

      // expect response to be a success
      expect(response.status).toBe(200);
      const responseBody = await response.json();
      expect(responseBody.success).toBe(true);
      // expect it to return the correct business
      expect(responseBody.data?.business?.companyName).toBe(
        actualBusiness.companyName
      );
      // expect the reviews to be to be populated
      expect(responseBody.data?.business?.reviews.length).toBeGreaterThan(0);
    });

    test('throws 400 error on invalid business ID', async () => {
      // seed database with example businesses
      (addressToGeoData as jest.Mock).mockResolvedValue(mocks.geoDataSuccess);
      await primeDatabase();

      // create request to test
      const req = createRequest({
        method: 'GET',
        url: `/api/businesses/gggg`,
      });

      // Mock dependencies' behavior
      (dbConnect as jest.Mock).mockResolvedValueOnce(null);

      // get our response from the handler
      const response = await GET(req as unknown as NextRequest);

      // expect response to be a success
      expect(response.status).toBe(400);
    });

    test('throws 404 error when business does not exist', async () => {
      // seed database with example businesses
      (addressToGeoData as jest.Mock).mockResolvedValue(mocks.geoDataSuccess);
      await primeDatabase();

      // get valid business from database
      const actualBusiness = await Business.findOne({});
      const businessId = actualBusiness._id;

      // delete the business before we make our request
      await Business.findByIdAndDelete(businessId);

      // create request to test
      const req = createRequest({
        method: 'GET',
        url: `/api/businesses/${businessId}`,
      });

      // Mock dependencies' behavior
      (dbConnect as jest.Mock).mockResolvedValueOnce(null);

      // get our response from the handler
      const response = await GET(req as unknown as NextRequest);

      // expect response to be a success
      expect(response.status).toBe(404);
    });

    test('throws a 500 error on failed DB connection', async () => {
      // disable console from printing errors
      jest.spyOn(console, 'error').mockImplementation(() => {});

      // make sure the db is shut down
      await closeDatabase();

      // create request to test
      const req = createRequest({
        method: 'GET',
        url: '/api/businesses/65fb381dfc60e60000000000',
      });

      // Mock dependencies' behavior
      (dbConnect as jest.Mock).mockRejectedValueOnce(
        new Error('Failed DB connection')
      );

      // get our response from the handler
      const response = await GET(req as unknown as NextRequest);

      expect(response.status).toBe(500);
    });
  });

  describe('PUT', () => {
    test('updates business on successful request', async () => {
      // seed database with example businesses
      (addressToGeoData as jest.Mock).mockResolvedValue(mocks.geoDataSuccess);
      await primeDatabase();

      // get valid business from database
      const originalBusiness = await Business.findOne({});
      const businessId = originalBusiness._id;

      // create request to test - this mimics the form we submit to update the business
      const mockUpdate = {
        companyName: 'New Company Name',
        address: originalBusiness.address,
        addressCity: originalBusiness.addressCity,
        addressState: originalBusiness.addressState,
        phone: originalBusiness.phone,
        website: originalBusiness.website,
        description: originalBusiness.description,
        tags: originalBusiness.tags,
      };
      const req = createRequest({
        method: 'PUT',
        url: `/api/businesses/${businessId}`,
      });

      // Mock dependencies' behavior
      (dbConnect as jest.Mock).mockResolvedValueOnce(null);
      (parseBody as jest.Mock).mockResolvedValueOnce(mockUpdate);
      (addressToGeoData as jest.Mock).mockResolvedValueOnce(
        mocks.geoDataSuccess
      );
      (authCheck as jest.Mock).mockReturnValueOnce({
        isUser: true,
        isAdmin: true,
        userId: null,
      });

      // get our response from the handler
      const response = await PUT(req as unknown as NextRequest);

      // expect our response to return the updated business
      expect(response.status).toBe(200);
      const updatedBusiness = (await response.json()).data?.business;

      // expect fields in updated business document to be correct
      expect(updatedBusiness.companyName).toBe(mockUpdate.companyName);
      expect(updatedBusiness.address).toBe(mocks.geoDataSuccess.name);
      expect(updatedBusiness.addressCity).toBe(mocks.geoDataSuccess.locality);
      expect(updatedBusiness.addressState).toBe(
        mocks.geoDataSuccess.region_code
      );
      expect(updatedBusiness.addressZip).toBe(mocks.geoDataSuccess.postal_code);
      expect(updatedBusiness.phone).toBe(mockUpdate.phone);
      expect(updatedBusiness.website).toBe(mockUpdate.website);
      expect(updatedBusiness.description).toBe(mockUpdate.description);
      expect(updatedBusiness.isVerified).toBe(false);
      expect(updatedBusiness.location.coordinates[0]).toBe(
        mocks.geoDataSuccess.longitude
      );
      expect(updatedBusiness.location.coordinates[1]).toBe(
        mocks.geoDataSuccess.latitude
      );
      expect(updatedBusiness.tags).toEqual(mockUpdate.tags);

      // expect updated business to be in the database
      const dbBusiness = await Business.findById(businessId);
      expect(dbBusiness.companyName).toBe(mockUpdate.companyName);
    });

    test('throws 400 error when body is not included', async () => {
      // seed database with example businesses
      (addressToGeoData as jest.Mock).mockResolvedValue(mocks.geoDataSuccess);
      await primeDatabase();

      // get valid business from database
      const originalBusiness = await Business.findOne({});
      const businessId = originalBusiness._id;

      // create request to test
      const req = createRequest({
        method: 'PUT',
        url: `/api/businesses/${businessId}`,
      });

      // Mock dependencies' behavior
      (dbConnect as jest.Mock).mockResolvedValueOnce(null);
      (parseBody as jest.Mock).mockResolvedValueOnce(null);

      // get our response from the handler
      const response = await PUT(req as unknown as NextRequest);

      // expect our response to return the updated business
      expect(response.status).toBe(400);
    });

    test('throws 400 error on invalid business ID', async () => {
      // seed database with example businesses
      (addressToGeoData as jest.Mock).mockResolvedValue(mocks.geoDataSuccess);
      await primeDatabase();

      // get valid business from database
      const originalBusiness = await Business.findOne({});

      // create request to test - this mimics the form we submit to update the business
      const mockUpdate = {
        companyName: 'New Company Name',
        address: originalBusiness.address,
        addressCity: originalBusiness.addressCity,
        addressState: originalBusiness.addressState,
        phone: originalBusiness.phone,
        website: originalBusiness.website,
        description: originalBusiness.description,
        tags: originalBusiness.tags,
      };
      const req = createRequest({
        method: 'PUT',
        url: `/api/businesses/gggg`,
      });

      // Mock dependencies' behavior
      (dbConnect as jest.Mock).mockResolvedValueOnce(null);
      (parseBody as jest.Mock).mockResolvedValueOnce(mockUpdate);
      (addressToGeoData as jest.Mock).mockResolvedValueOnce(
        mocks.geoDataSuccess
      );
      (authCheck as jest.Mock).mockReturnValueOnce({
        isUser: true,
        isAdmin: true,
        userId: null,
      });

      // get our response from the handler
      const response = await PUT(req as unknown as NextRequest);

      // expect our response to return error
      expect(response.status).toBe(400);
    });

    test('throws 401 error when attempted by guest', async () => {
      // seed database with example businesses
      (addressToGeoData as jest.Mock).mockResolvedValue(mocks.geoDataSuccess);
      await primeDatabase();

      // get valid business from database
      const originalBusiness = await Business.findOne({});
      const businessId = originalBusiness._id;

      // create request to test - this mimics the form we submit to update the business
      const mockUpdate = {
        companyName: 'New Company Name',
        address: originalBusiness.address,
        addressCity: originalBusiness.addressCity,
        addressState: originalBusiness.addressState,
        phone: originalBusiness.phone,
        website: originalBusiness.website,
        description: originalBusiness.description,
        tags: originalBusiness.tags,
      };
      const req = createRequest({
        method: 'PUT',
        url: `/api/businesses/${businessId}`,
      });

      // Mock dependencies' behavior
      (dbConnect as jest.Mock).mockResolvedValueOnce(null);
      (parseBody as jest.Mock).mockResolvedValueOnce(mockUpdate);
      (addressToGeoData as jest.Mock).mockResolvedValueOnce(
        mocks.geoDataSuccess
      );
      (authCheck as jest.Mock).mockReturnValueOnce({
        isUser: false,
        isAdmin: false,
        userId: null,
      });

      // get our response from the handler
      const response = await PUT(req as unknown as NextRequest);

      // expect our response to return error
      expect(response.status).toBe(401);
    });

    test('throws 403 error when attempted by non-admin', async () => {
      // seed database with example businesses
      (addressToGeoData as jest.Mock).mockResolvedValue(mocks.geoDataSuccess);
      await primeDatabase();

      // get valid business from database
      const originalBusiness = await Business.findOne({});
      const businessId = originalBusiness._id;

      // create request to test - this mimics the form we submit to update the business
      const mockUpdate = {
        companyName: 'New Company Name',
        address: originalBusiness.address,
        addressCity: originalBusiness.addressCity,
        addressState: originalBusiness.addressState,
        phone: originalBusiness.phone,
        website: originalBusiness.website,
        description: originalBusiness.description,
        tags: originalBusiness.tags,
      };
      const req = createRequest({
        method: 'PUT',
        url: `/api/businesses/${businessId}`,
      });

      // Mock dependencies' behavior
      (dbConnect as jest.Mock).mockResolvedValueOnce(null);
      (parseBody as jest.Mock).mockResolvedValueOnce(mockUpdate);
      (addressToGeoData as jest.Mock).mockResolvedValueOnce(
        mocks.geoDataSuccess
      );
      (authCheck as jest.Mock).mockReturnValueOnce({
        isUser: true,
        isAdmin: false,
        userId: null,
      });

      // get our response from the handler
      const response = await PUT(req as unknown as NextRequest);

      // expect our response to return error
      expect(response.status).toBe(403);
    });

    test('throws 404 error when business does not exist', async () => {
      // seed database with example businesses
      (addressToGeoData as jest.Mock).mockResolvedValue(mocks.geoDataSuccess);
      await primeDatabase();

      // get valid business from database
      const originalBusiness = await Business.findOne({});
      const businessId = originalBusiness._id;

      // delete the business before we make our request
      await Business.findByIdAndDelete(businessId);

      // create request to test - this mimics the form we submit to update the business
      const mockUpdate = {
        companyName: 'New Company Name',
        address: originalBusiness.address,
        addressCity: originalBusiness.addressCity,
        addressState: originalBusiness.addressState,
        phone: originalBusiness.phone,
        website: originalBusiness.website,
        description: originalBusiness.description,
        tags: originalBusiness.tags,
      };
      const req = createRequest({
        method: 'PUT',
        url: `/api/businesses/${businessId}`,
      });

      // Mock dependencies' behavior
      (dbConnect as jest.Mock).mockResolvedValueOnce(null);
      (parseBody as jest.Mock).mockResolvedValueOnce(mockUpdate);
      (addressToGeoData as jest.Mock).mockResolvedValueOnce(
        mocks.geoDataSuccess
      );
      (authCheck as jest.Mock).mockReturnValueOnce({
        isUser: true,
        isAdmin: true,
        userId: null,
      });

      // get our response from the handler
      const response = await PUT(req as unknown as NextRequest);

      // expect our response to return error
      expect(response.status).toBe(404);
    });

    test('throws a 500 error on failed DB connection', async () => {
      // disable console from printing errors
      jest.spyOn(console, 'error').mockImplementation(() => {});

      // make sure the db is shut down
      await closeDatabase();

      // create request to test
      const req = createRequest({
        method: 'PUT',
        url: '/api/businesses/65fb381dfc60e60000000000',
      });

      // Mock dependencies' behavior
      (dbConnect as jest.Mock).mockRejectedValueOnce(
        new Error('Failed DB connection')
      );

      // get our response from the handler
      const response = await PUT(req as unknown as NextRequest);

      expect(response.status).toBe(500);
    });
  });

  describe('DELETE', () => {
    test('deletes business on successful request', async () => {
      // seed database with example businesses
      (addressToGeoData as jest.Mock).mockResolvedValue(mocks.geoDataSuccess);
      await primeDatabase();

      // get valid business from database
      const actualBusiness = await Business.findOne({});
      const businessId = actualBusiness._id;

      // create request to test
      const req = createRequest({
        method: 'DELETE',
        url: `/api/businesses/${businessId}`,
      });

      // Mock dependencies' behavior
      (dbConnect as jest.Mock).mockResolvedValueOnce(null);
      (authCheck as jest.Mock).mockReturnValueOnce({
        isUser: true,
        isAdmin: true,
        userId: null,
      });

      // get our response from the handler
      const response = await DELETE(req as unknown as NextRequest);

      // expect our response to return null data
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ success: true, data: null });

      // expect business to be missing from the database
      const dbBusiness = await Business.findById(businessId);
      expect(dbBusiness).toBe(null);
    });

    test('throws 400 error on invalid business ID', async () => {
      // seed database with example businesses
      (addressToGeoData as jest.Mock).mockResolvedValue(mocks.geoDataSuccess);
      await primeDatabase();

      // create request to test
      const req = createRequest({
        method: 'DELETE',
        url: `/api/businesses/gggg`,
      });

      // Mock dependencies' behavior
      (dbConnect as jest.Mock).mockResolvedValueOnce(null);
      (authCheck as jest.Mock).mockReturnValueOnce({
        isUser: true,
        isAdmin: true,
        userId: null,
      });

      // get our response from the handler
      const response = await DELETE(req as unknown as NextRequest);

      // expect our response to return error
      expect(response.status).toBe(400);
    });

    test('throws 401 error when attempted by guest', async () => {
      // seed database with example businesses
      (addressToGeoData as jest.Mock).mockResolvedValue(mocks.geoDataSuccess);
      await primeDatabase();

      // get valid business from database
      const actualBusiness = await Business.findOne({});
      const businessId = actualBusiness._id;

      // create request to test
      const req = createRequest({
        method: 'DELETE',
        url: `/api/businesses/${businessId}`,
      });

      // Mock dependencies' behavior
      (dbConnect as jest.Mock).mockResolvedValueOnce(null);
      (authCheck as jest.Mock).mockReturnValueOnce({
        isUser: false,
        isAdmin: false,
        userId: null,
      });

      // get our response from the handler
      const response = await DELETE(req as unknown as NextRequest);

      // expect our response to return error
      expect(response.status).toBe(401);
    });

    test('throws 403 error when attempted by non-admin', async () => {
      // seed database with example businesses
      (addressToGeoData as jest.Mock).mockResolvedValue(mocks.geoDataSuccess);
      await primeDatabase();

      // get valid business from database
      const actualBusiness = await Business.findOne({});
      const businessId = actualBusiness._id;

      // create request to test
      const req = createRequest({
        method: 'DELETE',
        url: `/api/businesses/${businessId}`,
      });

      // Mock dependencies' behavior
      (dbConnect as jest.Mock).mockResolvedValueOnce(null);
      (authCheck as jest.Mock).mockReturnValueOnce({
        isUser: true,
        isAdmin: false,
        userId: null,
      });

      // get our response from the handler
      const response = await DELETE(req as unknown as NextRequest);

      // expect our response to return error
      expect(response.status).toBe(403);
    });

    test('throws 404 error if business does not exist', async () => {
      // seed database with example businesses
      (addressToGeoData as jest.Mock).mockResolvedValue(mocks.geoDataSuccess);
      await primeDatabase();

      // get valid business from database
      const actualBusiness = await Business.findOne({});
      const businessId = actualBusiness._id;

      // delete the business before we make our request
      await Business.findByIdAndDelete(businessId);

      // create request to test
      const req = createRequest({
        method: 'DELETE',
        url: `/api/businesses/${businessId}`,
      });

      // Mock dependencies' behavior
      (dbConnect as jest.Mock).mockResolvedValueOnce(null);
      (authCheck as jest.Mock).mockReturnValueOnce({
        isUser: true,
        isAdmin: true,
        userId: null,
      });

      // get our response from the handler
      const response = await DELETE(req as unknown as NextRequest);

      // expect our response to return error
      expect(response.status).toBe(404);
    });

    test('throws a 500 error on failed DB connection', async () => {
      // disable console from printing errors
      jest.spyOn(console, 'error').mockImplementation(() => {});

      // make sure the db is shut down
      await closeDatabase();

      // create request to test
      const req = createRequest({
        method: 'DELETE',
        url: '/api/businesses/65fb381dfc60e60000000000',
      });

      // Mock dependencies' behavior
      (dbConnect as jest.Mock).mockRejectedValueOnce(
        new Error('Failed DB connection')
      );

      // get our response from the handler
      const response = await DELETE(req as unknown as NextRequest);

      expect(response.status).toBe(500);
    });
  });
});
