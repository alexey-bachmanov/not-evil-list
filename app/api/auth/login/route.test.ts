/**
 * @jest-environment node
 */
import { POST } from './route';
import { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import jwt, { JwtPayload } from 'jsonwebtoken';
import parseBody from '@/lib/parseBody';
import { createRequest } from 'node-mocks-http';
import {
  openDatabase,
  closeDatabase,
  primeDatabase,
} from '@/test-utils/mongoMemoryUtils';
import mocks from '@/test-utils/mockDbEntries';

// mock the dependencies
jest.mock('@/lib/dbConnect');
jest.mock('@/lib/parseBody');

describe('/api/auth/login', () => {
  beforeEach(async () => {
    await openDatabase();
    await primeDatabase();
  });

  afterEach(async () => {
    await closeDatabase();
    jest.resetAllMocks();
  });

  test('should return jwt and user data for valid credentials', async () => {
    // create request to test
    const req = createRequest({ method: 'POST', url: '/api/auth/login' });
    const loginData = {
      email: mocks.user.email,
      password: mocks.user.password,
    };

    // mock dependencies' behavior
    (dbConnect as jest.Mock).mockResolvedValueOnce(null);
    (parseBody as jest.Mock).mockResolvedValueOnce(loginData);

    // get our response from the handler
    const response = await POST(req as unknown as NextRequest);

    // extract jwt cookie
    const cookie = response.cookies.get('jwt');
    const cookiePayload = jwt.decode(cookie!.value);

    expect(response.status).toBe(200);
    const responseBody = await response.json();
    // expect response to contain info about logged in user
    expect(responseBody.data?.user?.userName).toBe(mocks.user.userName);
    expect(responseBody.data?.user?.email).toBe(mocks.user.email);
    expect(responseBody.data?.user?.role).toBe(mocks.user.role);
    // expect cookie to exist and be an http-only cookie
    expect(cookie).toBeTruthy();
    expect(cookie?.httpOnly).toBe(true);
    // expect the cookie payload to be an object containing the user id
    expect(typeof cookiePayload).toBe('object');
    expect((cookiePayload as JwtPayload).id).toBe(responseBody.data?.user?._id);
  });

  test('should return 401 error for invalid credentials', async () => {
    // create request to test
    const req = createRequest({ method: 'POST', url: '/api/auth/login' });
    const loginData = {
      email: mocks.user.email,
      password: 'wrongPassword',
    };

    // mock dependencies' behavior
    (dbConnect as jest.Mock).mockResolvedValueOnce(null);
    (parseBody as jest.Mock).mockResolvedValueOnce(loginData);

    // get our response from the handler
    const response = await POST(req as unknown as NextRequest);

    // extract jwt cookie
    const cookie = response.cookies.get('jwt');

    expect(response.status).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Incorrect email or password');
    // expect cookie to not exist
    expect(cookie).toBe(undefined);
  });

  test('should return 401 error for missing username or password', async () => {
    // create request to test
    const req = createRequest({ method: 'POST', url: '/api/auth/login' });
    const loginData = { email: mocks.user.email };

    // mock dependencies' behavior
    (dbConnect as jest.Mock).mockResolvedValueOnce(null);
    (parseBody as jest.Mock).mockResolvedValueOnce(loginData);

    // get our response from the handler
    const response = await POST(req as unknown as NextRequest);

    // extract jwt cookie
    const cookie = response.cookies.get('jwt');

    expect(response.status).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('No credentials provided');
    // expect cookie to not exist
    expect(cookie).toBe(undefined);
  });

  test('should return 500 error for failed DB connection', async () => {
    // disable console from printing errors
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // make sure database is closed
    await closeDatabase();

    // create request to test
    const req = createRequest({ method: 'POST', url: '/api/auth/login' });

    // mock dependencies' behavior
    (dbConnect as jest.Mock).mockRejectedValueOnce(
      new Error('Failed DB connection')
    );

    // get our response from the handler
    const response = await POST(req as unknown as NextRequest);

    expect(response.status).toBe(500);
  });
});
