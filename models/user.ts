import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import ApiError from '@/lib/apiError';

// wrapper function for validator isEmail
// avoids schema errors
const isEmail = function (val: string) {
  return validator.isEmail(val);
};

///// DEFINE INTERFACES /////
// define the basic interface for our model
export interface IUser {
  userName: string;
  email: string;
  role: 'user' | 'admin';
  password: string;
  passwordConfirm?: string;
  active?: boolean;
}
// extend it to include instance methods and values like '_id'
export interface IUserDocument extends IUser, mongoose.Document<string> {
  // instance methods
  passwordMatch: (
    candidatepassword: string,
    hashedpassword: string
  ) => Promise<boolean>;
}
export interface IUserModel extends mongoose.Model<IUserDocument> {
  // static methods
}

///// DEFINE SCHEMA /////
const userSchema = new mongoose.Schema<IUserDocument>({
  userName: {
    type: String,
    trim: true,
    required: [true, 'User name is required'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: isEmail,
      message: 'Valid email is required',
    },
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
    // make sure it never shows up in queries
    select: false,
  },
  passwordConfirm: {
    // only included for password confirmation, deleted in middleware
    // required INPUT, but not required to actually be in the database
    type: String,
    required: [true, 'Password is required'],
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

///// MIDDLEWARE /////
// check if password and passwordConfirm match
userSchema.pre('save', async function (next) {
  if (this.password !== this.passwordConfirm) {
    throw new ApiError('Passwords do not match', 400);
  }
  next();
});
// password encryption
userSchema.pre('save', async function (next) {
  // hash password
  this.password = await bcrypt.hash(this.password, 12);
  // delete password confirm field
  this.passwordConfirm = undefined;
  next();
});

///// INSTANCE METHODS /////
// check password
userSchema.methods.passwordMatch = async function (
  candidatepassword: string,
  hashedpassword: string
) {
  return await bcrypt.compare(candidatepassword, hashedpassword);
};

///// EXPORT IT ALL /////
export { userSchema };
