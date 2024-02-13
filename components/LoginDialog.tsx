'use client';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch, uiActions, authActions } from '@/store';

// Material UI imports
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const LoginDialog: React.FC = function () {
  // load stuff from our redux store
  const isOpen = useSelector((state: RootState) => state.ui.loginDialog.isOpen);
  const dialogType = useSelector(
    (state: RootState) => state.ui.loginDialog.type
  );
  const loginState = useSelector((state: RootState) => state.auth.status);

  // set up dispatch
  const dispatch = useDispatch<AppDispatch>();

  // set up form state
  const [userInfo, setUserInfo] = useState({
    email: '',
    userName: '',
    password: '',
    passwordConfirm: '',
  });

  // handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (dialogType === 'login') {
      await dispatch(
        authActions.login({
          email: userInfo.email,
          password: userInfo.password,
        })
      );
    } else {
      await dispatch(authActions.signup(userInfo));
    }
    // close the dialog window and reset state to 'login'
    dispatch(uiActions.closeDialog());
    // clear the data from the form
    setUserInfo({ email: '', userName: '', password: '', passwordConfirm: '' });
  };

  const handleSwitchMode = () => {
    dispatch(uiActions.toggleDialogType());
  };

  const handleClose = () => {
    dispatch(uiActions.closeDialog());
  };

  // define the contents of both the login form and signup form
  const loginJSX = (
    <>
      <TextField
        autoFocus
        id="email"
        margin="dense"
        label="Email"
        type="email"
        variant="outlined"
        fullWidth
        value={userInfo.email}
        onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
      />
      <TextField
        id="password"
        margin="dense"
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        value={userInfo.password}
        onChange={(e) => {
          setUserInfo({ ...userInfo, password: e.target.value });
        }}
      />
    </>
  );

  const signupJSX = (
    <>
      <TextField
        autoFocus
        id="email"
        margin="dense"
        label="Email"
        type="email"
        variant="outlined"
        fullWidth
        value={userInfo.email}
        onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
      />
      <TextField
        id="username"
        margin="dense"
        label="User name"
        type="username"
        variant="outlined"
        fullWidth
        value={userInfo.userName}
        onChange={(e) => setUserInfo({ ...userInfo, userName: e.target.value })}
      />
      <TextField
        id="password"
        margin="dense"
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        value={userInfo.password}
        onChange={(e) => {
          setUserInfo({ ...userInfo, password: e.target.value });
        }}
      />
      <TextField
        id="passwordConfirm"
        margin="dense"
        label="Confirm password"
        type="password"
        variant="outlined"
        fullWidth
        value={userInfo.passwordConfirm}
        onChange={(e) => {
          setUserInfo({ ...userInfo, passwordConfirm: e.target.value });
        }}
      />
    </>
  );

  return (
    <Dialog open={isOpen} maxWidth="xs" fullWidth onClose={handleClose}>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>
          {dialogType === 'login' ? 'Log in' : 'Sign up'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'login' ? loginJSX : signupJSX}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSwitchMode}
            disabled={loginState === 'authorizing'}
          >
            {dialogType === 'login' ? 'Sign up' : 'Log in'}
          </Button>
          <Button type="submit" disabled={loginState === 'authorizing'}>
            {loginState === 'authorizing' ? 'Processing...' : 'Submit'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default LoginDialog;
