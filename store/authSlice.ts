import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

///// THUNKS /////
// Log in
export const login = createAsyncThunk(
  'auth/logIn',
  async (logInInfo: { email: string; password: string }) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logInInfo),
    });
    if (!response) {
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
      throw new Error(responseParsed.message);
    }
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
export const logout = createAsyncThunk('auth/logout', async () => {
  const response = await fetch('/api/auth/logout', { method: 'POST' });
  if (!response) {
    throw new Error('No response recieved');
  }
  const responseParsed = await response.json();
  if (!responseParsed.success) {
    throw new Error(responseParsed.message);
  }
  return; // nothing to return, we just reset our auth state
});

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
    builder.addCase(logout.fulfilled, (state, action) => {
      state.status = 'logged out';
      state.user = initialState.user;
      state.error = '';
    });
  },
});

export default authSlice;
