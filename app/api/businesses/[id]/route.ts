// Contains routes to:
// get business details
// update a business (admin)
// delete a business (admin)

import { NextRequest, NextResponse } from 'next/server';
import { isValidObjectId } from 'mongoose';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import addressToGeoData from '@/lib/addressToGeoData';
import ApiError from '@/lib/apiError';
import Business from '@/models/business';
import User from '@/models/user';

///// AUTH CHECK UTIL /////
const authCheck = async function (req: NextRequest) {
  // takes a NextRequest object, checks for the presence of a JWT,
  // decodes it, and checks the roles of that user
  // TODO: turn this functionality into middleware?

  // extract jwt cookie from the request object
  const cookie = req.cookies.get('jwt');
  if (!cookie) {
    throw new ApiError('No json web token attached to request', 400);
  }
  // extract user id from 'jwt' cookie
  const payload = jwt.decode(cookie.value);
  if (typeof payload === 'string' || !payload?.id) {
    throw new ApiError(
      'Json web token badly formed: is not an object or does not contain id field',
      400
    );
  }
  const userID = payload.id;

  // check if user with that id exists and is active
  // at this point in the code, we should already be connected to DB
  const user = await User.findById(userID, {}).select('+active');
  if (!user || !user.active) {
    return { isUser: false, isAdmin: false };
  }
  // check if that user is an admin
  if (user.role === 'admin') {
    return { isUser: true, isAdmin: true };
  }

  // otherwise, our user is a regular user
  return { isUser: true, isAdmin: false };
};

///// GET (GET BUSINESS DETAILS, BY ID) /////
export async function GET(req: NextRequest) {
  try {
    // connect to the database
    await dbConnect();

    // get business ID from url - there must be a better way of doing it but I can't find it
    const businessID = req.url.split('/').at(-1);

    // check if it's a valid mongo ID
    if (!isValidObjectId(businessID)) {
      throw new ApiError('Invalid business ID', 400);
    }

    // try and get the business
    const business = await Business.findById(businessID);

    // check if the business actually exists (findById would return null)
    if (!business) {
      throw new ApiError('Business not found', 404);
    }

    return NextResponse.json(
      { success: true, data: { business: business } },
      { status: 200 }
    );
  } catch (err: any) {
    // catch any errors we created ourselves
    if (err.isOperational) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: err.statusCode }
      );
    }

    // catch any other errors
    console.error(err.message);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

///// PUT (UPDATE A BUSINESS, BY ID) /////
// since we'll be submitting an entire form from our front-end, and
// we need most of that info in order to perform our geocoding
// PUT is the correct method to use here, instead of PATCH
export async function PUT(req: NextRequest) {
  try {
    // connect to the database
    await dbConnect();

    // check if a body was sent with the request
    const body = await req.json();
    if (!body) {
      throw new ApiError('No body sent with request', 400);
    }

    // check if the user exists and is authorized to update a DB entry
    const { isUser, isAdmin } = await authCheck(req);
    if (!isUser) {
      throw new ApiError('User does not exist', 401);
    }
    if (!isAdmin) {
      throw new ApiError('User not authorized to perform this action', 403);
    }

    // get business ID from url - there must be a better way of doing it but I can't find it
    const businessID = req.url.split('/').at(-1);

    // check if it's a valid mongo ID
    if (!isValidObjectId(businessID)) {
      throw new ApiError('Invalid business ID', 400);
    }

    // use positionStack api to get coordinates
    const geoData = await addressToGeoData(
      body.address,
      body.addressCity,
      body.addressState
    );

    // try and store a mix of parsed geodata and input data in the entry
    const business = await Business.findByIdAndUpdate(
      businessID,
      {
        companyName: body.companyName,
        address: geoData.name,
        addressCity: geoData.locality,
        addressState: geoData.region_code,
        addressZip: geoData.postal_code,
        phone: body.phone,
        website: body.website,
        description: body.description,
        location: {
          type: 'Point',
          coordinates: [geoData.longitude, geoData.latitude],
        },
        ratingsAvg: 4.5,
        ratingsQty: 0,
      },
      { new: true, runValidators: true }
    );

    // check if that business actually existed (findByIdAndUpdate would return null)
    if (!business) {
      throw new ApiError('Business not found', 404);
    }

    return NextResponse.json(
      { success: true, data: { business: business } },
      { status: 200 }
    );
  } catch (err: any) {
    // catch any errors we created ourselves
    if (err.isOperational) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: err.statusCode }
      );
    }

    // catch any other errors
    console.error(err.message);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

///// DELETE (DELETE A BUSINESS, BY ID) /////
export async function DELETE(req: NextRequest) {
  try {
    // connect to the database
    await dbConnect();

    // check if the user exists and is authorized to update a DB entry
    const { isUser, isAdmin } = await authCheck(req);
    if (!isUser) {
      throw new ApiError('User does not exist', 401);
    }
    if (!isAdmin) {
      throw new ApiError('User not authorized to perform this action', 403);
    }

    // get business ID from url - there must be a better way of doing it but I can't find it
    const businessID = req.url.split('/').at(-1);

    // check if it's a valid mongo ID
    if (!isValidObjectId(businessID)) {
      throw new ApiError('Invalid business ID', 400);
    }

    // try to delete the entry
    const business = await Business.findByIdAndDelete(businessID);

    // check if that business actually existed (findByIdAndDelete would return null)
    if (!business) {
      throw new ApiError('Business not found', 404);
    }

    return NextResponse.json({ success: true, data: null }, { status: 200 });
  } catch (err: any) {
    // catch any errors we created ourselves
    if (err.isOperational) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: err.statusCode }
      );
    }

    // catch any other errors
    console.error(err.message);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
