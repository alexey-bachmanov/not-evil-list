// Contains routes to:
// get all businesses
// create new business
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Business from '@/models/business';
import queryStringToMongoFilter from '@/lib/queryStringToMongoFilter';
import ApiError from '@/lib/apiError';

///// GET (RETRIEVE ALL BUSINESSES) /////
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    // get our query string from the headers
    const queryString = req.headers.get('search-query');
    if (typeof queryString === null) {
      throw new ApiError("No header named 'search-query' found", 400);
    }

    const mongoFilter = queryStringToMongoFilter(queryString);
    const businesses = await Business.find(mongoFilter);
    // by convention, even if no matching businesses were found, we
    // should return a 200 response
    return NextResponse.json(
      { success: true, data: { businesses } },
      { status: 200 }
    );
  } catch (err: any) {
    // handle any errors we created ourselves
    if (err.isOperational) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: err.statusCode }
      );
    }
    // catch any programming errors
    console.error(err);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

///// POST (CREATE NEW BUSINESS) /////
export async function POST(req: NextRequest) {
  try {
    // check connection to DB, as usual
    await dbConnect();
    // parse input information
    const body = await req.json();
    if (!body) {
      throw new ApiError('No body sent with request', 400);
    }
    // store input data, missing values are populated by our
    // pre-save middleware
    const newBusiness = await Business.create({
      companyName: body.companyName,
      address: body.address,
      addressCity: body.addressCity,
      addressState: body.addressState,
      phone: body.phone,
      website: body.website,
      description: body.description,
    });
    return NextResponse.json(
      {
        success: true,
        data: { business: newBusiness },
      },
      { status: 200 }
    );
  } catch (err: any) {
    // handle any errors we created ourselves
    if (err.isOperational) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: err.statusCode }
      );
    }
    // catch mongo errors
    if (err.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'Business already exists' },
        { status: 400 }
      );
    }
    if (err._message === 'Business validation failed') {
      return NextResponse.json(
        { success: false, message: 'Validation failed' },
        { status: 400 }
      );
    }
    // catch any programming errors
    console.error(err);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
