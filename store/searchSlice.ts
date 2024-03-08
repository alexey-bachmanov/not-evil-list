import { AppApiResponse } from '@/types';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { uiActions } from '.';
import fetchData from '@/lib/fetchData';
import { IBusinessDocument } from '@/models';

///// UTIL FUNCTIONS /////
const stringToQueryString = (inputString: string) => {
  // format for the input string is "restaurants near me -unverified"
  // format for the output is "?search=restaurants+near+me&flags=unverified"
  // handle edge case of empty string
  if (inputString.trim() === '') {
    return '';
  }
  const words = inputString.trim().split(' ');
  const searchWords: string[] = [];
  const flagWords: string[] = [];
  words.forEach((word) => {
    if (word.startsWith('-')) {
      flagWords.push(word.slice(1));
    } else {
      searchWords.push(word);
    }
  });
  const queryStringSearch = searchWords.join('+');
  const queryStringflags = flagWords.join('+');
  let queryString = '';
  // options:
  // queryString = '' (no search or flag words)
  // queryString = '?search=...' (no flag words)
  // queryString = '?flags=...' (no search words)
  // queryString = '?search=...&flags=...' (search and flag words)
  if (searchWords.length > 0 && flagWords.length === 0) {
    queryString = `?search=${queryStringSearch}`;
  }
  if (searchWords.length === 0 && flagWords.length > 0) {
    queryString = `?flags=${queryStringflags}`;
  }
  if (searchWords.length > 0 && flagWords.length > 0) {
    queryString = `?search=${queryStringSearch}&flags=${queryStringflags}`;
  }

  return queryString;
};

///// THUNKS /////
// async thunks do async stuff and then dispatch actions to update our state
// get a list of businesses that match the search query
export const executeSearch = createAsyncThunk(
  'search/executeSearch',
  async (query: string, thunkAPI) => {
    // we don't want to use a try/catch block here, as normal, because
    // we want our errors to percolate up to the reducer
    // turn the natural language query into a REST query string
    const queryString = stringToQueryString(query);
    // close the details drawer, if it's open
    thunkAPI.dispatch(uiActions.setDetailsDrawerOpen(false));
    // fetch list of businesses from our API
    const reply = await fetchData<
      undefined,
      AppApiResponse['getBusinessList'] | AppApiResponse['fail']
    >(`/api/businesses${queryString}`, undefined, { method: 'GET' });
    // pass results up to redux state
    if (!reply.success) {
      throw new Error(reply.message);
    }
    return {
      query: query,
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
