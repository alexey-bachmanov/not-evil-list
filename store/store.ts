import { configureStore } from '@reduxjs/toolkit';

import searchSlice from './searchSlice';

const store = configureStore({
  reducer: {
    search: searchSlice.reducer,
  },
});

export default store;
