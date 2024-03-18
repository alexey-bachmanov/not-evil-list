import { IBusinessDocument, IReviewDocument } from '@/models';
import { NextMiddleware } from 'next/server';

// types for API requests
export type AppApiRequest = {
  postNewBusiness: {
    companyName: string;
    address: string;
    addressCity: string;
    addressState: string;
    phone: string;
    website: string;
    description: string;
    tags: Tag[];
  };
  editBusiness: {
    companyName: string;
    address: string;
    addressCity: string;
    addressState: string;
    phone: string;
    website: string;
    description: string;
    tags: Tag[];
    isVerified?: boolean;
  };
  postNewReview: {
    rating: number;
    review: string;
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

// types for API responses
export type AppApiResponse = {
  fail: {
    success: false;
    message: string;
  };
  getBusinessList: {
    success: true;
    data: {
      businesses: IBusinessDocument[];
    };
  };
  getBusinessDetails: {
    success: true;
    data: {
      business: IBusinessDocument;
    };
  };
  postNewBusiness: {
    success: true;
    data: { business: IBusinessDocument };
  };
  editBusiness: {
    success: true;
    data: { business: IBusinessDocument };
  };
  deleteBusiness: {
    success: true;
    data: null;
  };
  putBusiness: {
    success: true;
    data: { business: IBusinessDocument };
  };
  getAllReviews: {
    success: true;
    data: { reviews: IReviewDocument[] };
  };
  postNewReview: {
    success: true;
    data: { review: IReviewDocument };
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

// tag type and tags array
// we're playing games with typescript so we only have to define the tags in one place
const tagsConst = [
  'Restaurant',
  'Bar',
  'Cafe',
  'Bakery',
  'Fast Food',
  'Fine Dining',
  'Food Truck',
  'Pizzeria',
  'Pub',
  'Coffee Shop',
  'Tea House',
  'Ice Cream Parlor',
  'Diner',
  'Buffet',
  'Grocery Store',
  'Supermarket',
  'Farmers Market',
  'Convenience Store',
  'Bookstore',
  'Clothing Store',
  'Electronics Store',
  'Furniture Store',
  'Hardware Store',
  'Florist',
  'Gift Shop',
  'Jewelry Store',
  'Art Gallery',
  'Museum',
  'Theater',
  'Cinema',
  'Fitness Center',
  'Yoga Studio',
  'Spa',
  'Salon',
  'Barbershop',
  'Hotel',
  'Motel',
  'Bed and Breakfast',
  'Hostel',
  'Auto Repair Shop',
  'Gas Station',
  'Car Wash',
  'Laundry Service',
  'Dry Cleaner',
  'Bank',
  'Credit Union',
  'Insurance Agency',
  'Real Estate Agency',
  'Law Firm',
  'Medical Clinic',
  'Dentist',
  'Pharmacy',
  'Veterinary Clinic',
  'Pet Grooming',
  'Child Care Center',
  'School',
  'University',
  'Library',
  'Community Center',
  'Church',
  'Synagogue',
  'Mosque',
  'Temple',
  'Park',
  'Zoo',
  'Botanical Garden',
  'Sports Stadium',
  'Golf Course',
  'Ski Resort',
  'Amusement Park',
  'Arcade',
  'Casino',
  'Nightclub',
  'Lounge',
  'Live Music Venue',
  'Dance Studio',
  'Photography Studio',
  'Tech Startup',
  'Consulting Firm',
  'Marketing Agency',
] as const;
export const tags = [...tagsConst];
export type Tag = (typeof tags)[number];

export type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware;
