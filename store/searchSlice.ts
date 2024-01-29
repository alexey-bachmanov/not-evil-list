import { BusinessDataEntry } from '@/types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

///// THUNKS /////
// async thunks do async stuff and then dispatch actions to update our state
export const executeSearch = createAsyncThunk(
  'search/executeSearch',
  async (query: string) => {
    // we don't want to use a try/catch block here, as normal, because
    // we want our errors to percolate up to the reducer
    // fetch list of businesses from our API
    const response = await fetch('/api/businessesZ', {
      method: 'GET',
      headers: {
        'search-query': query,
      },
    });
    // parse the response data
    const responseParsed = await response.json();
    // pass results up to redux state
    return {
      results: responseParsed.data.businesses,
    };
  }
);

///// SLICE CREATION /////
const initialState: {
  results: BusinessDataEntry[];
  status: 'idle' | 'loading' | 'success' | 'failure';
  error: string | undefined;
} = {
  results: [],
  status: 'idle',
  error: undefined,
};

const searchSlice = createSlice({
  name: 'searchSlice',
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    // extraReducers handles actions from things not defined in our
    // slice's reducers, like async thunks
    builder.addCase(executeSearch.pending, (state, action) => {
      state.status = 'loading';
    });
    builder.addCase(executeSearch.fulfilled, (state, action) => {
      state.status = 'success';
      // add search results to our results array
      state.results = action.payload.results;
    });
    builder.addCase(executeSearch.rejected, (state, action) => {
      state.status = 'failure';
      // addd failure message to our state
      state.error = action.error.message;
    });
  },
});

export default searchSlice;
