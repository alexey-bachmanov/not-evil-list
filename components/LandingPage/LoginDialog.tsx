'use client';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch, uiActions } from '@/store';
import { login } from '@/store/authSlice';

// Material UI imports
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const LoginDialog: React.FC = function () {
  // load stuff from our redux store
  const isOpen = useSelector((state: RootState) => state.ui.isLoginDialogOpen);
  const dialogType = useSelector(
    (state: RootState) => state.ui.loginDialogType
  );
  const authStatus = useSelector((state: RootState) => state.auth.status);

  // set up dispatch
  const dispatch = useDispatch<AppDispatch>();

  // set up form state
  const [userInfo, setUserInfo] = useState({
    email: '',
    username: '',
    password: '',
    passwordConfirm: '',
  });

  // handlers
  const handleSubmit = async () => {
    if (dialogType === 'login') {
      await dispatch(
        login({ email: userInfo.email, password: userInfo.password })
      );
    } else {
      console.log(userInfo);
    }
    dispatch(
      uiActions.setLoginDialogState({
        isLoginDialogOpen: false,
        loginDialogType: 'login',
      })
    );
  };

  const handleSwitchMode = () => {
    dispatch(
      uiActions.setLoginDialogState({
        isLoginDialogOpen: true,
        loginDialogType: dialogType === 'login' ? 'signup' : 'login',
      })
    );
  };

  const handleClose = () => {
    dispatch(
      uiActions.setLoginDialogState({
        isLoginDialogOpen: false,
        loginDialogType: 'login',
      })
    );
  };

  // define the contents of both the login form and signup form
  const loginJSX = (
    <DialogContent>
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
    </DialogContent>
  );

  const signupJSX = (
    <DialogContent>
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
        value={userInfo.username}
        onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })}
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
    </DialogContent>
  );

  return (
    <Dialog open={isOpen} maxWidth="xs" fullWidth onClose={handleClose}>
      <DialogTitle>{dialogType === 'login' ? 'Log in' : 'Sign up'}</DialogTitle>
      {dialogType === 'login' ? loginJSX : signupJSX}
      <DialogActions>
        <Button onClick={handleSwitchMode}>
          {dialogType === 'login' ? 'Sign up' : 'Log in'}
        </Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginDialog;
