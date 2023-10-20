import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({});

///// MIDDLEWARE /////

///// MODEL /////
const User = mongoose.model('User', userSchema);
export default User;
