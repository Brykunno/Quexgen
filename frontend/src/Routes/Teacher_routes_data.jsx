import React from 'react'


import Exam_bank from '../pages/Teacher/Exam_bank';
import Create_exam from '../pages/Teacher/Create_exam';

import TosView from '../pages/Teacher/TosView';
import Profile from '../pages/Teacher/Profile';
import Upload from '../pages/Teacher/Upload';
import Dashboard from '../pages/Teacher/Dashboard';



export const Teacher_routes_data = [

    {
        path: "/dashboard_instructor",
        element: <Dashboard />  
    },
    {
        path: "/exam_bank",
        element: <Exam_bank />
    },

    {
        path: "/create_exam",
        element: <Create_exam />
    },

    {
        path: "/tos_view/:id",
        element: <TosView />
    },
    {
        path: "/profile",
        element: <Profile />
    },
    {
        path: "/upload",
        element: <Upload />
    },
   


]



