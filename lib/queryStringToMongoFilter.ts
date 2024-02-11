// this function contains ALL the functionality for turning our search into
// a proper database query
import { NextRequest } from 'next/server';
import { FilterQuery } from 'mongoose';
import { BusinessType } from '@/models/business';
import authCheck from './authCheck';

export default async function queryStringToMongoFilter(req: NextRequest) {
  // split query string from the url
  const queryString = req.url.split('?')[1];

  // check if the request was made from an admin account, for getting unverified businesses etc.
  const { isAdmin } = await authCheck(req);

  // initialize mongo filter, default to only find verified results
  let filter: FilterQuery<BusinessType> = { isVerified: true };

  // check for an empty string, return a filter that will return nothing
  if (!queryString) {
    filter = { _id: null };
    return filter;
  }

  // process the query string into an array of search words and array of flags
  // this should handle all cases (yes or no search, yes or no flags, yes or no some third unsupported parameter)
  let flagWords: string[] = [];
  let searchWords: string[] = [];
  let searchString = '';
  const params = queryString.split('&');
  params.forEach((param) => {
    if (/flags=/.test(param)) {
      // extract all the flags
      flagWords = param.slice(6).split('+');
    } else if (/search=/.test(queryString)) {
      // extract all the searchwords
      searchWords = param.slice(7).split('+');
      // extract the natural-language search string
      searchString = searchWords.join(' ');
    }
  });

  // TODO: search logic goes here

  // check for the -unverified flag and if it's an admin request
  // if only the unverified tag is present, it should return all unverified businesses
  if (flagWords.includes('unverified') && isAdmin) {
    filter.isVerified = false;
  }

  // console.log({ flagWords, searchWords, searchString, filter });
  return filter;
}
