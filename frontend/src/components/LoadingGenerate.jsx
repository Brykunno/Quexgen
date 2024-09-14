import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/joy/CircularProgress';
import { Spinner } from "flowbite-react";
import "../styles/psulogo.css"


const LoadingGenerate = () => {
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
     <div class="thick-circle">
                <img src="/images/PSULogo.png" alt="Rotating Circle Front"/>
                <img src="/images/PSULogo.png" class="thickness" alt="Rotating Circle Back"/>
				</div>
	
      </Box>
    );
  };
  
  export default LoadingGenerate;
  
