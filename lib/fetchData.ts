// wrapper for the fetch and response.json() functions
// that includes support for generics and types
// since typescript doesn't know the shape of our API responses during compile,
// and typescript doesn't allow us to compare types at runtime,
// we need to assert that an API response will be one of a couple of options

// usage:
// const apiData = await fetchData< ApiRequestShape, ApiSuccessShape | ApiFailShape>
//                    (url,{...body...},{...options...});
// ↑ apiData will either be ApiSuccessShape or ApiFailShape
import { RequestInit } from 'next/dist/server/web/spec-extension/request';

export default async function fetchData<InputType, ExpectedReturnType>(
  url: string,
  body?: InputType,
  options?: RequestInit
): Promise<ExpectedReturnType> {
  // send our request
  let opts = {};
  if (!body) {
    opts = { ...options };
  } else {
    opts = { body: JSON.stringify(body), ...options };
  }
  const response = await fetch(url, opts);
  if (!response) {
    throw new Error(`No response recieved from ${url}`);
  }
  const responseParsed = await response.json();
  if (!responseParsed) {
    throw new Error(`Invalid response recieved from ${url}`);
  }
  // I would do a runtime type check here, if TS enabled such a thing
  // Instead, we have to manually make sure that our types are properly
  // defined in both the frontend and backend of our app

  return responseParsed;
}
