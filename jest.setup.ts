import '@testing-library/jest-dom'; // imports jest-dom for ALL tests
import { TextEncoder, TextDecoder } from 'util';
import dotenv from 'dotenv';

// set up environment variables
dotenv.config({ path: './.env.local' });

// suppress jest vs. mongoose warnings
process.env.SUPPRESS_JEST_WARNINGS = 'true';

// hack TextEncoder and TextDecoder back into jest's weird jsdom environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;
