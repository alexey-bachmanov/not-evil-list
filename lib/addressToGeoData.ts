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
  try {
    const apiKey = process.env.POSITIONSTACK_API_KEY;
    const response = await axios.get<PositionstackResponse>(
      `http://api.positionstack.com/v1/forward?access_key=${apiKey}&query=${address}, ${city} ${state}`
    );
    return response.data.data[0];
  } catch (err: any) {
    throw new ApiError('GeoLocation API failed to return data', 500);
    // throw new ApiError(err.message, 500);
  }
}
