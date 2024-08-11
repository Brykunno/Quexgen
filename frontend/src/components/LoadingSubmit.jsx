import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/joy/CircularProgress';

const LoadingSubmit = () => {
  return (
    <Box 
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: Adds a semi-transparent background
        zIndex: 9999, // Ensure it appears above other elements
      }}
    >
      <span className='text-white'>Loading... </span> &nbsp; <CircularProgress variant="soft" />
    </Box>
  );
};

export default LoadingSubmit;
