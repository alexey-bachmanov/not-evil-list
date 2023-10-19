import React from 'react';

// MUI imports
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CameraIcon from '@mui/icons-material/Camera';

const Logo: React.FC = function () {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'left',
        mt: 3,
        ml: 'auto',
        mr: 'auto',
      }}
    >
      <CameraIcon color="primary" fontSize="large" />
      <Typography variant="h4">Not Evil List</Typography>
    </Box>
  );
};

export default Logo;
