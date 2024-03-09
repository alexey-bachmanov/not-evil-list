// imports jest-dom for ALL tests
import '@testing-library/jest-dom';
import dotenv from 'dotenv';
import { server } from './mocks/node';

// set up environment variables
dotenv.config({ path: './.env.local' });

// mock mongoDB connection

// suppress jest vs. mongoose warnings
process.env.SUPPRESS_JEST_WARNINGS = 'true';

// setup mock service worker
beforeAll(() => {
  // Enable API mocking before all the tests.
  server.listen();
});

afterEach(() => {
  // Reset the request handlers between each test.
  // This way the handlers we add on a per-test basis
  // do not leak to other, irrelevant tests.
  server.resetHandlers();
});

afterAll(() => {
  // Finally, disable API mocking after the tests are done.
  server.close();
});
