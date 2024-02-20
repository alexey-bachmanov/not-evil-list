// contains routes to:
// get all reviews associated with the businessId param
// create a review for business associated with businessId
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ApiError from '@/lib/apiError';
import { AppApiRequest, AppApiResponse } from '@/types';
import parseBody from '@/lib/parseBody';
import { Review, IReview, IReviewDocument } from '@/models';
import { ObjectId, isValidObjectId } from 'mongoose';
import authCheck from '@/lib/authCheck';

///// GET (RETRIEVE ALL REVIEWS, BY BUSINESS ID) /////
export async function GET(req: NextRequest) {
  try {
    // connect to DB, as usual
    await dbConnect();
    // get businessId param
    const businessIdParam = (
      req.nextUrl.pathname.match(
        /\/api\/businesses\/([^/]+)\/reviews/
      ) as RegExpExecArray
    )[1]; // this should always return something if we're acessing this route
    // check if that businessIdParam is a valid mongoDB ObjectID
    if (!businessIdParam || !isValidObjectId(businessIdParam)) {
      throw new ApiError('Invalid Business ID', 400);
    }
    // assert that the businessIdParam string IS a mongoDB ObjectID
    const businessId = businessIdParam as unknown as ObjectId;
    // find all reviews with that businessId
    const reviews = await Review.find<IReviewDocument>({
      business: businessId,
    });
    // return array of reviews
    return NextResponse.json<AppApiResponse['getAllReviews']>({
      success: true,
      data: { reviews },
    });
  } catch (err: any) {
    // handle any errors we created ourselves
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

///// POST (CREATE NEW REVIEW FOR BUSINESS, BY BUSINESS ID) /////
export async function POST(req: NextRequest) {
  try {
    // connect to DB, as usual
    await dbConnect();
    // get the businessId param
    const businessIdParam = (
      req.nextUrl.pathname.match(
        /\/api\/businesses\/([^/]+)\/reviews/
      ) as RegExpExecArray
    )[1];
    // check if that businessIdParam is a valid mongoDB ObjectID
    if (!businessIdParam || !isValidObjectId(businessIdParam)) {
      throw new ApiError('Invalid Business ID', 400);
    }
    // assert that the businessIdParam string IS a mongoDB ObjectID
    const businessId = businessIdParam as unknown as ObjectId;
    // get the user ID from the authCheck utility
    const { userId } = await authCheck(req);
    if (!userId) {
      throw new ApiError('User not authorized to perform this action', 403);
    }
    // parse the recieved body
    const body = await parseBody<AppApiRequest['postNewReview']>(req);
    // create new review from input data, and save it
    const newReview: IReviewDocument = new Review<IReview>({
      ...body,
      user: userId,
      business: businessId,
    });
    await newReview.save();
    return NextResponse.json<AppApiResponse['postNewReview']>({
      success: true,
      data: { review: newReview },
    });
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
        { success: false, message: 'Review already exists' },
        { status: 400 }
      );
    }
    if (err._message === 'Review validation failed') {
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
