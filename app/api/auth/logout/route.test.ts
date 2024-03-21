/**
 * @jest-environment node
 */
import { POST } from './route';
import { NextRequest } from 'next/server';
import { createRequest } from 'node-mocks-http';

describe('api/auth/logout', () => {
  test('should return empty token on success', async () => {
    // create request for us to test
    const req = createRequest({ method: 'POST', url: '/api/auth/logout' });

    // get our response from the handler
    const response = await POST(req as unknown as NextRequest);

    // extract jwt cookie
    const cookie = response.cookies.get('jwt');
    console.log(cookie);

    expect(response.status).toBe(200);
    // expect cookie to exist and be an http-only cookie
    expect(cookie).toBeTruthy();
    expect(cookie?.httpOnly).toBe(true);
    expect(cookie?.value).toBe('');
  });
});
