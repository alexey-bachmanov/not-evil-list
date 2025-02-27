import mongoose from 'mongoose';
import addressToGeoData from '@/lib/addressToGeoData';
import { isValidPhoneNumber } from '@/lib/phoneFormatUtils';
import { Tag } from '@/types';
import { IReviewDocument } from '.';

///// DEFINE INTERFACES /////
// define the basic interface for our model
interface IPoint {
  type: 'Point';
  coordinates: [number, number];
}
export interface IBusiness {
  companyName: string;
  address: string;
  addressCity: string;
  addressState: string;
  addressZip?: string;
  phone: string;
  website: string;
  description: string;
  ratingAvg?: number;
  ratingQty?: number;
  isVerified?: boolean;
  location?: IPoint;
  tags: Tag[];
  reviews?: IReviewDocument[];
}
// extend it to include instance methods and values like '_id'
interface IPointDocument extends IPoint, mongoose.Document {}
export interface IBusinessDocument
  extends IBusiness,
    mongoose.Document<string> {
  // instance methods
}
export interface IBusinessModel extends mongoose.Model<IBusinessDocument> {
  // static methods
}

///// DEFINE SCHEMA /////
const pointSchema = new mongoose.Schema<IPointDocument>({
  // ↓ GeoJSON
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point',
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
  // ↑ GeoJSON
});

const businessSchema = new mongoose.Schema<IBusinessDocument>(
  {
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
      // required: [true, 'business must have a zip code with its address'],
    },
    phone: {
      type: String,
      trim: true,
      required: [true, 'business must have a phone number'],
      validate: {
        validator: (phone: string) => isValidPhoneNumber(phone),
        message: 'please enter a valid phone number',
      },
    },
    website: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'business must have a description'],
    },
    location: {
      type: pointSchema,
      // this will be set in the pre-save middleware
    },
    ratingAvg: {
      type: Number,
      default: 4.5,
    },
    ratingQty: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

///// INDICIES /////
businessSchema.index({ location: '2dsphere' });

///// VIRTUAL PROPERTIES /////
// virtually populate tour with reviews, which are otherwise
// inaccesible because they are parent-referenced
// any document where foreignField === localField is a
// 'virtual child' of this document
businessSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'business',
  localField: '_id',
});

///// MIDDLEWARE /////
businessSchema.pre('save', async function (next) {
  // call our geolocation api with address, city, and state to recieve
  // cleaned up data and coordinate pair
  const geoData = await addressToGeoData(
    this.address,
    this.addressCity,
    this.addressState
  );
  // store data returned from the geolocation api instead of provided data
  this.address = geoData.name;
  this.addressCity = geoData.locality;
  this.addressState = geoData.region_code;
  this.addressZip = geoData.postal_code;
  this.location = {
    type: 'Point',
    coordinates: [geoData.longitude, geoData.latitude],
  };
  next();
});

///// EXPORT IT ALL /////
export { businessSchema };
