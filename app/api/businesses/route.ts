// Contains routes to:
// get all businesses
// create new business
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Business from '@/models/business';

///// GET (RETRIEVE ALL BUSINESSES) /////
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    // TODO: switch from header query to query string query?
    const queryString = req.headers.get('search-query');
    const businesses = await Business.find({}); // find all results (for now)
    return NextResponse.json({ success: true, data: { businesses } });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false });
  }
}

///// POST (CREATE NEW BUSINESS) /////
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const newBusiness = await Business.create(body);
    return NextResponse.json({
      success: true,
      data: { business: newBusiness },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false });
  }
}
