import ApiError from './apiError';

export default async function addressToGeoData(
  address: string,
  city: string,
  state: string
) {
  const apiKey = process.env.POSITIONSTACK_API_KEY;
  const response = await fetch(
    `http://api.positionstack.com/v1/forward?access_key=${apiKey}&query= ${address}, ${city} ${state}`
  );
  const responseParsed = await response.json();
  if (!responseParsed.data[0]) {
    throw new ApiError('GeoLocation API failed to return data', 500);
  }
  return responseParsed.data[0];
}
