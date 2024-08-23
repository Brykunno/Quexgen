import React from 'react'


import Exam_bank from '../pages/Teacher/Exam_bank';
import Create_exam from '../pages/Teacher/Create_exam';

import TosView from '../pages/Teacher/TosView';
import Profile from '../pages/Teacher/Profile';



export const Teacher_routes_data = [

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
   


]



