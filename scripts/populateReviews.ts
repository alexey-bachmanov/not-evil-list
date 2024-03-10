// this CLI utility will pull a list of all businesses, all users (that aren't admins),
// and create a randomly generated review for each user-business combo
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import {
  User,
  Review,
  Business,
  IUserDocument,
  IReview,
  IReviewDocument,
  IBusinessDocument,
} from '@/models/index.ts';

///// ENVIRONMENT VARiABLES /////
dotenv.config({ path: './.env.local' });

///// UTILITY FUNCTIONS /////
const pickRandomEntryFromArray = function <T>(arr: T[]): T {
  // handle edge case of an empty array
  if (arr.length === 0) {
    throw new Error('Cannot pick random entry from an empty array');
  }
  const randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex];
};

///// DATA FOR RANDOM REVIEWS /////
// believable-looking histogram of review values
const ratings = [
  1, 1, 1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5,
  5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
];
const reviewTexts = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  'Dolor purus non enim praesent elementum facilisis leo vel. Turpis egestas integer eget aliquet nibh praesent tristique magna sit. Id nibh tortor id aliquet lectus.',
  'Aliquam nulla facilisi cras fermentum odio eu feugiat pretium. Faucibus pulvinar elementum integer enim neque volutpat ac. Lectus mauris ultrices eros in cursus turpis massa tincidunt. Cras ornare arcu dui vivamus. Vulputate mi sit amet mauris.',
  'Et ligula ullamcorper malesuada proin libero nunc consequat.',
  'Bibendum neque egestas congue quisque egestas diam in arcu. Sed odio morbi quis commodo odio. Viverra adipiscing at in tellus integer.',
  'Turpis egestas pretium aenean pharetra magna ac. Bibendum est ultricies integer quis auctor elit sed. Duis convallis convallis tellus id. Dolor magna eget est lorem ipsum dolor sit. Tempus imperdiet nulla malesuada pellentesque. Vestibulum lectus mauris ultrices eros. Habitant morbi tristique senectus et netus et malesuada fames.',
  'Scelerisque varius morbi enim nunc faucibus a. Congue quisque egestas diam in. Aliquam ultrices sagittis orci a scelerisque purus semper eget.',
  'Mattis nunc sed blandit libero volutpat sed cras ornare arcu. Enim neque volutpat ac tincidunt vitae semper quis lectus. Sed lectus vestibulum mattis ullamcorper velit. Nec ultrices dui sapien eget mi proin sed.',
  'Integer malesuada nunc vel risus commodo viverra maecenas accumsan lacus. Mi eget mauris pharetra et ultrices neque ornare aenean euismod. Fames ac turpis egestas integer eget aliquet nibh.',
  'Enim tortor at auctor urna nunc id cursus. Nisi scelerisque eu ultrices vitae auctor eu augue ut lectus.',
  'Pellentesque habitant morbi tristique senectus et. Dignissim sodales ut eu sem. Imperdiet dui accumsan sit amet nulla facilisi morbi tempus iaculis. Diam maecenas sed enim ut sem viverra. Commodo odio aenean sed adipiscing diam donec adipiscing.',
  'Commodo sed egestas egestas fringilla phasellus faucibus scelerisque eleifend.',
  'Maecenas volutpat blandit aliquam etiam erat velit. Ut lectus arcu bibendum at varius vel pharetra. Velit egestas dui id ornare arcu odio. Erat imperdiet sed euismod nisi porta lorem mollis aliquam. Vestibulum morbi blandit cursus risus at ultrices.',
  'Ut enim blandit volutpat maecenas volutpat blandit aliquam etiam. Condimentum vitae sapien pellentesque habitant. Scelerisque in dictum non consectetur a. Aliquam nulla facilisi cras fermentum odio eu feugiat pretium. At tellus at urna condimentum mattis pellentesque id nibh tortor. Morbi tincidunt ornare massa eget egestas purus viverra accumsan. Aliquet eget sit amet tellus cras adipiscing enim eu turpis. Lectus arcu bibendum at varius.',
  'Tellus molestie nunc non blandit massa enim nec. Rhoncus est pellentesque elit ullamcorper.',
  'Sem viverra aliquet eget sit amet tellus. Iaculis urna id volutpat lacus laoreet non curabitur. Non nisi est sit amet. Pellentesque id nibh tortor id aliquet lectus. Ipsum faucibus vitae aliquet nec.',
  'Justo donec enim diam vulputate ut. Enim sed faucibus turpis in eu. Volutpat lacus laoreet non curabitur gravida arcu ac. Aliquet eget sit amet tellus cras. Vestibulum lectus mauris ultrices eros in cursus turpis massa tincidunt. Amet consectetur adipiscing elit ut aliquam. Mollis nunc sed id semper risus in hendrerit gravida. Enim nulla aliquet porttitor lacus luctus. Sagittis id consectetur purus ut. Sit amet luctus venenatis lectus magna.',
  'Etiam sit amet nisl purus in. Urna molestie at elementum eu facilisis. Quis blandit turpis cursus in hac habitasse platea dictumst. Turpis cursus in hac habitasse platea dictumst quisque sagittis purus. Faucibus vitae aliquet nec ullamcorper.',
  'Eget dolor morbi non arcu risus quis varius quam quisque.',
  'Amet commodo nulla facilisi nullam vehicula ipsum a. Leo a diam sollicitudin tempor id eu nisl nunc. Lacus sed viverra tellus in hac habitasse platea dictumst vestibulum.',
];
const reviewPercentage = 0.75; // xx% of users will create a review for a business

///// MAIN FUNCTION /////
const main = async function (): Promise<void> {
  // connect to DB
  if (!process.env.MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }
  await mongoose.connect(process.env.MONGODB_URI, {
    bufferCommands: false,
    autoCreate: false,
    dbName: 'Not-Evil-List',
  });
  console.log('Connected to MongoDB...');

  // read all business and user ID's
  const businesses = await Business.find<IBusinessDocument>({}).select('id');
  const users = await User.find<IUserDocument>({
    active: true,
    role: 'user',
  }).select('id');
  const businessIds = businesses.map((business) => business.id);
  const userIds = users.map((user) => user.id);

  // delete all current reviews
  await Review.deleteMany();
  console.log('Review database dropped...');

  // loop over xx% of business-user combinations
  console.log('Creating review documents...');
  const reviews: IReviewDocument[] = [];
  for (const business of businessIds) {
    for (const user of userIds) {
      if (Math.random() <= reviewPercentage) {
        const review: IReviewDocument = new Review<IReview>({
          business: business,
          user: user,
          rating: pickRandomEntryFromArray(ratings),
          review: pickRandomEntryFromArray(reviewTexts),
        });
        reviews.push(review);
      }
    }
  }

  // save the collection to mongoDB
  console.log('Saving documents...');
  await Review.create(reviews);
};

///// RUN /////
main().then(() => {
  console.log('Done!');
  process.exit();
});
