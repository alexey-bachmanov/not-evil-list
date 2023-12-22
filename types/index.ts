export type BusinessDataEntry = {
  companyName: String;
  address: String;
  addressCity: String;
  addressState: String;
  addressZip: String;
  phone: String;
  website: String | null;
  description: String;
  location: { type: 'Point'; coordinates: [Number] };
  ratingAvg: Number;
  ratingQty: Number;
};
