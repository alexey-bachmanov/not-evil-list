// Contains route to:
// Sign up ()
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user';
import createSendToken from '@/lib/createSendToken';

///// POST (SIGN UP) /////
export async function POST(req: NextRequest) {
  try {
    // connect to DB
    await dbConnect();

    // read json data in req.body
    const body = await req.json();

    // create new user in our DB
    const newUser = await User.create({
      userName: body.userName,
      email: body.email,
      password: body.password,
      passwordConfirm: body.passwordConfirm,
    });

    // create a response
    const res = NextResponse.json({
      success: true,
      user: {
        _id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        role: newUser.role,
      },
    });

    // attach JWT to our response
    createSendToken(req, res, newUser);

    return res;
  } catch (err: any) {
    console.error(err);
    // username or email already exists
    if (err.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'User name or email already exists' },
        { status: 422 }
      );
    }

    // validation errors (email invalid, passwords don't match)
    if (err._message === 'User validation failed') {
      return NextResponse.json(
        { success: false, message: 'Validation failed' },
        { status: 422 }
      );
    }

    // some internal error
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
