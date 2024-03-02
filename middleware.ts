// development-only middleware to add a short delay to all requests
// when in the development environment.
// should run without delay in production and testing
import { NextRequest, NextResponse } from 'next/server';
// import sleep from './lib/sleep'; // this is causing fast refresh to stop working
async function sleep(duration: number) {
  await new Promise((resolve) => setTimeout(resolve, duration));
}

export async function middleware(request: NextRequest) {
  if (process.env.NODE_ENV === 'development') {
    await sleep(1000);
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
