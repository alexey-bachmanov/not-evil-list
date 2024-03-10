import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState, searchActions, uiActions } from '.';
import { Tag } from '@/types';
import api from '@/lib/apiService';
import { unformatPhoneNumber } from '@/lib/phoneFormatUtils';
import { ObjectId } from 'mongoose';

///// THUNKS /////
// edit a business
export const editBusiness = createAsyncThunk(
  'admin/editBusiness',
  async (
    data: {
      businessId: ObjectId;
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
    try {
      await api.businesses.put(data.businessId, {
        ...data.formData,
        phone: unformatPhoneNumber(data.formData.phone),
      });
      // if successful, open a success alert, and reload businesses (which will reset drawer states)
      thunkAPI.dispatch(
        uiActions.openAlert({
          type: 'success',
          message: 'Business successfully updated',
        })
      );
      const searchQuery = (thunkAPI.getState() as RootState).search.searchQuery;
      thunkAPI.dispatch(searchActions.executeSearch(searchQuery));
    } catch (err: any) {
      thunkAPI.dispatch(
        uiActions.openAlert({ type: 'error', message: err.message })
      );
      throw err;
    }
  }
);

// delete a business
export const deleteBusiness = createAsyncThunk(
  'admin/deleteBusiness',
  async (businessId: ObjectId, thunkAPI) => {
    try {
      await api.businesses.delete(businessId);
      // if successful, open a success alert, and reload businesses (which will reset drawer states)
      thunkAPI.dispatch(
        uiActions.openAlert({
          type: 'success',
          message: 'Business successfully deleted',
        })
      );
      const searchQuery = (thunkAPI.getState() as RootState).search.searchQuery;
      thunkAPI.dispatch(searchActions.executeSearch(searchQuery));
    } catch (err: any) {
      thunkAPI.dispatch(
        uiActions.openAlert({ type: 'error', message: err.message })
      );
      throw err;
    }
  }
);

// approve a business
export const approveBusiness = createAsyncThunk(
  'admin/approveBusiness',
  async (_, thunkAPI) => {
    // this will pull all the relevent business details from our redux store, and send a
    // PUT request with all that info and isVerified field flipped to true
    const businessDetails = (thunkAPI.getState() as RootState).search
      .businessDetails.details;
    if (!businessDetails) {
      thunkAPI.dispatch(
        uiActions.openAlert({
          type: 'error',
          message: 'Approve business called without a details window open',
        })
      );
      throw new Error('Approve business called without a details window open');
    }
    try {
      await api.businesses.put(businessDetails._id, {
        ...businessDetails,
        isVerified: true,
      });
      // if successful, open a success alert, and reload search results (which will reset drawer states)
      thunkAPI.dispatch(
        uiActions.openAlert({
          type: 'success',
          message: 'Business verified',
        })
      );
      const searchQuery = (thunkAPI.getState() as RootState).search.searchQuery;
      thunkAPI.dispatch(searchActions.executeSearch(searchQuery));
    } catch (err: any) {
      thunkAPI.dispatch(
        uiActions.openAlert({ type: 'error', message: err.message })
      );
      throw err;
    }
  }
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
  name: 'admin',
  initialState: initialState,
  reducers: {
    setAdminMode(state, action: PayloadAction<boolean>) {
      state.isInAdminMode = action.payload;
    },
  },
  extraReducers(builder) {},
});

export default adminSlice;
