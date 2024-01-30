import { createSlice, PayloadAction } from '@reduxjs/toolkit';

///// SLICE CREATION /////
const initialState: {
  loginDialog: { isOpen: boolean; type: 'login' | 'signup' };
  alert: {
    isOpen: boolean;
    type: 'success' | 'info' | 'warning' | 'error';
    message: string;
  };
} = {
  loginDialog: { isOpen: false, type: 'login' },
  alert: {
    isOpen: false,
    type: 'success',
    message: '',
  },
};

const uiSlice = createSlice({
  name: 'uiSlice',
  initialState: initialState,
  reducers: {
    // login dialog stuff
    openDialog(state) {
      state.loginDialog.isOpen = true;
    },
    closeDialog(state) {
      state.loginDialog.isOpen = false;
      state.loginDialog.type = 'login';
    },
    toggleDialogType(state) {
      state.loginDialog.type =
        state.loginDialog.type === 'login' ? 'signup' : 'login';
    },
    // alert bar stuff
    openAlert(
      state,
      action: PayloadAction<{
        type: typeof initialState.alert.type;
        message: string;
      }>
    ) {
      state.alert.isOpen = true;
      state.alert.type = action.payload.type;
      state.alert.message = action.payload.message;
    },
    closeAlert(state) {
      state.alert.isOpen = false;
    },
  },
});

export default uiSlice;
