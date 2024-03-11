// queryStringToMongoFilter.test.ts
import { NextRequest } from 'next/server';
import queryStringToMongoFilter from './queryStringToMongoFilter';
import authCheck from './authCheck';

jest.mock('./authCheck');
// let typescript know that the authcheck module will be a mocked function
const mockAuthCheck = authCheck as jest.MockedFunction<typeof authCheck>;

describe('queryStringToMongoFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns null filter for empty queryString', async () => {
    mockAuthCheck.mockResolvedValue({
      isAdmin: false,
      isUser: false,
      userId: null,
    });
    const req = { url: '/path?' } as NextRequest;
    const filter = await queryStringToMongoFilter(req);
    expect(filter).toEqual({ _id: null });
  });

  test('returns null filter for queryString longer than 512 characters', async () => {
    mockAuthCheck.mockResolvedValue({
      isAdmin: false,
      isUser: false,
      userId: null,
    });
    const req = { url: `/path?${'a'.repeat(513)}` } as NextRequest;
    const filter = await queryStringToMongoFilter(req);
    expect(filter).toEqual({ _id: null });
  });

  test('returns null filter for garbled query string', async () => {
    mockAuthCheck.mockResolvedValue({
      isAdmin: false,
      isUser: false,
      userId: null,
    });
    const req = { url: '/path?wronginput' } as NextRequest;
    const filter = await queryStringToMongoFilter(req);
    expect(filter).toEqual({ _id: null });
  });

  test('returns correct filter for special admin flags', async () => {
    mockAuthCheck.mockResolvedValue({
      isAdmin: true,
      isUser: true,
      userId: null,
    });

    const req1 = { url: '/path?flags=all' } as NextRequest;
    const filter1 = await queryStringToMongoFilter(req1);
    const expectedFilter1 = {};
    expect(filter1).toEqual(expectedFilter1);

    const req2 = { url: '/path?flags=all+unverified' } as NextRequest;
    const filter2 = await queryStringToMongoFilter(req2);
    const expectedFilter2 = { isVerified: false };
    expect(filter2).toEqual(expectedFilter2);
  });

  test('returns correct filter for unauthorized user trying to use admin flags', async () => {
    mockAuthCheck.mockResolvedValue({
      isAdmin: false,
      isUser: true,
      userId: null,
    });

    const req1 = { url: '/path?flags=all' } as NextRequest;
    const filter1 = await queryStringToMongoFilter(req1);
    expect(filter1).toEqual({ _id: null });

    const req2 = { url: '/path?flags=all&unverified' } as NextRequest;
    const filter2 = await queryStringToMongoFilter(req2);
    expect(filter2).toEqual({ _id: null });
  });

  test('returns correct filter for valid query string', async () => {
    mockAuthCheck.mockResolvedValue({
      isAdmin: false,
      isUser: true,
      userId: null,
    });

    const req = {
      url: '/path?search=word1+word2+plurals',
    } as NextRequest;
    const filter = await queryStringToMongoFilter(req);

    const expectedFilter = {
      $and: [
        { isVerified: true },
        {
          $or: [
            { tags: { $regex: 'word1|word2|plurals|plural', $options: 'i' } },
            {
              $and: [
                { companyName: { $regex: 'word1', $options: 'i' } },
                { companyName: { $regex: 'word2', $options: 'i' } },
                { companyName: { $regex: 'plurals', $options: 'i' } },
                { companyName: { $regex: 'plural', $options: 'i' } },
              ],
            },
          ],
        },
      ],
    };

    expect(filter).toEqual(expectedFilter);
  });

  test('returns correct filter for two-word tags (eg food truck)', async () => {
    mockAuthCheck.mockResolvedValue({
      isAdmin: false,
      isUser: true,
      userId: null,
    });

    const req = {
      url: '/path?search=food+truck',
    } as NextRequest;
    const filter = await queryStringToMongoFilter(req);

    const expectedFilter = {
      $and: [
        { isVerified: true },
        {
          $or: [
            { tags: { $regex: 'food|truck', $options: 'i' } },
            {
              $and: [
                { companyName: { $regex: 'food', $options: 'i' } },
                { companyName: { $regex: 'truck', $options: 'i' } },
              ],
            },
          ],
        },
      ],
    };

    expect(filter).toEqual(expectedFilter);
  });
});
