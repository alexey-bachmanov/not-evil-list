import mongoose from 'mongoose';
import dbConnect from './dbConnect';
const OLD_ENV = process.env;

describe('dbConnect', () => {
  beforeEach(() => {
    // Reset the cached connection before each test
    delete global.mongoose;
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    // Disconnect from the database after all tests
    mongoose.disconnect();
    process.env = OLD_ENV;
  });

  test('should connect to the database', async () => {
    // Set the required environment variables
    process.env.MONGODB_DB_NAME = 'test';

    // Call the dbConnect function
    const connection = await dbConnect();

    // Check if the connection is established
    expect(connection).toBeDefined();
    expect(connection.readyState).toBe(1); // 1 means the connection is open
  });

  test('should reuse the cached connection', async () => {
    // Set the required environment variables
    process.env.MONGODB_DB_NAME = 'test';

    // Call the dbConnect function twice
    const connection1 = await dbConnect();
    const connection2 = await dbConnect();

    // Check if the same connection is reused
    expect(connection1).toBe(connection2);
  });

  test('should throw an error if MONGODB_URI is not defined', async () => {
    // Clear the required environment variables
    delete process.env.MONGODB_URI;
    delete process.env.MONGODB_DB_NAME;

    // Call the dbConnect function and expect an error
    await expect(dbConnect()).rejects.toThrow(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  });

  test('should throw an error if MONGODB_DB_NAME is not defined', async () => {
    // Set only the MONGODB_URI environment variable
    delete process.env.MONGODB_DB_NAME;

    // Call the dbConnect function and expect an error
    await expect(dbConnect()).rejects.toThrow(
      'Please define the MONGODB_DB_NAME environment variable inside .env.local'
    );
  });
});
