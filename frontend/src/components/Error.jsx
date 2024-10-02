import React from 'react';
import { useState, useEffect } from 'react';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Dropdown, DropdownHeader } from 'flowbite-react';
import Badge from '@mui/material/Badge';

function Error(props) {
    
 
  const errors = props.lessonsData.reduce((acc, lesson, index) => {
    if (lesson.topic == '') {
      acc.push(`Please input a lesson summary for lesson ${index + 1}`);
    }

    if (lesson.learning_outcomes == '') {
        acc.push(`Please input learning outcomes for the lesson ${index + 1}`);
      }
   

    return acc;
  }, []);

  if(props.getTotalTaxonomy>100){
    errors.push('Total taxonomy allocations exceeds 100%');
  }

  if(props.totalItems == 0){
    errors.push('Please input how many items do you want to create for the exam');
  }

  return (
    <div>
          
      <Dropdown arrowIcon={false} inline label={
        <Badge badgeContent={errors.length} color="error"  >
        <ErrorOutlineIcon className={errors.length>0?'text-red-600':''} />
        </Badge>
        
        }>
        {errors.length > 0 ? (
          errors.map((error, idx) => (
            <DropdownHeader key={idx} className='text-red-500'>{error}</DropdownHeader>
          ))
        ) : (
          <DropdownHeader>No errors</DropdownHeader>
        )}
      </Dropdown>
 
    </div>
  );
}

export default Error;
