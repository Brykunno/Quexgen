import React from 'react';
import { useState, useEffect } from 'react';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Dropdown, DropdownHeader } from 'flowbite-react';
import Badge from '@mui/material/Badge';

function InvalidFileError(props) {
    
 
  const errors = props.missing_keywords
  return (
    <div>
          
      <div arrowIcon={false} inline label={
        <Badge badgeContent={errors.length} color="error"  >
        <ErrorOutlineIcon className={errors>0?'text-red-600':''} />
        </Badge>
        
        }>
        {props.missing_keywords.length > 0 ? (
        <div >
          {props.missing_keywords.map((kw, index) => (
            <div key={index} className='text-red-600'>The uploaded file doesn't have <span className='font-bold'> {kw}</span></div>  
          ))}
        </div>
      ) : (
        <div>No keywords are missing.</div> // Optional message
      )}
      </div>
 
    </div>
  );
}

export default InvalidFileError;
