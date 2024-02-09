// Contains route to:
// Log in (get JWT)
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ApiError from '@/lib/apiError';
import User, { UserType } from '@/models/user';
import createSendToken from '@/lib/createSendToken';
import { AppApiRequest, AppApiResponse } from '@/types';
import parseBody from '@/lib/parseBody';

///// POST (LOG IN) /////
export async function POST(req: NextRequest) {
  try {
    // connet to DB
    await dbConnect();

    // check if a body was sent
    if (!req.body) {
      throw new ApiError('No credentials provided', 401);
    }

    // check if email and password exist
    const body = await parseBody<AppApiRequest['login']>(req);
    if (!body.email || !body.password) {
      throw new ApiError('No credentials provided', 401);
    }

    // check if user exists and password is correct
    const user = await User.findOne<UserType>({ email: body.email }).select(
      '+password'
    );
    if (!user || !(await user.passwordMatch(body.password, user.password))) {
      throw new ApiError('Incorrect email or password', 401);
    }
    // create a response
    let res = NextResponse.json<AppApiResponse['login']>({
      success: true,
      data: {
        user: {
          _id: user._id,
          userName: user.userName,
          email: user.email,
          role: user.role,
        },
      },
    });

    // attach JWT to our response
    createSendToken(req, res, user);

    return res;
  } catch (err: any) {
    // catch any errors we created ourselves
    if (err.isOperational) {
      return NextResponse.json<AppApiResponse['fail']>(
        { success: false, message: err.message },
        { status: err.statusCode }
      );
    }

    // catch any internal errors
    console.error(err);
    return NextResponse.json<AppApiResponse['fail']>(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
