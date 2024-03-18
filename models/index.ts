// we define all our models in one file so they are all *registered* at the
// same time. This prevents one-off incidents where, eg, the business model is
// defined, but the review model isn't yet, leading to issues when we try and populate
// a business document with reviews, or try and populate a review with user info.
import mongoose from 'mongoose';
import { userSchema, IUser, IUserDocument, IUserModel } from './user';
import { reviewSchema, IReview, IReviewDocument, IReviewModel } from './review';
import {
  businessSchema,
  IBusiness,
  IBusinessDocument,
  IBusinessModel,
} from './business';

///// MODELS /////
// because we're runing on a serverless framework, it sometimes happens
// that this module is run more than once, and we get an error saying
// 'Cannot overwrite model once compiled'. This short circuit asks for
// the existing model, and if it can't find it, creates a new one.
export const User =
  mongoose.models?.User ||
  mongoose.model<IUserDocument, IUserModel>('User', userSchema);
export const Review =
  mongoose.models?.Review ||
  mongoose.model<IReviewDocument, IReviewModel>('Review', reviewSchema);
export const Business =
  mongoose.models?.Business ||
  mongoose.model<IBusinessDocument, IBusinessModel>('Business', businessSchema);

///// TYPES /////
// we're going to re-export types here, so the rest of our application
// can just get everything model-related in one place
export type { IUser, IUserDocument, IUserModel };
export type { IReview, IReviewDocument, IReviewModel };
export type { IBusiness, IBusinessDocument, IBusinessModel };
