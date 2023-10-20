import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
  companyName: String,
  address: String,
  addressCity: String,
  addressState: String,
  addressZip: String,
  phone: String,
  website: String,
  description: String,
  coordinates: [Number],
});

///// MIDDLEWARE /////

///// MODEL /////
const Business = mongoose.model('Business', businessSchema);
export default Business;
