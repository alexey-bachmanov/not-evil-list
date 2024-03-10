// imports jest-dom for ALL tests
import '@testing-library/jest-dom';
import dotenv from 'dotenv';

// set up environment variables
dotenv.config({ path: './.env.local' });

// mock mongoDB connection

// suppress jest vs. mongoose warnings
process.env.SUPPRESS_JEST_WARNINGS = 'true';
