import ApiError from './apiError';
import axios from 'axios';

interface PositionstackResponse {
  data: {
    latitude: number;
    longitude: number;
    type: string;
    name: string | null;
    number: string | null;
    postal_code: string | null;
    street: string | null;
    confidence: number;
    region: string | null;
    region_code: string | null;
    county: string | null;
    locality: string | null;
    administrative_area: string | null;
    neighbourhood: string | null;
    country: string | null;
    country_code: string | null;
    continent: string | null;
    label: string | null;
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
