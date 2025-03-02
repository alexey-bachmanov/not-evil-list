import mongoose, { ObjectId } from 'mongoose';
import recalculateAvgRating from '@/lib/recalculateAvgRating';

///// DEFINE INTERFACES /////
export interface IReview {
  business: string;
  user: string;
  rating: number;
  review: string;
  createdAt?: string;
}
export interface IReviewPopulated {
  business: string;
  user: { _id: string; userName: string };
  rating: number;
  review: string;
  createdAt?: string;
}

// any time we access a Review document, it will be populated
export interface IReviewDocument
  extends IReviewPopulated,
    mongoose.Document<string> {
  // instance methods
}
export interface IReviewModel extends mongoose.Model<IReviewDocument> {
  // static methods
}

///// DEFINE SCHEMA /////
const reviewSchema = new mongoose.Schema<IReviewDocument>(
  {
    business: {
      type: String,
      ref: 'Business',
    },
    user: {
      type: String,
      ref: 'User',
    },
    rating: {
      type: Number,
      required: [true, 'Rating must exist on a review'],
      min: [1, 'Rating must be between 1 and 5'],
      max: [5, 'Rating must be between 1 and 5'],
    },
    review: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

///// INDICIES /////
reviewSchema.index({ business: 1, user: 1 }, { unique: true });

///// MIDDLEWARE /////
// populate user data on query
// this only works on the Model.find() method, since we won't need
// this info on e.g. findOneAndUpdate
reviewSchema.pre(['find', 'findOne'], function (next) {
  this.populate({
    path: 'user',
    select: 'userName',
  });
  next();
});

// recalculate ratings after saving document
reviewSchema.post(['save'], async function () {
  // we need to access Model.aggregate for this middleware, and you
  // would access it by calling this.constructor.aggregate(), but typescript
  // doesn't know this exists and keeps throwing errors.
  await recalculateAvgRating(this.business);
});

reviewSchema.post(
  /findOneAndDelete|findByIdAndDelete/,
  async function (doc, next) {
    // we have to handle review deletion separately, since this middleware
    // will be attached to a query-like object
    await recalculateAvgRating(doc.business);
  }
);

///// EXPORT IT ALL /////
export { reviewSchema };
