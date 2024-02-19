import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';
import ApiError from './apiError';
import dbConnect from './dbConnect';
import User, { UserType } from '@/models/user';

export default async function authCheck(
  req: NextRequest
): Promise<{ isUser: boolean; isAdmin: boolean; userId: ObjectId | null }> {
  // takes a NextRequest object, checks for the presence of a JWT,
  // decodes it, and checks the roles of that user

  // connect to DB
  await dbConnect();

  // extract jwt cookie from the request object
  const cookie = req.cookies.get('jwt');
  if (!cookie) {
    // nobody is logged in at all
    return { isUser: false, isAdmin: false, userId: null };
  }
  // extract user id from 'jwt' cookie
  const payload = jwt.decode(cookie.value);
  if (
    typeof payload === 'string' || //payload must be an object
    !payload?.id || // which must have an id field
    typeof payload.id !== 'string' // and that field should be a string
  ) {
    throw new ApiError(
      'Json web token badly formed: is not an object or does not contain valid id field',
      400
    );
  }
  const userID = payload.id;

  // check if user with that id exists and is active
  const user = await User.findById<UserType>(userID, {}).select('+active');
  if (!user || !user.active) {
    return { isUser: false, isAdmin: false, userId: null };
  }
  // check if that user is an admin
  if (user.role === 'admin') {
    return { isUser: true, isAdmin: true, userId: user._id };
  }

  // otherwise, our user is a regular user
  return { isUser: true, isAdmin: false, userId: user._id };
}
