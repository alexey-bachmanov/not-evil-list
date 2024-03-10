import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { uiActions, RootState, authActions } from '.';
import validator from 'validator';

///// THUNKS /////
// validate - this contains all the front-end form validation logic
// we want to re-evaluate everything except globalError to give prompt feedback
// globalError should stay up so user can reference it re-filling out the form
export const validate = createAsyncThunk(
  'loginDialog/validate',
  (
    loginInfo: {
      email: string;
      userName: string;
      password: string;
      passwordConfirm: string;
    },
    thunkAPI
  ) => {
    const state = thunkAPI.getState() as RootState;
    const helperText: typeof initialState.helperText = {
      email: '',
      userName: '',
      password: '',
      passwordConfirm: '',
      globalError: state.loginDialog.helperText.globalError,
    };
    // email validation
    if (loginInfo.email && !validator.isEmail(loginInfo.email)) {
      helperText.email = 'Please enter a valid email address';
    }
    // password validation
    // this can get super complex, but we'll just make it 8+ letters
    if (loginInfo.password && loginInfo.password.length < 8) {
      helperText.password =
        'Please enter a password at least 8 characters long';
    }
    // password-passwordConfirm match
    if (
      loginInfo.password &&
      loginInfo.passwordConfirm &&
      loginInfo.password !== loginInfo.passwordConfirm
    ) {
      helperText.passwordConfirm = 'Passwords do not match';
    }
    return helperText;
  }
);

// submit - coordinates actions related to hitting the 'submit' button
// on the login dialog, i.e. auth calls, showing errors, closing the dialog, etc.
export const submit = createAsyncThunk(
  'loginDialog/submit',
  async (
    loginInfo: {
      email: string;
      userName: string;
      password: string;
      passwordConfirm: string;
    },
    thunkAPI
  ) => {
    // read redux state
    const state = thunkAPI.getState() as RootState;
    // check if this is a login or signup request
    const result: any =
      state.loginDialog.type === 'login'
        ? // if login, dispatch authActions.login
          await thunkAPI.dispatch(authActions.login(loginInfo))
        : // if signup, dispatch authActions.signup
          await thunkAPI.dispatch(authActions.signup(loginInfo));
    if (result.meta.requestStatus === 'rejected') {
      throw new Error(result.error?.message);
    }
    // if you made it here, the auth call was succesful and
    // we should display an alert (handled in authSlice)
    // we should close the dialog (handled in extraReducers)
    return;
  }
);

///// SLICE CREATION /////
const initialState: {
  isOpen: boolean;
  type: 'login' | 'signup';
  helperText: {
    email: string;
    userName: string;
    password: string;
    passwordConfirm: string;
    globalError: string;
  };
} = {
  isOpen: false,
  type: 'login',
  helperText: {
    email: '',
    userName: '',
    password: '',
    passwordConfirm: '',
    globalError: '',
  },
};

const loginDialogSlice = createSlice({
  name: 'loginDialog',
  initialState: initialState,
  reducers: {
    openDialog(state) {
      state.isOpen = true;
    },
    closeDialog(state) {
      state.isOpen = false;
      state.type = 'login';
      state.helperText = initialState.helperText;
    },
    toggleDialogType(state) {
      state.type = state.type === 'login' ? 'signup' : 'login';
    },
  },
  extraReducers(builder) {
    builder.addCase(validate.fulfilled, (state, action) => {
      state.helperText = action.payload;
    });
    builder.addCase(submit.fulfilled, (state, action) => {
      // on success, reset the state of the login dialog
      state.isOpen = false;
      state.type = 'login';
      state.helperText = initialState.helperText;
    });
    builder.addCase(submit.rejected, (state, action) => {
      // on failure, keep the dialog open but update the globalError
      // helper text
      state.helperText.globalError = action.error.message || '';
    });
  },
});

export default loginDialogSlice;
