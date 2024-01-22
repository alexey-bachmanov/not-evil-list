// Contains route to:
// Sign up ()
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user';
import ApiError from '@/lib/apiError';
import createSendToken from '@/lib/createSendToken';

///// POST (SIGN UP) /////
export async function POST(req: NextRequest) {
  try {
    // connect to DB
    await dbConnect();

    // check if a body was sent
    if (!req.body) {
      throw new ApiError('No body sent with request', 400);
    }

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
    const res = NextResponse.json(
      {
        success: true,
        data: {
          user: {
            _id: newUser._id,
            userName: newUser.userName,
            email: newUser.email,
            role: newUser.role,
          },
        },
      },
      {
        status: 201,
      }
    );

    // attach JWT to our response
    createSendToken(req, res, newUser);

    return res;
  } catch (err: any) {
    // catch any errors we created ourselves
    if (err.isOperational) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: err.statusCode }
      );
    }

    // catch mongo errors
    if (err.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'Username or email already exists' },
        { status: 400 }
      );
    }
    if (err._message === 'User validation failed') {
      return NextResponse.json(
        { success: false, message: 'Validation failed' },
        { status: 400 }
      );
    }

    // catch any internal errors
    console.error(err.message);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
