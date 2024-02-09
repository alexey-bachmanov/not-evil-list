import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { uiActions } from '.';
import fetchData from '@/lib/fetchData';
import { AppApiRequest, AppApiResponse } from '@/types';

///// THUNKS /////
// Log in
export const login = createAsyncThunk(
  'auth/logIn',
  async (logInInfo: { email: string; password: string }, thunkAPI) => {
    const reply = await fetchData<
      AppApiRequest['login'],
      AppApiResponse['login'] | AppApiResponse['fail']
    >('/api/auth/login', logInInfo, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    // check if username and password were valid
    if (!reply.success) {
      thunkAPI.dispatch(
        uiActions.openAlert({ type: 'error', message: reply.message })
      );
      throw new Error(reply.message);
    }
    // if successful, open a success alert
    thunkAPI.dispatch(
      uiActions.openAlert({
        type: 'success',
        message: 'Successfully logged in',
      })
    );
    return {
      user: reply.data.user,
    };
  }
);

// Log out - this has to be an async thunk since we're calling our API
// to get an empty httpOnly cookie that immediately expires
export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  const reply = await fetchData<
    undefined,
    AppApiResponse['logout'] | AppApiResponse['fail']
  >('/api/auth/logout', undefined, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!reply.success) {
    thunkAPI.dispatch(
      uiActions.openAlert({ type: 'error', message: reply.message })
    );
    throw new Error(reply.message);
  }
  // if successful, show a success alert
  thunkAPI.dispatch(
    uiActions.openAlert({ type: 'success', message: 'Succesfully logged out' })
  );
  return; // nothing to return, we just reset our auth state
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
    // check if the passwords match
    if (logInInfo.password !== logInInfo.passwordConfirm) {
      thunkAPI.dispatch(
        uiActions.openAlert({ type: 'error', message: "Passwords don't match" })
      );
      throw new Error('passwords do not match');
    }
    // send our request to the API
    const reply = await fetchData<
      AppApiRequest['signup'],
      AppApiResponse['signup'] | AppApiResponse['fail']
    >('/api/auth/signup', logInInfo, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    // check if api gave us back any kind of error
    if (!reply.success) {
      thunkAPI.dispatch(
        uiActions.openAlert({ type: 'error', message: reply.message })
      );
      throw new Error(reply.message);
    }
    // if successful, open a success alert
    thunkAPI.dispatch(
      uiActions.openAlert({
        type: 'success',
        message: 'Successfully signed up. Welcome!',
      })
    );
    return {
      user: reply.data.user,
    };
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
  error: string | undefined;
} = {
  status: 'logged out',
  user: {
    _id: '',
    userName: '',
    email: '',
    role: '',
  },
  error: undefined,
};

const authSlice = createSlice({
  name: 'authSlice',
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    // login states
    builder.addCase(login.pending, (state, action) => {
      state.status = 'authorizing';
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.status = 'logged in';
      state.user = action.payload.user;
      state.error = undefined;
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
      state.error = undefined;
    });
    // signup states
    builder.addCase(signup.pending, (state, action) => {
      state.status = 'authorizing';
    });
    builder.addCase(signup.fulfilled, (state, action) => {
      state.status = 'logged in';
      state.user = action.payload.user;
      state.error = undefined;
    });
    builder.addCase(signup.rejected, (state, action) => {
      state.status = 'logged out';
      state.user = initialState.user;
      state.error = action.error.message;
    });
  },
});

export default authSlice;
