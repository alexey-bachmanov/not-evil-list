import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
  companyName: {
    type: String,
    trim: true,
    required: [true, 'business must have a name'],
  },
  address: {
    type: String,
    trim: true,
    required: [true, 'business must have an address'],
  },
  addressCity: {
    type: String,
    trim: true,
    required: [true, 'business must have a city with its address'],
  },
  addressState: {
    type: String,
    trim: true,
    required: [true, 'business must have a state with its address'],
  },
  addressZip: {
    type: String,
    trim: true,
    required: [true, 'business must have a zip code with its address'],
  },
  phone: {
    type: String,
    trim: true,
    required: [true, 'business must have a phone number'],
  },
  website: {
    type: String,
    trim: true,
    // not everyone has a website
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'business must have a description'],
  },
  location: {
    // ↓ GeoJSON
    type: {
      type: String,
      default: 'Point',
      enum: ['Point'],
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      // TODO: remove default coordinates
      default: [39.9521406, -75.1645622],
    },
    // ↑ GeoJSON
  },
  ratingAvg: {
    type: Number,
    default: 4.5,
  },
  ratingQty: {
    type: Number,
    default: 0,
  },
});
///// INDICIES /////
businessSchema.index({ location: '2dsphere' });

///// MIDDLEWARE /////
// pre-save, do geocoding api call to get LngLat
// TODO: Make pre-save middleware to do that

///// MODEL /////
const Business = mongoose.model('Business', businessSchema);
export default Business;
