import { createSlice } from '@reduxjs/toolkit';

const searchSlice = createSlice({
  name: 'searchSlice',
  initialState: {
    searchParameter: '',
  },
  reducers: {
    executeSearch(state, action) {
      state.searchParameter = action.payload;
      console.log(state.searchParameter);
    },
  },
});

export default searchSlice;
