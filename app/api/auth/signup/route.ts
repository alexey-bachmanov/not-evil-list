// Contains route to:
// Sign up ()
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User, { IUser, UserType } from '@/models/user';
import ApiError from '@/lib/apiError';
import createSendToken from '@/lib/createSendToken';
import { AppApiRequest, AppApiResponse } from '@/types';
import { parseBody } from '@/lib/parseBody';

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
    const body = await parseBody<AppApiRequest['signup']>(req);

    // create new user in our DB
    // we want to feed in data in IUser shape, but expect back data in UserType shape
    const newUser: UserType = new User<IUser>({ ...body, role: 'user' });
    await newUser.save();

    // create a response
    const res = NextResponse.json<AppApiResponse['signup']>(
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
      return NextResponse.json<AppApiResponse['fail']>(
        { success: false, message: err.message },
        { status: err.statusCode }
      );
    }

    // catch mongo errors
    if (err.code === 11000) {
      return NextResponse.json<AppApiResponse['fail']>(
        { success: false, message: 'Username or email already exists' },
        { status: 400 }
      );
    }
    if (err._message === 'User validation failed') {
      return NextResponse.json<AppApiResponse['fail']>(
        { success: false, message: 'Validation failed' },
        { status: 400 }
      );
    }

    // catch any internal errors
    console.error(err.message);
    return NextResponse.json<AppApiResponse['fail']>(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
