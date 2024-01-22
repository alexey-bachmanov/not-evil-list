// Contains routes to:
// get all businesses
// create new business
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import addressToGeoData from '@/lib/addressToGeoData';
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
    // check connection to DB, as usual
    await dbConnect();
    // parse input information
    const body = await req.json();
    // use positionStack api to get coordinates
    const geoData = await addressToGeoData(
      body.address,
      body.addressCity,
      body.addressState
    );
    // store mix of parsed geodata and input data
    const newBusiness = await Business.create({
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
