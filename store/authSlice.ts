import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { uiActions } from '.';
import api from '@/lib/apiService';

///// THUNKS /////
// Log in
export const login = createAsyncThunk(
  'auth/login',
  async (logInInfo: { email: string; password: string }, thunkAPI) => {
    try {
      const user = await api.auth.login(logInInfo);
      // if successful, show a success alert
      thunkAPI.dispatch(
        uiActions.openAlert({
          type: 'success',
          message: 'Succesfully logged in',
        })
      );
      return user;
    } catch (err: any) {
      thunkAPI.dispatch(
        uiActions.openAlert({ type: 'error', message: err.message })
      );
      throw err;
    }
  }
);

// Log out - this has to be an async thunk since we're calling our API
// to get an empty httpOnly cookie that immediately expires
export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await api.auth.logout();
    // if successful, show a success alert
    thunkAPI.dispatch(
      uiActions.openAlert({
        type: 'success',
        message: 'Succesfully logged out',
      })
    );
    return; // nothing to return, we just reset our auth state
  } catch (err: any) {
    thunkAPI.dispatch(
      uiActions.openAlert({ type: 'error', message: err.message })
    );
    throw err;
  }
});

// Sign up
export const signup = createAsyncThunk(
  'auth/signup',
  async (
    logInInfo: {
      email: string;
      userName: string;
      password: string;
      passwordConfirm: string;
    },
    thunkAPI
  ) => {
    try {
      // check if the passwords match
      if (logInInfo.password !== logInInfo.passwordConfirm) {
        throw new Error('Passwords do not match');
      }
      const user = await api.auth.signup(logInInfo);
      // if successful, show a success alert
      thunkAPI.dispatch(
        uiActions.openAlert({
          type: 'success',
          message: 'Succesfully signed up. Welcome!',
        })
      );
      return user;
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
  status: 'authorizing' | 'logged in' | 'logged out';
  user: {
    _id: string;
    userName: string;
    email: string;
    role: string;
  };
  error: string | null | undefined;
} = {
  status: 'logged out',
  user: {
    _id: '',
    userName: '',
    email: '',
    role: '',
  },
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    // login states
    builder.addCase(login.pending, (state, action) => {
      state.status = 'authorizing';
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.status = 'logged in';
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.status = 'logged out';
      state.user = initialState.user;
      state.error = action.error.message;
    });
    // logout states (really it should always succeed)
    builder.addCase(logout.fulfilled, (state, action) => {
      state.status = 'logged out';
      state.user = initialState.user;
      state.error = null;
    });
    // signup states
    builder.addCase(signup.pending, (state, action) => {
      state.status = 'authorizing';
    });
    builder.addCase(signup.fulfilled, (state, action) => {
      state.status = 'logged in';
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(signup.rejected, (state, action) => {
      state.status = 'logged out';
      state.user = initialState.user;
      state.error = action.error.message;
    });
  },
});

export default authSlice;
