/**
 * Middleware for adding a short delay during development mode,
 * so our loading state is visible for a believable amount of time
 */
import { MiddlewareFactory } from '@/types';
import { NextFetchEvent, NextRequest } from 'next/server';

/**
 * sleep function - redefined here because importing a dependency in
 * both a front-end component and a back-end component breaks
 * fast refresh which we want for development
 */
async function sleep(duration: number) {
  await new Promise((resolve) => setTimeout(resolve, duration));
}

export const withDelay: MiddlewareFactory = (next) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    // do the actual middleware stuff
    if (process.env.NODE_ENV === 'development') {
      await sleep(1000);
    }
    return next(request, _next);
  };
};
