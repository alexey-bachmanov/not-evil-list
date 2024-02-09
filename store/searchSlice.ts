import { AppApiResponse, BusinessDataEntry, BusinessDetails } from '@/types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { uiActions } from '.';
import { fetchData } from '@/lib/fetchData';
import { BusinessType } from '@/models/business';

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
    // fetch list of businesses from our API, search query is passed in the headers
    // and the body is empty
    const reply = await fetchData<
      undefined,
      AppApiResponse['getBusinessList'] | AppApiResponse['fail']
    >('/api/businesses', undefined, {
      method: 'GET',
      headers: { 'search-query': query },
    });
    // pass results up to redux state
    if (!reply.success) {
      throw new Error(reply.message);
    }
    return {
      results: reply.data.businesses,
    };
  }
);
// get details about a specific business, by its mongo ID
export const getDetails = createAsyncThunk(
  'search/getDetails',
  async (id: string) => {
    const reply = await fetchData<
      undefined,
      AppApiResponse['getBusinessDetails'] | AppApiResponse['fail']
    >(`/api/businesses/${id}`, undefined, { method: 'GET' });
    if (!reply.success) {
      throw new Error(reply.message);
    }
    return { result: reply.data.business };
  }
);

///// SLICE CREATION /////
const initialState: {
  results: BusinessType[];
  status: 'idle' | 'loading' | 'success' | 'failure';
  error: string | undefined;
  businessDetails: {
    status: 'idle' | 'loading' | 'success' | 'failure';
    details: BusinessType | undefined;
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
    builder.addCase(
      executeSearch.pending,
      (state: typeof initialState, action) => {
        state.status = 'loading';
      }
    );
    builder.addCase(
      executeSearch.fulfilled,
      (state: typeof initialState, action) => {
        state.status = 'success';
        // add search results to our results array
        state.results = action.payload.results;
      }
    );
    builder.addCase(
      executeSearch.rejected,
      (state: typeof initialState, action) => {
        state.status = 'failure';
        // addd failure message to our state
        state.error = action.error.message;
      }
    );
    // getting details:
    builder.addCase(
      getDetails.pending,
      (state: typeof initialState, action) => {
        state.businessDetails.status = 'loading';
      }
    );
    builder.addCase(
      getDetails.fulfilled,
      (state: typeof initialState, action) => {
        state.businessDetails.status = 'success';
        state.businessDetails.details = action.payload.result;
      }
    );
    builder.addCase(
      getDetails.rejected,
      (state: typeof initialState, action) => {
        state.businessDetails.status = 'failure';
        state.businessDetails.error = action.error.message;
      }
    );
  },
});

export default searchSlice;
