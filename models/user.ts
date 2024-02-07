import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import ApiError from '@/lib/apiError';

const isEmail = function (val: string) {
  return validator.isEmail(val);
};

const userSchema = new mongoose.Schema({
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

///// MODEL /////
// because we're runing on a serverless framework, it sometimes happens
// that this module is run more than once, and we get an error saying
// 'Cannot overwrite model once compiled'. This short circuit asks for
// the existing model, and if it can't find it, creates a new one.
const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
// export types
export type User = mongoose.InferSchemaType<typeof userSchema>;
