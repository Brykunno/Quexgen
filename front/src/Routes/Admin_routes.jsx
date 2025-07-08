import React from 'react'


import Dashboard from '../Pages/Admin/Dashboard/Dashboard';
import Instructors from '../Pages/Admin/Users/Users';
import Courses from '@/Pages/Admin/Courses/Courses';
import Exams from '@/Pages/Admin/Exams/Exams';
import Account from '@/Pages/Admin/Account/Account';
import Logs from '@/Pages/Admin/Logs/Logs';






export const Admin_routes = [
   
    {
        path: "/admin/dashboard",
        element: <Dashboard />
    },
    {
        path: "/admin/users",
        element: <Instructors />
    },
    {
        path: "/admin/courses",
        element: <Courses />
    },
    {
        path: "/admin/exams",
        element: <Exams />
    },
    {
        path: "/admin/account",
        element: <Account />
    },
    {
        path: "/admin/logs",
        element: <Logs />
    },
   



   


]



