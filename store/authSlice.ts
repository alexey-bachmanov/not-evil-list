import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { uiActions } from '.';

///// THUNKS /////
// Log in
export const login = createAsyncThunk(
  'auth/logIn',
  async (logInInfo: { email: string; password: string }, thunkAPI) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logInInfo),
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
    // {
    // success: true,
    // data: {
    //   user: {
    //     _id: user._id,
    //     userName: user.userName,
    //     email: user.email,
    //     role: user.role,
    //   },
    // },
    // data on failure:
    // { success: false, message: err.message }
    // check if username and password were valid
    if (!responseParsed.success) {
      thunkAPI.dispatch(
        uiActions.openAlert({ type: 'error', message: responseParsed.message })
      );
      throw new Error(responseParsed.message);
    }
    // if successful, open a success alert
    thunkAPI.dispatch(
      uiActions.openAlert({
        type: 'success',
        message: 'Successfully logged in',
      })
    );
    return {
      user: {
        _id: responseParsed.data.user._id,
        userName: responseParsed.data.user.userName,
        email: responseParsed.data.user.email,
        role: responseParsed.data.user.role,
      },
    };
  }
);

// Log out - this has to be an async thunk since we're calling our API
// to get an empty httpOnly cookie that immediately expires
export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  const response = await fetch('/api/auth/logout', { method: 'POST' });
  if (!response) {
    thunkAPI.dispatch(
      uiActions.openAlert({ type: 'error', message: 'No response recieved' })
    );
    throw new Error('No response recieved');
  }
  const responseParsed = await response.json();
  if (!responseParsed.success) {
    thunkAPI.dispatch(
      uiActions.openAlert({ type: 'error', message: responseParsed.message })
    );
    throw new Error(responseParsed.message);
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
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logInInfo),
    });
    if (!response) {
      thunkAPI.dispatch(
        uiActions.openAlert({ type: 'error', message: 'No response recieved' })
      );
      throw new Error('No response recieved');
    }
    const responseParsed = await response.json();
    // data on success:
    // {
    // success: true,
    // data: {
    //   user: {
    //     _id: user._id,
    //     userName: user.userName,
    //     email: user.email,
    //     role: user.role,
    //   },
    // },
    // data on failure:
    // { success: false, message: err.message }
    // check if api gave us back any kind of error
    if (!responseParsed.success) {
      thunkAPI.dispatch(
        uiActions.openAlert({ type: 'error', message: responseParsed.message })
      );
      throw new Error(responseParsed.message);
    }
    // if successful, open a success alert
    thunkAPI.dispatch(
      uiActions.openAlert({
        type: 'success',
        message: 'Successfully signed up. Welcome!',
      })
    );
    return {
      user: {
        _id: responseParsed.data.user._id,
        userName: responseParsed.data.user.userName,
        email: responseParsed.data.user.email,
        role: responseParsed.data.user.role,
      },
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
