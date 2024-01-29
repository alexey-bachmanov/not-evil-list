// Contains route to:
// Log out (get JWT that immediately expires)
import { NextRequest, NextResponse } from 'next/server';

///// POST (LOG OUT) /////
export async function POST(req: NextRequest) {
  try {
    // create a response
    const res = NextResponse.json({
      success: true,
    });
    // load empty token into an httpOnly cookie
    res.cookies.set('jwt', '', {
      expires: new Date(Date.now() - 1000), // set to expire 1s in the past
      httpOnly: true,
    });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
