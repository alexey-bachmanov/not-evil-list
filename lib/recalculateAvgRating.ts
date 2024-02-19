// this really ought to be a static method or middleware on our Review model
// but mongoose and typescript don't 100% work together, and typescript
// doesn't know about a document's model inside that model's middleware
// so we have to export it out into its own function
import { ObjectId } from 'mongoose';
import Review from '@/models/review';
import Business from '@/models/business';

export default async function recalculateAvgRating(businessId: ObjectId) {
  // re-calculate the average rating using Model.aggregate
  // this should give us an array of average and number of reviews,
  // sorted by businessId, but since we're only matching one businessId,
  // this will be an array of length 1 or 0
  const stats = await Review.aggregate<{
    _id: ObjectId;
    numRatings: number;
    avgRating: number;
  }>([
    {
      // match all reviews where businessID matches provided ID
      $match: { business: businessId },
    },
    {
      // aggregate into an object shaped like the generic we fed in
      $group: {
        _id: '$business', // should just be the businessId we fed in
        numRatings: { $sum: 1 }, // sum of all ratings matching businessId
        avgRating: { $avg: '$rating' }, // average of all ratings matching businessId
      },
    },
  ]);

  if (stats.length > 0) {
    // if the business has at least one review
    // we use findByIdAndUpdate because we want to skip the business model's
    // pre-save middleware (no need to recalculate coordinates)
    await Business.findByIdAndUpdate(businessId, {
      ratingAvg: stats[0].avgRating,
      ratingQty: stats[0].numRatings,
    });
  } else {
    // handle the last review being deleted
    await Business.findByIdAndUpdate(businessId, {
      ratingAvg: 4.5,
      ratingQty: 0,
    });
  }
}
