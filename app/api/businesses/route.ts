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
    // check connection to DB, as usual
    await dbConnect();
    // parse input information
    const body = await req.json();
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
    return NextResponse.json({
      success: true,
      data: { business: newBusiness },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false });
  }
}
