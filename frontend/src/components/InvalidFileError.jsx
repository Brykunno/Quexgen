import React from 'react';
import { useState, useEffect } from 'react';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Dropdown, DropdownHeader } from 'flowbite-react';
import Badge from '@mui/material/Badge';

function InvalidFileError(props) {
    
 
  const errors = props.missing_keywords
  return (
    <div>
          
      <Dropdown arrowIcon={false} inline label={
        <Badge badgeContent={errors.length} color="error"  >
        <ErrorOutlineIcon className={errors>0?'text-red-600':''} />
        </Badge>
        
        }>
        {props.missing_keywords.length > 0 ? (
        <div >
          {props.missing_keywords.map((kw, index) => (
            <DropdownHeader key={index} className='text-red-600'>The uploaded file doesn't have {kw}</DropdownHeader>  
          ))}
        </div>
      ) : (
        <DropdownHeader>No keywords are missing.</DropdownHeader> // Optional message
      )}
      </Dropdown>
 
    </div>
  );
}

export default InvalidFileError;
