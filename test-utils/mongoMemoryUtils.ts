import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import {
  Business,
  IBusiness,
  IBusinessDocument,
  User,
  IUser,
  IUserDocument,
  Review,
  IReview,
  IReviewDocument,
} from '@/models';
import mocks from './mockDbEntries';

let mongod: any;

// connect to in-memory database
export async function openDatabase() {
  // create the memory server ag get its uri
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  // set uri and db name to environment variables
  // process.env.MONGODB_URI = uri;
  // process.env.MONGODB_DB_NAME = '';

  // if we alrady have a connection open, throw an error
  if (mongoose.connections[0].readyState) {
    throw new Error(
      'Attempting to create new mongo memory server when a server is already running'
    );
  }

  // fire up the initial connection, using our environment variables
  await mongoose.connect(uri, { dbName: '' });
}

// drop database, close connection, and stop mongod
export async function closeDatabase() {
  if (mongod) {
    // drop everything from the fake database
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    // terminate the process
    await mongod.stop();
    // reset mongod so other checks in this module know it's closed
    mongod = undefined;
  }
}

// clear all data in the database
export async function clearDatabase() {
  if (mongod) {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany();
    }
  }
}

// prime the database with a few entries
export async function primeDatabase() {
  // FOR GOD'S SAKE, ONLY DO THIS WITH THE FAKE DATABASE
  // I CANNOT EMPHASIZE THIS ENOUGH
  if (mongod) {
    // clear all current database entries
    await clearDatabase();

    // create businesses
    const business1: IBusinessDocument = new Business<IBusiness>(
      mocks.business1
    );
    await business1.save();
    const business2: IBusinessDocument = new Business<IBusiness>(
      mocks.business2
    );
    await business2.save();

    // create users
    const user: IUserDocument = new User<IUser>(mocks.user);
    await user.save();
    const admin: IUserDocument = new User<IUser>(mocks.admin);
    await admin.save();

    // create reviews
    const review1: IReviewDocument = new Review<IReview>({
      ...mocks.review1,
      business: business1._id,
      user: user._id,
    });
    await review1.save();
    const review2: IReviewDocument = new Review<IReview>({
      ...mocks.review2,
      business: business2._id,
      user: user._id,
    });
    await review2.save();
  }
}
