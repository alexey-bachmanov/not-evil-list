import { createSlice, PayloadAction } from '@reduxjs/toolkit';

///// SLICE CREATION /////
const initialState: {
  loginDialog: { isOpen: boolean; type: 'login' | 'signup' };
  alert: {
    isOpen: boolean;
    type: 'success' | 'info' | 'warning' | 'error';
    message: string;
  };
  detailsDrawer: {
    isOpen: boolean;
  };
  editsDrawer: {
    isOpen: boolean;
  };
  selectedBusinessID: string | undefined;
} = {
  loginDialog: { isOpen: false, type: 'login' },
  alert: {
    isOpen: false,
    type: 'success',
    message: '',
  },
  detailsDrawer: {
    isOpen: false,
  },
  editsDrawer: {
    isOpen: false,
  },
  selectedBusinessID: undefined,
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
    // details drawer stuff
    setDetailsDrawerOpen(state, action: PayloadAction<boolean>) {
      // when opening, we want to open only the details drawer,
      if (!state.detailsDrawer.isOpen && action.payload) {
        // drawer is closed and we want it open
        state.detailsDrawer.isOpen = true;
      }
      // when closing, we want to close both the details drawer and edits drawer
      if (state.detailsDrawer.isOpen && !action.payload) {
        // drawer is open and we want it closed
        state.detailsDrawer.isOpen = false;
        state.editsDrawer.isOpen = false;
      }
      // when the drawer is already in whatever state the payload desires, do nothing
    },
    setEditsDrawerOpen(state, action: PayloadAction<boolean>) {
      if (
        (!state.editsDrawer.isOpen && action.payload) || // drawer is closed and we want it open
        (state.editsDrawer.isOpen && !action.payload) // drawer is open and we want it closed
      ) {
        state.editsDrawer.isOpen = action.payload;
      }
    },
    setSelectedBusinessId(state, action: PayloadAction<string>) {
      state.selectedBusinessID = action.payload;
    },
  },
});

export default uiSlice;
