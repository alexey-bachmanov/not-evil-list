// Contains routes to:
// get all businesses
// create new business
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Business from '@/models/business';

///// GET (RETRIEVE ALL BUSINESSES) /////
const getHandler = (req: NextApiRequest, res: NextApiResponse) => {};

///// POST (CREATE NEW BUSINESS) /////
const postHandler = (req: NextApiRequest, res: NextApiResponse) => {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // await connection to DB
  await dbConnect();

  switch (req.method) {
    case 'GET':
      break;
    case 'POST':
      break;
    default:
      break;
  }
}
