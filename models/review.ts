import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({});

///// MIDDLEWARE /////

///// MODEL /////
const Review = mongoose.model('Review', reviewSchema);
export default Review;
