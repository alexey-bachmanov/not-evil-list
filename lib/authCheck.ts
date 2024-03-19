import { NextRequest } from 'next/server';
import { ObjectId } from 'mongoose';

export default function authCheck(req: NextRequest): {
  isUser: boolean;
  isAdmin: boolean;
  userId: ObjectId | null;
} {
  const role = req.headers.get('userRole');
  // if userId was provided by middleware, it must be a valid ObjectId
  const userIdHeader = req.headers.get('userId');

  let userId: ObjectId | null;
  if (!userIdHeader) {
    userId = null;
  } else {
    userId = userIdHeader as unknown as ObjectId;
  }

  if (role === 'admin') {
    return { isUser: true, isAdmin: true, userId };
  } else if (role === 'user') {
    return { isUser: true, isAdmin: false, userId };
  } else {
    return { isUser: false, isAdmin: false, userId: null };
  }
}
