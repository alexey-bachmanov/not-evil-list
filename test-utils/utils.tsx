// import render, and export a version that wraps all tests in our context provider
import React from 'react';
import { render } from '@testing-library/react';
import Providers from '@/store/providers';

const renderWithProviders = (ui: React.ReactNode, options?: any) => {
  return render(ui, { wrapper: Providers, ...options });
};

// re-export everything, but override render
export * from '@testing-library/react';
export { renderWithProviders as render };

// this way, import { render, screen } from './utils.jsx'
// will export our modified render, but the original screen from RTL
