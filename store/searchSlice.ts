import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { uiActions } from '.';
import { IBusinessDocument } from '@/models';
import { ObjectId } from 'mongoose';
import api from '@/lib/apiService';

///// THUNKS /////
// async thunks do async stuff and then dispatch actions to update our state
// get a list of businesses that match the search query
export const executeSearch = createAsyncThunk(
  'search/executeSearch',
  async (query: string, thunkAPI) => {
    try {
      // close the details drawer, if it's open
      thunkAPI.dispatch(uiActions.setDetailsDrawerOpen(false));
      const businesses = await api.businesses.getAll(query);
      return { query, results: businesses };
    } catch (err: any) {
      throw err;
    }
  }
);
// get details about a specific business, by its mongo ID
export const getDetails = createAsyncThunk(
  'search/getDetails',
  async (id: string) => {
    try {
      const business = await api.businesses.get(id);
      return business;
    } catch (err: any) {
      throw err;
    }
  }
);

///// SLICE CREATION /////
const initialState: {
  searchQuery: string;
  results: IBusinessDocument[];
  status: 'idle' | 'loading' | 'success' | 'failure';
  error: string | undefined;
  businessDetails: {
    status: 'idle' | 'loading' | 'success' | 'failure';
    details: IBusinessDocument | undefined;
    error: string | undefined;
  };
} = {
  searchQuery: '',
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
  name: 'search',
  initialState: initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
  },
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
        // save our search query for later (eg reloading after edits)
        state.searchQuery = action.payload.query;
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
        state.businessDetails.details = action.payload;
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
