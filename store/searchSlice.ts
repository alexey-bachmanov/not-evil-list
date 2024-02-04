import { BusinessDataEntry, BusinessDetails } from '@/types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { uiActions } from '.';

///// THUNKS /////
// async thunks do async stuff and then dispatch actions to update our state
// get a list of businesses that match the search query
export const executeSearch = createAsyncThunk(
  'search/executeSearch',
  async (query: string, thunkAPI) => {
    // we don't want to use a try/catch block here, as normal, because
    // we want our errors to percolate up to the reducer
    // close the details drawer, if it's open
    thunkAPI.dispatch(uiActions.setDetailsDrawerOpen(false));
    // fetch list of businesses from our API
    const response = await fetch('/api/businesses', {
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
// get details about a specific business, by its mongo ID
export const getDetails = createAsyncThunk(
  'search/getDetails',
  async (id: string) => {
    const response = await fetch(`/api/businesses/${id}`, { method: 'GET' });
    // parse the response
    const responseParsed = await response.json();
    return { result: responseParsed.data.business };
  }
);

///// SLICE CREATION /////
const initialState: {
  results: BusinessDataEntry[];
  status: 'idle' | 'loading' | 'success' | 'failure';
  error: string | undefined;
  businessDetails: {
    status: 'idle' | 'loading' | 'success' | 'failure';
    details: BusinessDetails | undefined;
    error: string | undefined;
  };
} = {
  results: [],
  status: 'idle',
  error: undefined,
  businessDetails: {
    status: 'idle',
    details: undefined,
    error: undefined,
  },
};

const searchSlice = createSlice({
  name: 'searchSlice',
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    // extraReducers handles actions from things not defined in our
    // slice's reducers, like async thunks
    // search execution:
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
    // getting details:
    builder.addCase(getDetails.pending, (state, action) => {
      state.businessDetails.status = 'loading';
    });
    builder.addCase(getDetails.fulfilled, (state, action) => {
      state.businessDetails.status = 'success';
      state.businessDetails.details = action.payload.result;
    });
    builder.addCase(getDetails.rejected, (state, action) => {
      state.businessDetails.status = 'failure';
      state.businessDetails.error = action.error.message;
    });
  },
});

export default searchSlice;
