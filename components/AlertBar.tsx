'use client';
import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { RootState, uiActions } from '@/store';

// MUI imports
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const AlertBar: React.FC = function () {
  const alertState = useSelector((state: RootState) => state.ui.alert);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(uiActions.closeAlert());
  };

  return (
    <Snackbar
      open={alertState.isOpen}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      autoHideDuration={5000}
      onClose={handleClose}
    >
      <Alert severity={alertState.type} variant="filled">
        {alertState.message}
      </Alert>
    </Snackbar>
  );
};

export default AlertBar;
