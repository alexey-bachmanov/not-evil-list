import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

// slice imports, including async thunks
import searchSlice, { executeSearch, getDetails } from './searchSlice';
import authSlice, { login, logout, signup } from './authSlice';
import uiSlice from './uiSlice';
import adminSlice, {
  editBusiness,
  deleteBusiness,
  approveBusiness,
} from './adminSlice';

///// STORE COMPOSITION /////
export const store = configureStore({
  reducer: {
    search: searchSlice.reducer,
    auth: authSlice.reducer,
    ui: uiSlice.reducer,
    admin: adminSlice.reducer,
  },
});

export const searchActions = {
  ...searchSlice.actions,
  executeSearch,
  getDetails,
};
export const authActions = { ...authSlice.actions, login, logout, signup };
export const uiActions = uiSlice.actions;
export const adminActions = {
  ...adminSlice.actions,
  editBusiness,
  deleteBusiness,
  approveBusiness,
};

// export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

///// PROVIDER /////
export const ReduxProvider: React.FC<{ children: React.ReactNode }> =
  function ({ children }) {
    return <Provider store={store}>{children}</Provider>;
  };
