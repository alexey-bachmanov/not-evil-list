import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState, searchActions, uiActions } from '.';
import fetchData from '@/lib/fetchData';
import { AppApiRequest, AppApiResponse, Tag } from '@/types';

///// THUNKS /////
// edit a business
export const editBusiness = createAsyncThunk(
  'admin/editBusiness',
  async (
    data: {
      businessId: string | undefined;
      formData: {
        companyName: string;
        address: string;
        addressCity: string;
        addressState: string;
        phone: string;
        website: string;
        description: string;
        tags: Tag[];
      };
    },
    thunkAPI
  ) => {
    if (!data.businessId) {
      throw new Error('editBusiness was called without an ID');
    }
    const reply = await fetchData<
      AppApiRequest['editBusiness'],
      AppApiResponse['editBusiness'] | AppApiResponse['fail']
    >(`/api/businesses/${data.businessId}`, data.formData, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!reply.success) {
      thunkAPI.dispatch(
        uiActions.openAlert({ type: 'error', message: reply.message })
      );
      throw new Error(reply.message);
    }
    // if successful, open a success alert, and reload search results (which will reset drawer states)
    thunkAPI.dispatch(
      uiActions.openAlert({
        type: 'success',
        message: 'Business successfully updated',
      })
    );
    const searchQuery = (thunkAPI.getState() as RootState).search.searchQuery;
    thunkAPI.dispatch(searchActions.executeSearch(searchQuery));
  }
);

// delete a business
export const deleteBusiness = createAsyncThunk(
  'admin/deleteBusiness',
  async (businessId: string | undefined, thunkAPI) => {
    if (!businessId) {
      throw new Error('deleteBusiness was called without an ID');
    }
    const reply = await fetchData<
      undefined,
      AppApiResponse['deleteBusiness'] | AppApiResponse['fail']
    >(`/api/businesses/${businessId}`, undefined, {
      method: 'DELETE',
    });

    if (!reply.success) {
      thunkAPI.dispatch(
        uiActions.openAlert({ type: 'error', message: reply.message })
      );
      throw new Error(reply.message);
    }
    // if successful, open a success alert, and reload businesses (which will reset drawer states)
    thunkAPI.dispatch(
      uiActions.openAlert({
        type: 'success',
        message: 'Business successfully deleted',
      })
    );
    const searchQuery = (thunkAPI.getState() as RootState).search.searchQuery;
    thunkAPI.dispatch(searchActions.executeSearch(searchQuery));
  }
);

// approve a business
export const approveBusiness = createAsyncThunk(
  'admin/approveBusiness',
  async (businessId: string | undefined, thunkAPI) => {}
);

///// SLICE CREATION /////
const initialState: {
  isInAdminMode: boolean;
  error: string | null;
} = {
  isInAdminMode: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'adminSlice',
  initialState: initialState,
  reducers: {
    setAdminMode(state, action: PayloadAction<boolean>) {
      state.isInAdminMode = action.payload;
    },
  },
  extraReducers(builder) {},
});

export default adminSlice;
