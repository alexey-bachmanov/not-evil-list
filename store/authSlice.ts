import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  isAuth: false,
  userName: '',
  userID: '',
  roles: [],
};

const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    logOut(state, action) {
      // no smarts necessary, just reset auth state back to
      // initial logged out state
      return initialState;
    },
    logIn(
      state,
      action: PayloadAction<{
        userName: string;
        userID: string;
        roles: [];
      }>
    ) {
      // presumably, we have a JWT in our cookies by this point
      // and can change the auth state to 'logged in'
      return {
        isAuth: true,
        userName: action.payload.userName,
        userID: action.payload.userID,
        roles: action.payload.roles,
      };
    },
  },
});

export default authSlice;
