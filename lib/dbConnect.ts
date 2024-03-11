// utility function that triggers DB connection in preparation for
// api handlers to do whatever it is they're gonna do
import mongoose from 'mongoose';

// since mongoose is written in JS and not TS, we need to let TS know
// that the variable mongoose exists. We would declare the actual shape
// of the mongoose object, but no such type exists for us to import.

// we also want to declare mongoose as a GLOBAL variable, that'll stay
// in the namespace for the duration that our Next.js app is running.
declare global {
  var mongoose: any; // This must be a `var` and not a `let / const`
}

async function dbConnect() {
  // pull mongo connection string from .env.local, make sure you actually
  // have a .env.local to pull it from
  const MONGODB_URI = process.env.MONGODB_URI!;
  if (MONGODB_URI === undefined) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }

  // do the same with the database name
  const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME!;
  if (MONGODB_DB_NAME === undefined) {
    throw new Error(
      'Please define the MONGODB_DB_NAME environment variable inside .env.local'
    );
  }

  // cached is the actual object we'll be working with. If you connected to
  // mongoose earlier, the cached connection will be stored in the global
  // mongoose object, and we can just use that. Otherwise, we need to
  // initialize a null connection, so we can define it further down
  let cached = global.mongoose;
  if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
  }

  // if you're already connected to DB, just use that connection
  if (cached.conn) {
    // return your existing connection
    return cached.conn;
  }
  // if you're not connected, create a mongoose connection promise
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      autoCreate: false,
      dbName: MONGODB_DB_NAME,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  // wait for the promise to be resolved. Throw an error if it isn't. Use that
  // resolved promise as your connection from now on.
  try {
    cached.conn = await cached.promise;
    if (process.env.NODE_ENV === 'development') {
      // only log this in dev mode, not in production or testing
      console.log('connected to mongoDB!');
    }
  } catch (err) {
    cached.promise = null;
    throw err;
  }
  // return your brand new connection
  return cached.conn;
}

export default dbConnect;
