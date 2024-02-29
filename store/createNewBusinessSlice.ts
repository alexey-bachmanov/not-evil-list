import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Tag } from '@/types';
import fetchData from '@/lib/fetchData';
import { AppApiRequest, AppApiResponse } from '@/types';
import { uiActions } from '.';

///// THUNKS /////
// validate - called every time one of the form inputs blurs
export const validate = createAsyncThunk(
  'createNewBusiness/validateBusiness',
  (formData: {
    companyName: string;
    address: string;
    addressCity: string;
    addressState: string;
    phone: string;
    website: string;
    description: string;
    tags: Tag[];
  }) => {
    const helperText: typeof initialState.helperText = {
      companyName: '',
      address: '',
      addressCity: '',
      addressState: '',
      phone: '',
      website: '',
      description: '',
      tags: '',
    };
    // company name
    if (!formData.companyName) {
      helperText.companyName = 'Please enter a company name';
    }
    // address
    if (!formData.address) {
      helperText.address = 'Please enter an address';
    }
    if (!formData.addressCity) {
      helperText.addressCity = 'Please enter a city';
    }
    if (!formData.addressState) {
      helperText.addressState = 'Please enter a state';
    }
    // phone
    if (!formData.phone) {
      helperText.phone = 'Please enter a phone number';
    }
    // website
    // website is optional, and creating a library to check for url validity
    // is beyond the scope of this project, so we're leaving this empty
    // description
    if (!formData.description) {
      helperText.description = 'Please enter a description for the business';
    }
    // tags
    if (formData.tags.length === 0) {
      helperText.tags = 'Please enter at least one tag';
    }
    return helperText;
  }
);

// submit - called on form submission
export const submit = createAsyncThunk(
  'createNewBusiness/submitBusiness',
  async (
    formData: {
      companyName: string;
      address: string;
      addressCity: string;
      addressState: string;
      phone: string;
      website: string;
      description: string;
      tags: Tag[];
    },
    thunkAPI
  ) => {
    // format phone number [+1 (555) 555-5555]=>[5555555555]
    const unformattedPhoneNum = formData.phone.replace(/\D/g, '').slice(-10);
    const reply = await fetchData<
      AppApiRequest['postNewBusiness'],
      AppApiResponse['postNewBusiness'] | AppApiResponse['fail']
    >(
      '/api/businesses',
      { ...formData, phone: unformattedPhoneNum },
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    if (!reply.success) {
      thunkAPI.dispatch(
        uiActions.openAlert({
          type: 'error',
          message: 'Failed to submit. Try again later',
        })
      );
      throw new Error('Failed to submit');
    } else {
      thunkAPI.dispatch(
        uiActions.openAlert({
          type: 'success',
          message: 'Business submitted to the database. Thank you!',
        })
      );
    }
    return;
  }
);

///// SLICE CREATION /////
const initialState: {
  status: 'idle' | 'submitting' | 'done';
  helperText: {
    companyName: string;
    address: string;
    addressCity: string;
    addressState: string;
    phone: string;
    website: string;
    description: string;
    tags: string;
  };
} = {
  status: 'idle',
  helperText: {
    companyName: '',
    address: '',
    addressCity: '',
    addressState: '',
    phone: '',
    website: '',
    description: '',
    tags: '',
  },
};

const createNewBusinessSlice = createSlice({
  name: 'createNewBusinessSlice',
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(validate.fulfilled, (state, action) => {
      state.helperText = action.payload;
    });
    builder.addCase(submit.pending, (state) => {
      state.status = 'submitting';
    });
    builder.addCase(submit.fulfilled, (state) => {
      state.status = 'done';
      state.helperText = initialState.helperText;
    });
    builder.addCase(submit.rejected, (state) => {
      state.status = 'idle';
    });
  },
});

export default createNewBusinessSlice;
