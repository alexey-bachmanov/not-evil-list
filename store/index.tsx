import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

// slice imports
import searchSlice from './searchSlice';
import authSlice from './authSlice';
import uiSlice from './uiSlice';

///// STORE COMPOSITION /////
export const store = configureStore({
  reducer: {
    search: searchSlice.reducer,
    auth: authSlice.reducer,
    ui: uiSlice.reducer,
  },
});

export const searchActions = searchSlice.actions;
export const authActions = authSlice.actions;
export const uiActions = uiSlice.actions;

// export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

///// PROVIDER /////
export const ReduxProvider: React.FC<{ children: React.ReactNode }> =
  function ({ children }) {
    return <Provider store={store}>{children}</Provider>;
  };
