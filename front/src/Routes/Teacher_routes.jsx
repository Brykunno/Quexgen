import Create_exam from '@/Pages/Instructors/Create_exam/Create_exam'
import Dashboard from '@/Pages/Instructors/Dashboard/Dashboard'
import Exams from '@/Pages/Instructors/Exams/Exams'
import React from 'react'

export const Teacher_routes = [
    {
        path: "/dashboard",
        element: <Dashboard />
    },

    {
        path: "/create_exam",
        element: <Create_exam />
    },

    {
        path: "/exams",
        element: <Exams />
    },
]



