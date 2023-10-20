'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

// MUI imports
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';

const SearchButtonGroup: React.FC = function () {
  const router = useRouter();

  return (
    <ButtonGroup fullWidth sx={{ p: 1 }}>
      <Button onClick={() => router.push('/new-business')}>Add</Button>
      <Button>Log in</Button>
    </ButtonGroup>
  );
};

export default SearchButtonGroup;
