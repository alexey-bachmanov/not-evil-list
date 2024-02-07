// basic information about a business to show in the search results
export type BusinessDataEntry = {
  _id: string;
  companyName: string;
  address: string;
  addressCity: string;
  addressState: string;
  addressZip: string;
  phone: string;
  website: string | null;
  description: string;
  location: { type: 'Point'; coordinates: [number, number] };
  ratingAvg: number;
  ratingQty: number;
};

// detailed information about a specific business
// for now, it's the same as BusinessDataEntry, but we will add other
// information, like a list of reviews
export type BusinessDetails = {
  _id: string;
  companyName: string;
  address: string;
  addressCity: string;
  addressState: string;
  addressZip: string;
  phone: string;
  website: string | null;
  description: string;
  location: { type: 'Point'; coordinates: [number, number] };
  ratingAvg: number;
  ratingQty: number;
};

// types for API responses
export type AppApiResponse = {
  getBusinessList: {};
  getBusinessDetails: {};
  postNewBusiness: {};
  deleteBusiness: {};
  putBusiness: {};
  login: {};
  logout: {};
  signup: {};
};
