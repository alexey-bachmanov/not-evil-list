// wrapper function for the .json() method on requests,
// which supports generics and types
// since typescript doesn't allow runtime type checks, we can't ensure the data
// is what we expect it to be, we just have to be vigilant in applying the
// appropriate types in both the frontend and backend of our application
import { NextRequest } from 'next/server';

export default async function parseBody<ExpectedReturnType>(
  req: NextRequest
): Promise<ExpectedReturnType> {
  return await req.json();
}
