import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import api from "../../../api";
import { Typography } from '@mui/material';
import { Button } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditNoteIcon from '@mui/icons-material/EditNote';
import RecommendIcon from '@mui/icons-material/Recommend';  

import RateReviewIcon from '@mui/icons-material/RateReview';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

 function statusIcons(status, status_name) {
    if (status === 0) {
      return (
        <div className=' px-2 py-1 text-blue-700 font-bold'>
          {status_name} 
        </div>
      );
    } else if (status === 1) {
      return (
        <div className='px-2 py-1 text-green-700 font-bold'>
          For review 
        </div>
      );
    } else if (status === 2) {
      return (
        <div className='px-2 py-1 text-green-800 font-bold'>
          {status_name} 
        </div>
      );
    } else if (status === 3) {
      return (
        <div className=' px-2 py-1 text-orange-600 font-bold'>
          For revision 
        </div>
      );
    } else {
      return null;
    }
  }

const columns = [
  { field: 'username', headerName: 'Username', width: 90 },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
    editable: true,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 150,
    editable: true,
  },
  {
    field: 'courseName',
    headerName: 'Course Name',
    width: 150,
    editable: true,
  },
    {
    field: 'courseCode',
    headerName: 'Course Code',
    width: 110,
    editable: true,
  },
      {
  field: 'examDate',
    headerName: 'Exam Date',
    width: 110,
    editable: true,
   valueGetter: (value,row) => {
    const date = new Date(row.examDate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },
  },
//   {
//     field: 'fullName',
//     headerName: 'Full name',
//     description: 'This column has a value getter and is not sortable.',
//     sortable: false,
//     width: 160,
//     valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
//   },
      {
    field: 'statusDisplay',
    headerName: 'Status',
    width: 110,
    editable: true,
renderCell: (params) => (
 <div>

  {statusIcons(params.row.status,params.row.statusDisplay)}
 
 </div>
  ),
  },
        {
    field: '',
    headerName: 'Action',
    width: 110,
    editable: true,
    renderCell: (params) => (
    <a
    key={params.row.id}
      href={`/exam_review/${params.row.id}`}
      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
    >
      <Button color="primary" variant="contained" size="small">
        <VisibilityIcon />
      </Button>
    </a>
  ),
  },
];
 


export default function DataGridDemo() {

      
      const [rows, setRows] = useState([]);
     
      useEffect(() => {
        getExam();
      
      }, []);
    
      const getExam = () => {
        api
          .get(`/api/tos-info/detail/admin/`)
          .then((res) => res.data)
          .then((data) => {
            const filteredData = data.filter((exam) => exam.Status !== 0); // Filter out exams with Status of 0
       
     console.log(data)

            const newRows = filteredData.map((data) => ({
              id: data.id,
              username: data.user.username,
              firstName: data.user.first_name,
              middleName: data.user.middle_name,
              lastName: data.user.last_name,
              courseName: data.Title,
              courseCode: data.CourseCode,
              examDate: data.ExaminationDate,
              status: data.Status,
              statusDisplay: data.Status_display
            }));
            setRows(newRows);
         
            // Initialize filtered exams to show only the filtered exams
          })
          .catch((err) => alert(err));
      };
    
  return (
    <Box sx={{ height: 400, width: '100%' }} >
         <Typography variant="h6" gutterBottom>
    Examination Submissions Overview
  
  </Typography>
      <DataGrid
      
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}

        disableRowSelectionOnClick
      />
    </Box>
  );
}
