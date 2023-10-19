import { createSlice } from '@reduxjs/toolkit';

// declare types
export type BusinessDataEntry = {
  objectID: Number;
  companyName: String;
  address: String;
  addressCity: String;
  addressState: String;
  addressZip: String;
  phone: Number;
  website: String;
  description: String;
};

// create fake list for testing
// this list *should* be pulled from a search query to our DB
let fakeList: BusinessDataEntry[] = [];
for (let i = 0; i < 10; i++) {
  fakeList.push({
    objectID: i,
    companyName: `company ${i}`,
    address: '123 fake street',
    addressCity: 'Philadelphia',
    addressState: 'PA',
    addressZip: '19000',
    phone: 2151234567,
    website: 'https://www.linkedin.com',
    description: 'a real fake company',
  });
}

const resultsSlice = createSlice({
  name: 'resultsSlice',
  initialState: {
    results: fakeList,
  },
  reducers: {},
});

export default resultsSlice;
