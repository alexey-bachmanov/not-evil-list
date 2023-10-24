// Contains routes to:
// get all businesses
// create new business
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Business from '@/models/business';

///// GEOCODING UTIL /////
const addressToGeoJSON = async (
  address: String,
  city: String,
  state: String
) => {
  const apiKey = process.env.POSITIONSTACK_API_KEY;
  const response = await fetch(
    `http://api.positionstack.com/v1/forward?access_key=${apiKey}&query= ${address}, ${city} ${state}`
  );
  const responseParsed = await response.json();
  return {
    type: 'Point',
    coordinates: [
      Number(responseParsed.data[0].latitude),
      Number(responseParsed.data[0].longitude),
    ],
  };
};

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
    body.location = await addressToGeoJSON(
      body.address,
      body.addressCity,
      body.addressState
    );
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
