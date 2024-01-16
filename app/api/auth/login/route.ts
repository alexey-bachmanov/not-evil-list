// Contains route to:
// Log in (get JWT)
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user';
import createSendToken from '@/lib/createSendToken';

///// POST (LOG IN) /////
export async function POST(req: NextRequest) {
  try {
    // connet to DB
    await dbConnect();

    // check if a body was sent
    if (!req.body) {
      throw new Error('No credentials provided');
    }

    // check if email and password exist
    const body = await req.json();
    if (!body.email || !body.password) {
      throw new Error('No credentials provided');
    }

    // check if user exists and password is correct
    const user = await User.findOne({ email: body.email }).select('+password');
    if (!user || !(await user.passwordMatch(body.password, user.password))) {
      throw new Error('Incorrect email or password');
    }
    // create a response
    let res = NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
      },
    });

    // attach JWT to our response
    createSendToken(req, res, user);

    return res;
  } catch (err: any) {
    console.error(err);

    // no credentials
    if (err.message === 'No credentials provided') {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: 401 }
      );
    }

    // email or password incorrect
    if (err.message === 'Incorrect email or password') {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
