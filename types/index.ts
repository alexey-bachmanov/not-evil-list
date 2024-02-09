// import types from models
import { BusinessType } from '@/models/business';

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
export type AppApiRequest = {
  postNewBusiness: {
    companyName: string;
    address: string;
    addressCity: string;
    addressState: string;
    phone: string;
    website: string;
    description: string;
  };
  login: {
    email: string;
    password: string;
  };
  signup: {
    userName: string;
    email: string;
    password: string;
    passwordConfirm: string;
  };
};

export type AppApiResponse = {
  fail: {
    success: false;
    message: string;
  };
  getBusinessList: {
    success: true;
    data: {
      businesses: BusinessType[];
    };
  };
  getBusinessDetails: {
    success: true;
    data: {
      business: BusinessType;
    };
  };
  postNewBusiness: {
    success: true;
    data: { business: BusinessType };
  };
  deleteBusiness: {
    success: true;
    data: null;
  };
  putBusiness: {
    success: true;
    data: { business: BusinessType };
  };
  login: {
    success: true;
    data: {
      user: { _id: string; userName: string; email: string; role: string };
    };
  };
  logout: {
    success: true;
  };
  signup: {
    success: true;
    data: {
      user: { _id: string; userName: string; email: string; role: string };
    };
  };
};
