import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/joy/CircularProgress';

const LoadingPage = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
     Loading... <CircularProgress variant="soft" />
    </Box>
  );
};

export default LoadingPage;