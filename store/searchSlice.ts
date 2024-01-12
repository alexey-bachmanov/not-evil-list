import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const searchSlice = createSlice({
  name: 'searchSlice',
  initialState: {
    query: '',
    results: [],
  },
  reducers: {
    executeSearch(
      state,
      action: PayloadAction<{ query: string; results: [] }>
    ) {
      // since we can't do async tasks in the reducers, the results list
      // is generated asynchrounously in the SearchBar component and stored
      // in the redux state when it becomes available.
      state.query = action.payload.query;
      state.results = action.payload.results;
    },
  },
});

export default searchSlice;
