import mongoose from 'mongoose';

type GeoJSON = { type: String; coordinates: [Number] };
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
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
      },
    },
    // ↑ GeoJSON
    // required: [true, 'business must have a GeoJSON location'],
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

///// MODEL /////
// because we're runing on a serverless framework, it sometimes happens
// that this module is run more than once, and we get an error saying
// 'Cannot overwrite model once compiled'. This short circuit asks for
// the existing model, and if it can't find it, creates a new one.
const Business =
  mongoose.models.Business || mongoose.model('Business', businessSchema);
export default Business;
