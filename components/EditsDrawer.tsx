'use client';
import React, { useState } from 'react';
import Drawer from './Drawer';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch, uiActions } from '@/store';
import EditsForm from './EditsForm';

const EditsDrawer: React.FC = function () {
  const isOpen = useSelector((state: RootState) => state.ui.editsDrawer.isOpen);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Drawer
      isOpen={isOpen}
      variant="temporary"
      layer={3}
      onClose={() => dispatch(uiActions.setEditsDrawerOpen(false))}
      sx={{ display: 'flex', flexDirection: 'column' }}
    >
      <EditsForm />
    </Drawer>
  );
};

export default EditsDrawer;
