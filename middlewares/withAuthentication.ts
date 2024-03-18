/**
 * Middleware for decoding the attached jwt into a useful user
 * id, and adding headers to our request indicating auth status,
 * for other functions to query
 */
import { MiddlewareFactory } from '@/types';
import { NextFetchEvent, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { IUserDocument, User } from '@/models';

export const withAuthentication: MiddlewareFactory = (next) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    // do the actual middleware stuff
    // extract jwt cookie from the request object
    const jwtCookie = request.cookies.get('jwt');
    if (!jwtCookie) {
      // nobody is logged in at all
      request.headers.set('role', 'guest');
      request.headers.set('userId', '');
      return next(request, _next);
    }

    // extract payload from 'jwt' cookie, check if it's properly formatted
    const payload = jwt.decode(jwtCookie.value);
    if (
      typeof payload === 'string' || //payload must be an object
      !payload?.id || // which must have an id field
      typeof payload.id !== 'string' // and that field should be a string
    ) {
      // jwt cookie is malformed, so we should tag the user as a guest
      request.headers.set('role', 'guest');
      request.headers.set('userId', '');
      return next(request, _next);
    }

    // check if a user with that id exists and is active, and what their role is
    const userID = payload.id;
    const user = await User.findById<IUserDocument>(userID, {}).select(
      '+active'
    );
    if (!user || !user.active) {
      // no such user exists, or user is inactive, so log in as guest
      request.headers.set('role', 'guest');
      request.headers.set('userId', '');
      return next(request, _next);
    }
    if (user.role === 'admin') {
      // user is an administrator
      request.headers.set('role', 'admin');
      request.headers.set('userId', user._id);
      return next(request, _next);
    }
    // otherwise, the user is a regular user
    request.headers.set('role', 'user');
    request.headers.set('userId', user._id);
    return next(request, _next);
  };
};
