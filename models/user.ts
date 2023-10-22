import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({});

///// MIDDLEWARE /////

///// MODEL /////
// because we're runing on a serverless framework, it sometimes happens
// that this module is run more than once, and we get an error saying
// 'Cannot overwrite model once compiled'. This short circuit asks for
// the existing model, and if it can't find it, creates a new one.
const User = mongoose.models.user || mongoose.model('User', userSchema);
export default User;
