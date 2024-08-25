import React from 'react'


import Home from '../pages/Admin/Home';

import Dashboard from '@mui/icons-material/Dashboard';
import Teachers from '../pages/Admin/Teachers';
import Exams from '../pages/Admin/Exams';
import Add_user from '../pages/Admin/Add_user';
import Exam_review from '../pages/Admin/Exam_review';



export const Admin_routes_data = [
    {
        path: "/",
        element: <Home />
    },
    {
        path: "/dashboard",
        element: <Dashboard />
    },
    {
        path: "/teachers",
        element: <Teachers />
    },
    {
        path: "/add_user",
        element: <Add_user />
    },
    {
        path: "/exams",
        element: <Exams />
    },
    {
        path: "/exam_review/:id",
        element: <Exam_review />
    },


   


]



