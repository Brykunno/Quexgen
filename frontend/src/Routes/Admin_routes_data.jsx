import React from 'react'


import Home from '../pages/Admin/Home';

import Dashboard from '@mui/icons-material/Dashboard';
import Teachers from '../pages/Admin/Teachers';
import Exams from '../pages/Admin/Exams';



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
        path: "/exams",
        element: <Exams />
    },


   


]



