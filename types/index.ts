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
  location: { type: 'Point'; coordinates: [number] };
  ratingAvg: number;
  ratingQty: number;
};
