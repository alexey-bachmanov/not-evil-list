/**
 * @jest-environment node
 */
import { POST } from './route';
import { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import jwt, { JwtPayload } from 'jsonwebtoken';
import parseBody from '@/lib/parseBody';
import { createRequest } from 'node-mocks-http';
import { openDatabase, closeDatabase } from '@/test-utils/mongoMemoryUtils';
import mocks from '@/test-utils/mockDbEntries';
import { User } from '@/models';

// mock the dependencies
jest.mock('@/lib/dbConnect');
jest.mock('@/lib/parseBody');

describe('api/auth/signup', () => {
  beforeEach(async () => {
    await openDatabase();
  });

  afterEach(async () => {
    await closeDatabase();
    jest.resetAllMocks();
  });

  test('should return user data and add it to DB on valid input', async () => {
    // create request to test
    const req = createRequest({ method: 'POST', url: '/api/auth/signup' });
    const loginData = {
      userName: mocks.user.userName,
      email: mocks.user.email,
      password: mocks.user.password,
      passwordConfirm: mocks.user.passwordConfirm,
    };

    // mock dependencies' behavior
    (dbConnect as jest.Mock).mockResolvedValueOnce(null);
    (parseBody as jest.Mock).mockResolvedValueOnce(loginData);

    // get our response from the handler
    const response = await POST(req as unknown as NextRequest);

    // extract jwt cookie
    const cookie = response.cookies.get('jwt');
    const cookiePayload = jwt.decode(cookie!.value);

    expect(response.status).toBe(201);
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
    // expect the new user to be in the DB
    const user = await User.findOne({ email: mocks.user.email });
    expect(String(user._id)).toBe(responseBody.data?.user?._id);
  });

  test('should throw 400 error if username or email already exist', async () => {
    // add an instance of the user to our database
    await User.create(mocks.user);

    // create request to test
    const req = createRequest({ method: 'POST', url: '/api/auth/signup' });
    const loginData = {
      userName: mocks.user.userName,
      email: mocks.user.email,
      password: mocks.user.password,
      passwordConfirm: mocks.user.passwordConfirm,
    };

    // mock dependencies' behavior
    (dbConnect as jest.Mock).mockResolvedValueOnce(null);
    (parseBody as jest.Mock).mockResolvedValueOnce(loginData);

    // get our response from the handler
    const response = await POST(req as unknown as NextRequest);

    // extract jwt cookie
    const cookie = response.cookies.get('jwt');

    expect(response.status).toBe(400);
    // expect cookie to not exist
    expect(cookie).toBe(undefined);
  });

  test('should throw 400 error if passwords do not match', async () => {
    // create request to test
    const req = createRequest({ method: 'POST', url: '/api/auth/signup' });
    const loginData = {
      userName: mocks.user.userName,
      email: mocks.user.email,
      password: mocks.user.password,
      passwordConfirm: 'wrongPassword',
    };

    // mock dependencies' behavior
    (dbConnect as jest.Mock).mockResolvedValueOnce(null);
    (parseBody as jest.Mock).mockResolvedValueOnce(loginData);

    // get our response from the handler
    const response = await POST(req as unknown as NextRequest);

    // extract jwt cookie
    const cookie = response.cookies.get('jwt');

    expect(response.status).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Passwords do not match');
    // expect cookie to not exist
    expect(cookie).toBe(undefined);
  });

  test('should throw 400 error on validation failure', async () => {
    // create request to test
    const req = createRequest({ method: 'POST', url: '/api/auth/signup' });
    const loginData = {
      userName: mocks.user.userName,
      email: 'wrongEmail',
      password: mocks.user.password,
      passwordConfirm: mocks.user.passwordConfirm,
    };

    // mock dependencies' behavior
    (dbConnect as jest.Mock).mockResolvedValueOnce(null);
    (parseBody as jest.Mock).mockResolvedValueOnce(loginData);

    // get our response from the handler
    const response = await POST(req as unknown as NextRequest);

    // extract jwt cookie
    const cookie = response.cookies.get('jwt');

    expect(response.status).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Validation failed');
    // expect cookie to not exist
    expect(cookie).toBe(undefined);
  });

  test('should throw 500 error on failed DB connection', async () => {
    // disable console from printing errors
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // create request to test
    const req = createRequest({ method: 'POST', url: '/api/auth/signup' });

    // mock dependencies' behavior
    (dbConnect as jest.Mock).mockRejectedValueOnce(
      new Error('Failed DB connection')
    );

    // get our response from the handler
    const response = await POST(req as unknown as NextRequest);

    expect(response.status).toBe(500);
  });
});
