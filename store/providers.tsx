// compose all providers (redux, theme, etc) into one big provider
import React from 'react';
import { ReduxProvider } from './store';
import AppThemeProvider from '@/styles/theme';

// since layout.tsx can't be a client component, Providers will have to
// be declared in every page.tsx (boo)
const Providers: React.FC<{ children: React.ReactNode }> = function ({
  children,
}) {
  return (
    <ReduxProvider>
      <AppThemeProvider>{children}</AppThemeProvider>
    </ReduxProvider>
  );
};

export default Providers;
