import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { uiActions } from '.';

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
    const response = await fetch(`/api/businesses/${businessId}`, {
      method: 'DELETE',
    });
    if (!response) {
      thunkAPI.dispatch(
        uiActions.openAlert({ type: 'error', message: 'No response recieved' })
      );
      throw new Error('No response recieved');
    }
    // parse the response data
    const responseParsed = await response.json();
    // data on success:
    // { success: true, data: null },
    // data on failure:
    // { success: false, message: err.message }
    if (!responseParsed.success) {
      thunkAPI.dispatch(
        uiActions.openAlert({ type: 'error', message: responseParsed.message })
      );
      throw new Error(responseParsed.message);
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
    toggleAdminMode(state) {
      state.isInAdminMode = !state.isInAdminMode;
    },
  },
  extraReducers(builder) {},
});

export default adminSlice;
