// Contains route to:
// Log out (get JWT that immediately expires)
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user';

///// POST (LOG OUT) /////
export async function POST(req: NextRequest) {
  try {
    // create a response
    const res = NextResponse.json({
      success: true,
    });
    // load empty token into an httpOnly cookie
    res.cookies.set('jwt', '', {
      expires: new Date(Date.now() + 1000), // set to expire 1s in the future
      httpOnly: true,
    });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
