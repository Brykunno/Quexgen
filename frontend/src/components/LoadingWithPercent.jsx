import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/joy/CircularProgress';
import { Spinner } from "flowbite-react";
import "../styles/psulogo.css"
import { Progress } from "flowbite-react";


function LoadingWithPercent(props) {
    return (
        <div>
        <Box 
          sx={{
            display: 'flex ',
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
            <div className='flex flex-col gap-3 '> 
       <div class="thick-circle mx-auto">
                  <img src="/images/PSULogo.png" alt="Rotating Circle Front"/>
                  <img src="/images/PSULogo.png" class="thickness" alt="Rotating Circle Back"/>
          
                  </div>
                  
                  <Progress
        color='primary'
      progress={Math.round(props.percent)}
      
    
      textLabelPosition="outside"
      size="lg"
      labelProgress
      className='text-white z-100 w-96 '
      
    />
    </div>
        </Box>
      
        </div>
      );
    };


export default LoadingWithPercent
