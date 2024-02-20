import mongoose from 'mongoose';
import recalculateAvgRating from '@/lib/recalculateAvgRating';

///// DEFINE INTERFACES /////
export interface IReview {
  business: mongoose.ObjectId;
  user: mongoose.ObjectId | { _id: mongoose.ObjectId; userName: string };
  rating: number;
  review: string;
  createdAt?: Date;
}

export interface IReviewDocument extends IReview, mongoose.Document {
  // instance methods
}
export interface IReviewModel extends mongoose.Model<IReviewDocument> {
  // static methods
}

///// DEFINE SCHEMA /////
const reviewSchema = new mongoose.Schema<IReviewDocument>(
  {
    business: {
      type: mongoose.Schema.ObjectId,
      ref: 'Business',
    },
    user: {
      type: mongoose.Schema.ObjectId,
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
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

///// MIDDLEWARE /////
// populate user data on query
// this only works on the Model.find() method, since we won't need
// this info on e.g. findOneAndUpdate
reviewSchema.pre('find', function (next) {
  this.populate({
    path: 'user',
    select: 'userName',
  });
  next();
});

// recalculate ratings after saving document
reviewSchema.post('save', async function () {
  // we need to access Model.aggregate for this middleware, and you
  // would access it by calling this.constructor.aggregate(), but typescript
  // doesn't know this exists and keeps throwing errors.
  await recalculateAvgRating(this.business);
});

///// EXPORT IT ALL /////
export { reviewSchema };
