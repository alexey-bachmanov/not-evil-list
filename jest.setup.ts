// imports jest-dom for ALL tests
import '@testing-library/jest-dom';
import dotenv from 'dotenv';
import { TextEncoder, TextDecoder } from 'util';

// hacks to allow testing environment to read plain .ts files
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// set up environment variables
dotenv.config({ path: './.env.local' });

// suppress jest vs. mongoose warnings
process.env.SUPPRESS_JEST_WARNINGS = 'true';
