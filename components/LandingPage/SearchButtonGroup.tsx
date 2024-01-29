'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch, uiActions } from '@/store';
import { logout } from '@/store/authSlice';

// MUI imports
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';

const SearchButtonGroup: React.FC = function () {
  const router = useRouter();
  const authStatus = useSelector((state: RootState) => state.auth.status);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();

  const handleDialogOpen = () => {
    dispatch(
      uiActions.setLoginDialogState({
        isLoginDialogOpen: true,
        loginDialogType: 'login',
      })
    );
  };

  const handleLogout = async () => {
    await dispatch(logout());
  };

  // figure out which set of buttons to show
  // Not logged in: [Add][Login]
  // Logged in as user: [Add][Logout]
  // Logged in as admin: [Add][Admin][Logout]
  let authButtonsJSX;
  if (authStatus === 'logged out' || authStatus === 'authorizing') {
    authButtonsJSX = <Button onClick={handleDialogOpen}>Login</Button>;
  } else if (authStatus === 'logged in' && user.role !== 'admin') {
    authButtonsJSX = <Button onClick={handleLogout}>Logout</Button>;
  } else {
    authButtonsJSX = (
      <>
        <Button onClick={() => router.push('/admin')}>Admin</Button>
        <Button onClick={handleLogout}>Logout</Button>
      </>
    );
  }

  return (
    <ButtonGroup fullWidth sx={{ p: 1 }}>
      <Button onClick={() => router.push('/new-business')}>Add</Button>
      {authButtonsJSX}
    </ButtonGroup>
  );
};

export default SearchButtonGroup;
