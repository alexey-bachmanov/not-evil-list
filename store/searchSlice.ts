import { createSlice } from '@reduxjs/toolkit';

const searchSlice = createSlice({
  name: 'searchSlice',
  initialState: {
    searchParameter: '',
  },
  reducers: {
    executeSearch(state, action) {
      state.searchParameter = action.payload;
    },
  },
});

export default searchSlice;
