import React from 'react'


import Home from '../pages/Admin/Home';

import Dashboard from '../pages/Admin/Dashboard';
import Teachers from '../pages/Admin/Teachers';
import Exams from '../pages/Admin/Exams';
import Add_user from '../pages/Admin/Add_user';
import Exam_review from '../pages/Admin/Exam_review';
import Admin_profile from '../pages/Admin/Admin_profile';
import Login from '../pages/Login';



export const Admin_routes_data = [
   
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
    {
        path: "/admin_profile",
        element: <Admin_profile />
    },



   


]



