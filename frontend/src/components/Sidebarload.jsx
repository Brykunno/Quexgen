import React from 'react'
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

function Sidebarload() {
  return (
    <div className='text-white flex justify-center items-center  flex-col'>
      
 <Box width={"80%"}>
 
      <Skeleton height={60}  animation="wave" />
      <Skeleton height={60} animation="wave" />
      <Skeleton height={60}  animation="wave" />
      <Skeleton height={60}  animation="wave" />
      <Skeleton height={60}  animation="wave" />
     

 </Box>
    

    </div>
  )
}

export default Sidebarload
