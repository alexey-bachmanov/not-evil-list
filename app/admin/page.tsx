'use client';
import React from 'react';
import Logo from '@/components/Logo';

// MUI imports
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const AdminPage: React.FC = function () {
  return (
    <Container component="main" maxWidth="sm">
      <Logo />
      <Typography>This is placeholder text</Typography>
    </Container>
  );
};

export default AdminPage;
