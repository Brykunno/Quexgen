import React from 'react';
import Box from '@mui/material/Box';
import "../styles/honeycomb.css";
import { Progress } from "flowbite-react";

const LoadingGenerate = ({ percent }) => {
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
        flexDirection: 'column', // Stack loader, text, and progress bar vertically
      }}
    >
      {/* Loader */}
      <div className="loader">
        <div className="loader-square"></div>
        <div className="loader-square"></div>
        <div className="loader-square"></div>
        <div className="loader-square"></div>
        <div className="loader-square"></div>
        <div className="loader-square"></div>
        <div className="loader-square"></div>
      </div>

      {/* Generating Text */}
      <p style={{ color: 'white', fontSize: '18px', marginTop: '16px' }}>Generating...</p>

      {/* Progress Bar */}
     
    </Box>
  );
};

export default LoadingGenerate;
