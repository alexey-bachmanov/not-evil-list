import { createSlice, PayloadAction } from '@reduxjs/toolkit';

///// SLICE CREATION /////
const initialState: {
  isLoginDialogOpen: boolean;
  loginDialogType: 'login' | 'signup';
} = {
  isLoginDialogOpen: false,
  loginDialogType: 'login',
};

const uiSlice = createSlice({
  name: 'uiSlice',
  initialState: initialState,
  reducers: {
    setLoginDialogState(state, action: PayloadAction<typeof initialState>) {
      state.isLoginDialogOpen = action.payload.isLoginDialogOpen;
      state.loginDialogType = action.payload.loginDialogType;
    },
  },
});

export default uiSlice;
