import { configureStore } from '@reduxjs/toolkit';
import searchSlice from './searchSlice';

import React from 'react';
import { Provider } from 'react-redux';

///// STORE COMPOSITION /////
export const store = configureStore({
  reducer: {
    search: searchSlice.reducer,
  },
});

///// PROVIDER /////
export const ReduxProvider: React.FC<{ children: React.ReactNode }> =
  function ({ children }) {
    return <Provider store={store}>{children}</Provider>;
  };
