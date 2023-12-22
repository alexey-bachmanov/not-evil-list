'use client';
import React from 'react';
import Logo from '@/components/Logo';
import Providers from '@/store/providers';

// MUI imports
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const AdminPage: React.FC = function () {
  return (
    <Providers>
      <Container component="main" maxWidth="sm">
        <Logo />
        <Typography>This is placeholder text</Typography>
      </Container>
    </Providers>
  );
};

export default AdminPage;
