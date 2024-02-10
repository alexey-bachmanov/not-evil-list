import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { uiActions } from '.';
import fetchData from '@/lib/fetchData';
import { AppApiResponse } from '@/types';

///// THUNKS /////
// edit a business
export const editBusiness = createAsyncThunk(
  'admin/editBusiness',
  async () => {}
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
    // if successful, open a success alert and close details drawer
    thunkAPI.dispatch(
      uiActions.openAlert({
        type: 'success',
        message: 'Business successfully deleted',
      })
    );
    thunkAPI.dispatch(uiActions.setDetailsDrawerOpen(false));
  }
);

// delete a business
export const approveBusiness = createAsyncThunk(
  'admin/approveBusiness',
  async (businessId: string | undefined, thunkAPI) => {}
);

///// SLICE CREATION /////
const initialState: {
  isInAdminMode: boolean;
} = {
  isInAdminMode: false,
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
