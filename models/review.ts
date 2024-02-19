import mongoose from 'mongoose';
import recalculateAvgRating from '@/lib/recalculateAvgRating';

///// DEFINE INTERFACES /////
export interface IReview {
  business: mongoose.ObjectId;
  user: mongoose.ObjectId;
  rating: number;
  review: string;
  createdAt?: Date;
}

interface IReviewDocument extends IReview, mongoose.Document {
  // instance methods
}
interface IReviewModel extends mongoose.Model<IReviewDocument> {
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

///// MODEL /////
// because we're runing on a serverless framework, it sometimes happens
// that this module is run more than once, and we get an error saying
// 'Cannot overwrite model once compiled'. This short circuit asks for
// the existing model, and if it can't find it, creates a new one.
const Review =
  mongoose.models.Review ||
  mongoose.model<IReviewDocument, IReviewModel>('Review', reviewSchema);
export default Review;
// export types
export type ReviewType = mongoose.InferSchemaType<typeof reviewSchema>;
