import ApiError from './apiError';
import axios from 'axios';

interface PositionstackResponse {
  data: {
    latitude: number;
    longitude: number;
    type: string;
    name: string;
    number: string;
    postal_code: string;
    street: string;
    confidence: number;
    region: string;
    region_code: string;
    county: string;
    locality: string;
    administrative_area: string;
    neighbourhood: string;
    country: string;
    country_code: string;
    continent: string;
    label: string;
  }[];
}
interface PositionstackError {
  error: {
    code: string;
    message: string;
  };
}

export default async function addressToGeoData(
  address: string,
  city: string,
  state: string
) {
  const apiKey = process.env.POSITIONSTACK_API_KEY;
  const reply = await axios.get<PositionstackResponse | PositionstackError>(
    `http://api.positionstack.com/v1/forward?access_key=${apiKey}&query=${address}, ${city} ${state}`
  );
  if (reply.status !== 200) {
    throw new ApiError('GeoLocation API failed to return data', 500);
  }
  return (reply.data as PositionstackResponse).data[0];
}
