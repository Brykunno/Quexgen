import React from 'react';
import { useState, useEffect } from 'react';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Dropdown, DropdownHeader } from 'flowbite-react';
import Badge from '@mui/material/Badge';

function ErrorHandling(props) {
    
 
  const errors = props.lessonsData.reduce((acc, lesson, index) => {
    if (lesson.teachingHours == 0) {
      acc.push(`Lesson ${index + 1} has 0 teaching hours`);
    }
    if (!Number.isInteger(lesson.items)) {
        acc.push(`Lesson ${index + 1} items is not an integer`);
      }

      if (!Number.isInteger(lesson.remembering)) {
        acc.push(`Lesson ${index + 1} remembering should be an integer`);
      }

      if (!Number.isInteger(lesson.understanding)) {
        acc.push(`Lesson ${index + 1} understanding should be an integer`);
      }

      if (!Number.isInteger(lesson.analyzing)) {
        acc.push(`Lesson ${index + 1} analyzing should be an integer`);
      }

      if (!Number.isInteger(lesson.applying)) {
        acc.push(`Lesson ${index + 1} applying should be an integer`);
      }

      if (!Number.isInteger(lesson.evaluating)) {
        acc.push(`Lesson ${index + 1} evaluating should be an integer`);
      }

      if (!Number.isInteger(lesson.creating)) {
        acc.push(`Lesson ${index + 1} creating should be an integer`);
      }

      if (lesson.items!=lesson.total) {
        acc.push(`Lesson ${index + 1} number of items should be equal to the total items for the lesson`);
      }
  

    return acc;
  }, []);

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

export default ErrorHandling;
