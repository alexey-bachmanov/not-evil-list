/**
 * Recursive function that accepts an array of middleware functions,
 * and returns a stack of nested functions that execute in sequence,
 * and then call NextResponse.next() to continue on to back-end routes
 */

import { NextMiddleware, NextResponse } from 'next/server';
import { MiddlewareFactory } from '@/types';

export function stackMiddlewares(
  functions: MiddlewareFactory[] = [],
  index = 0
): NextMiddleware {
  const current = functions[index];
  if (current) {
    const next = stackMiddlewares(functions, index + 1);
    return current(next);
  }
  return () => NextResponse.next();
}
