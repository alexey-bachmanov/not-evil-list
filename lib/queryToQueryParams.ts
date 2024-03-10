// turns a natural-language query with flags into query params
// for feeding into an axios request

export default function queryToQueryParams(inputString: string) {
  // format for the input string is "restaurants near me -unverified"
  // format for the output is "?search=restaurants+near+me&flags=unverified"
  // handle edge case of empty string
  if (inputString.trim() === '') {
    return '';
  }
  // clean up string, remove leading and trailing spaces, and shrink
  // mid-string gaps to one space
  const cleanedString = inputString.trim().replace(/\s+(?=\S)/g, ' ');
  const words = cleanedString.split(' ');
  const searchWords: string[] = [];
  const flagWords: string[] = [];
  words.forEach((word) => {
    if (word.startsWith('-')) {
      flagWords.push(word.slice(1));
    } else {
      searchWords.push(word);
    }
  });
  const queryStringSearch = searchWords.join('+');
  const queryStringflags = flagWords.join('+');
  let queryString = '';
  // options:
  // queryString = '' (no search or flag words)
  // queryString = '?search=...' (no flag words)
  // queryString = '?flags=...' (no search words)
  // queryString = '?search=...&flags=...' (search and flag words)
  if (searchWords.length > 0 && flagWords.length === 0) {
    queryString = `?search=${queryStringSearch}`;
  }
  if (searchWords.length === 0 && flagWords.length > 0) {
    queryString = `?flags=${queryStringflags}`;
  }
  if (searchWords.length > 0 && flagWords.length > 0) {
    queryString = `?search=${queryStringSearch}&flags=${queryStringflags}`;
  }

  return queryString;
}
