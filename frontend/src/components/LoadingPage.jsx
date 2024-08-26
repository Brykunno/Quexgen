import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/joy/CircularProgress';
import { Spinner } from "flowbite-react";


const LoadingPage = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
     Loading... <Spinner color={'primary'} aria-label="Extra large spinner example" size="xl" />
    </Box>
  );
};

export default LoadingPage;