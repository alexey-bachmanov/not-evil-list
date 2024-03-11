import { IBusiness, IUser, IReview } from '@/models';

const business1: IBusiness = {
  companyName: 'Business 1',
  address: '1400 John F Kennedy Blvd',
  addressCity: 'Philadelphia',
  addressState: 'PA',
  phone: '15551234567',
  website: 'www.website.com',
  description: 'A real description',
  tags: ['Community Center'],
};

const business2: IBusiness = {
  companyName: 'Business 2',
  address: '1400 John F Kennedy Blvd',
  addressCity: 'Philadelphia',
  addressState: 'PA',
  phone: '15551234567',
  website: 'www.website.com',
  description: 'A real description',
  tags: ['Community Center'],
};

const user: IUser = {
  userName: 'User',
  email: 'user@website.com',
  role: 'user',
  password: 'password',
  passwordConfirm: 'password',
};

const admin: IUser = {
  userName: 'Admin',
  email: 'admin@website.com',
  role: 'admin',
  password: 'password',
  passwordConfirm: 'password',
};

const review1: IReview = {
  business: '0' as any,
  user: '0' as any,
  rating: 4,
  review: 'Great review!',
};

const review2: IReview = {
  business: '0' as any,
  user: '0' as any,
  rating: 3,
  review: 'OK review!',
};

const geoDataSuccess = {
  latitude: 39.952499,
  longitude: -75.163837,
  type: 'address',
  name: '1400 John F Kennedy Blv',
  number: '1400',
  postal_code: '19107-0000',
  street: 'John F Kennedy Blv',
  confidence: 1,
  region: 'Pennsylvania',
  region_code: 'PA',
  county: 'Philadelphia County',
  locality: 'Philadelphia',
  administrative_area: 'Philadelphia',
  neighbourhood: 'Center City East',
  country: 'United States',
  country_code: 'USA',
  continent: 'North America',
  label: '1400 John F Kennedy Blv, Philadelphia, PA, USA',
};

const geoDataFail = {
  error: {
    code: 'invalid_access_key',
    message: 'You have not supplied a valid API Access Key.',
  },
};

const mocks = {
  business1,
  business2,
  user,
  admin,
  review1,
  review2,
  geoDataSuccess,
  geoDataFail,
};
export default mocks;
