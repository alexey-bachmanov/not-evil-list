// this function contains ALL the functionality for turning our search into
// a proper database query
import { NextRequest } from 'next/server';
import { FilterQuery } from 'mongoose';
import { IBusinessDocument } from '@/models/business';
import authCheck from './authCheck';

///// UTILS /////
function pluralToSingular(pluralWord: string) {
  // we need to handle a few cases:
  const pluralRules: [RegExp, string][] = [
    // [pattern, replacement]
    [/s$/, ''], // Remove 's'
    [/es$/, ''], // Remove 'es'
    [/(ch|sh)es$/, '$1'], // Remove 'es' for words ending in 'ch' or 'sh'
    [/(bus)es$/, '$1'], // Remove 'es' for specific words like 'buses'
    [/ies$/, 'y'], // Change 'ies' to 'y'
    [/(octop|vir)i$/, '$1us'], // Irregular plurals
    [/(alias|status)es$/, '$1'], // Irregular plurals
    [/([ti])a$/, '$1um'], // Irregular plurals
    [/(buffal|tomat)o[es]$/, '$1o'], // Irregular plurals
    [/([lr])ves$/, '$1f'], // Irregular plurals
    [/(matr)ices$/, '$1ix'], // Irregular plurals
    [/(vert|ind)ices$/, '$1ex'], // Irregular plurals
  ];
  // test our plural word against every pattern
  for (const [pattern, replacement] of pluralRules) {
    if (pattern.test(pluralWord)) {
      return pluralWord.replace(pattern, replacement);
    }
  }
  // if no pattern matches, return the original word
  return pluralWord;
}

///// MAIN FUNCTION /////
export default async function queryStringToMongoFilter(req: NextRequest) {
  // split query string from the url
  const queryString = req.url.split('?')[1];

  // check if the request was made from an admin account, for getting unverified businesses etc.
  const { isAdmin } = await authCheck(req);

  // initialize mongo filter, default to only find verified results
  let filter: FilterQuery<IBusinessDocument>;

  // SPECIAL CASE - empty string
  if (!queryString) {
    filter = { _id: null };
    return filter;
  }

  // SPECIAL CASE - string way too long
  if (queryString.length > 512) {
    filter = { _id: null };
    return filter;
  }

  // QUERY STRING PARSING
  // process the query string into an array of search words and array of flags
  // this should handle all cases (yes or no search, yes or no flags, yes or no some third unsupported parameter)
  let flagWords: string[] = [];
  let searchWords: string[] = [];
  let searchWordsSingular: string[] = [];
  let searchString = '';
  const params = queryString.split('&');
  params.forEach((paramString) => {
    if (/flags=/.test(paramString)) {
      // extract all the flags
      flagWords = paramString.slice(6).split('+');
    } else if (/search=/.test(queryString)) {
      // extract all the searchwords
      searchWords = paramString.slice(7).split('+');
      // extract the natural-language search string
      searchString = searchWords.join(' ');
    }
  });
  // convert any plural words to singular
  searchWords.forEach((word) => {
    const singularWord = pluralToSingular(word);
    // if the initial word and transformed-to-singular word are different,
    // then the singular should be added to our list of searchwords
    if (word !== singularWord) {
      searchWordsSingular.push(singularWord);
    }
  });
  // combine the two arrays together
  searchWords = [...searchWords, ...searchWordsSingular];

  // SPECIAL CASE - '-all -unverified'
  if (
    flagWords.includes('all') &&
    flagWords.includes('unverified') &&
    isAdmin
  ) {
    filter = { isVerified: false };
    return filter;
  }

  // SPECIAL CASE - '-all'
  if (flagWords.includes('all') && isAdmin) {
    filter = {};
    return filter;
  }

  // GHETTO NLP LOGIC
  // building a true NLP library is beyond the scope of this project, so we're just matching against words in the
  // searchwords array
  // let's build a query that searches for the searchwords in the tags and as substrings in the companyName
  filter = {
    // we need to search by both verification status and the search criteria requested
    $and: [
      // flagWords has to include 'unverified' and you must be an admin to set isVerified to false
      { isVerified: !(flagWords.includes('unverified') && isAdmin) },
      {
        // search can either match (any) on tags or match (all) on companyName
        $or: [
          // if any search word is present in tags array
          { tags: { $regex: searchWords.join('|'), $options: 'i' } },
          // all search words must be in the company name to match
          {
            $and: searchWords.map((word) => ({
              companyName: { $regex: word, $options: 'i' },
            })),
          },
        ],
      },
    ],
  };

  return filter;
}
