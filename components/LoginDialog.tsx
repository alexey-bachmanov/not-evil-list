'use client';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  RootState,
  AppDispatch,
  authActions,
  loginDialogActions,
} from '@/store';

// Material UI imports
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';

const LoginDialog: React.FC = function () {
  // load stuff from our redux store
  const isOpen = useSelector((state: RootState) => state.loginDialog.isOpen);
  const dialogType = useSelector((state: RootState) => state.loginDialog.type);
  const loginState = useSelector((state: RootState) => state.auth.status);
  const helperText = useSelector(
    (state: RootState) => state.loginDialog.helperText
  );

  // set up dispatch
  const dispatch = useDispatch<AppDispatch>();

  // set up form state
  const [userInfo, setUserInfo] = useState({
    email: '',
    userName: '',
    password: '',
    passwordConfirm: '',
  });

  // compute derivative state
  const helperTextIsEmpty =
    helperText.email === '' &&
    helperText.userName === '' &&
    helperText.password === '' &&
    helperText.passwordConfirm === '';
  const userInfoIsFilledOut =
    (dialogType === 'login' &&
      userInfo.email !== '' &&
      userInfo.password !== '') ||
    (dialogType === 'signup' &&
      Object.values(userInfo).every((val) => val !== ''));

  // handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // call the loginDialog.submit thunk and store success or failure
    const result = await dispatch(loginDialogActions.submit(userInfo));
    // clear the data from the form on fulfilled dispatch
    if (result.meta.requestStatus === 'fulfilled') {
      setUserInfo({
        email: '',
        userName: '',
        password: '',
        passwordConfirm: '',
      });
    }
  };

  const handleBlur = () => {
    dispatch(loginDialogActions.validate(userInfo));
  };

  const handleSwitchMode = () => {
    dispatch(loginDialogActions.toggleDialogType());
  };

  const handleClose = () => {
    dispatch(loginDialogActions.closeDialog());
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
        error={helperText.email !== ''}
        helperText={helperText.email}
        onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
        onBlur={handleBlur}
      />
      <TextField
        id="password"
        margin="dense"
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        value={userInfo.password}
        error={helperText.password !== ''}
        helperText={helperText.password}
        onChange={(e) => {
          setUserInfo({ ...userInfo, password: e.target.value });
        }}
        onBlur={handleBlur}
      />
    </>
  );

  const signupJSX = (
    <>
      <TextField
        id="username"
        margin="dense"
        label="User name"
        type="username"
        variant="outlined"
        fullWidth
        value={userInfo.userName}
        error={helperText.userName !== ''}
        helperText={helperText.userName}
        onChange={(e) => setUserInfo({ ...userInfo, userName: e.target.value })}
        onBlur={handleBlur}
      />
      {loginJSX}
      <TextField
        id="passwordConfirm"
        margin="dense"
        label="Confirm password"
        type="password"
        variant="outlined"
        fullWidth
        value={userInfo.passwordConfirm}
        error={helperText.passwordConfirm !== ''}
        helperText={helperText.passwordConfirm}
        onChange={(e) => {
          setUserInfo({ ...userInfo, passwordConfirm: e.target.value });
        }}
        onBlur={handleBlur}
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
          {helperText.globalError !== '' ? (
            <Alert severity="error">{helperText.globalError}</Alert>
          ) : null}
          {dialogType === 'login' ? loginJSX : signupJSX}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSwitchMode}
            disabled={loginState === 'authorizing'}
          >
            {dialogType === 'login' ? 'Sign up' : 'Log in'}
          </Button>
          <Button
            type="submit"
            disabled={
              !helperTextIsEmpty ||
              !userInfoIsFilledOut ||
              loginState === 'authorizing'
            }
          >
            {loginState === 'authorizing' ? 'Processing...' : 'Submit'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default LoginDialog;
