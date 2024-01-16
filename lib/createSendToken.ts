import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export default function createSendToken(
  req: NextRequest,
  res: NextResponse,
  user: any
) {
  // pull info from .env.local
  const expiry = Number(process.env.JWT_EXPIRY); // this should always be a number, in seconds
  const secret = String(process.env.JWT_SECRET); // this should always be a string

  // sign token
  const token = jwt.sign({ id: user._id }, secret, {
    expiresIn: expiry,
  });

  // load token into an httpOnly cookie on response object
  res.cookies.set('jwt', token, {
    expires: new Date(Date.now() + expiry * 1000),
    httpOnly: true,
  });
}
