import { createSlice, PayloadAction } from '@reduxjs/toolkit';

///// SLICE CREATION /////
const initialState: {
  loginDialog: { isOpen: boolean; type: 'login' | 'signup' };
  alert: {
    isOpen: boolean;
    type: 'success' | 'info' | 'warning' | 'error';
    message: string;
  };
  isInAdminMode: boolean;
  detailsDrawer: {
    isOpen: boolean;
  };
  editsDrawer: {
    isOpen: boolean;
  };
} = {
  loginDialog: { isOpen: false, type: 'login' },
  alert: {
    isOpen: false,
    type: 'success',
    message: '',
  },
  isInAdminMode: false,
  detailsDrawer: {
    isOpen: false,
  },
  editsDrawer: {
    isOpen: false,
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
    // admin mode stuff
    toggleAdminMode(state) {
      state.isInAdminMode = !state.isInAdminMode;
    },
    // details drawer stuff
    setDetailsDrawerOpen(state, action: PayloadAction<boolean>) {
      // when opening, we want to open only the details drawer,
      // when closing, we want to close both the details drawer and edits drawer
      if (action.payload) {
        state.detailsDrawer.isOpen = true;
      } else {
        state.detailsDrawer.isOpen = false;
        state.editsDrawer.isOpen = false;
      }
    },
    setEditsDrawerOpen(state, action: PayloadAction<boolean>) {
      state.editsDrawer.isOpen = action.payload;
    },
  },
});

export default uiSlice;
