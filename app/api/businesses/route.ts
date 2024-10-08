// Contains routes to:
// get all businesses
// create new business
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Business, IBusiness, IBusinessDocument } from '@/models';
import queryStringToMongoFilter from '@/lib/queryStringToMongoFilter';
import ApiError from '@/lib/apiError';
import { AppApiRequest, AppApiResponse } from '@/types';
import parseBody from '@/lib/parseBody';

///// GET (RETRIEVE ALL BUSINESSES) /////
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    // get our mongo search filter from the query string in the request
    const mongoFilter = await queryStringToMongoFilter(req);
    const businesses = await Business.find<IBusinessDocument>(mongoFilter);
    // by convention, even if no matching businesses were found, we
    // should return a 200 response
    return NextResponse.json<AppApiResponse['getBusinessList']>(
      { success: true, data: { businesses } },
      { status: 200 }
    );
  } catch (err: any) {
    // handle any errors we created ourselves
    // nothing in the handler code should trigger this block
    if (err.isOperational) {
      return NextResponse.json<AppApiResponse['fail']>(
        { success: false, message: err.message },
        { status: err.statusCode }
      );
    }
    // catch any programming errors
    console.error(err);
    return NextResponse.json<AppApiResponse['fail']>(
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
    const body = await parseBody<AppApiRequest['postNewBusiness']>(req);
    if (!body) {
      throw new ApiError('No body sent with request', 400);
    }
    // store input data, missing values are populated by our
    // pre-save middleware
    const newBusiness: IBusinessDocument = new Business<IBusiness>(body);
    await newBusiness.save();

    return NextResponse.json<AppApiResponse['postNewBusiness']>(
      {
        success: true,
        data: { business: newBusiness },
      },
      { status: 200 }
    );
  } catch (err: any) {
    // handle any errors we created ourselves
    if (err.isOperational) {
      return NextResponse.json<AppApiResponse['fail']>(
        { success: false, message: err.message },
        { status: err.statusCode }
      );
    }
    // catch mongo errors
    if (err.code === 11000) {
      return NextResponse.json<AppApiResponse['fail']>(
        { success: false, message: 'Business already exists' },
        { status: 400 }
      );
    }
    if (err._message === 'Business validation failed') {
      return NextResponse.json<AppApiResponse['fail']>(
        { success: false, message: 'Validation failed' },
        { status: 400 }
      );
    }
    // catch any programming errors
    console.error(err);
    return NextResponse.json<AppApiResponse['fail']>(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
