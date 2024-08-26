import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import { Spinner } from "flowbite-react";

function LoadingIndicator() {
  return (
    <div >
      <CircularProgress />
    </div>
  )
}

export default LoadingIndicator
