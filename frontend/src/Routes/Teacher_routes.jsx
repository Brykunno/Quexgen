import React from 'react'

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from '../pages/Login';
import Home from '../pages/Admin/Home';
import NotFound from '../pages/NotFound';
import ProtectedRoute from '../components/ProtectedRoutes';
import Dashboard from '@mui/icons-material/Dashboard';
import Teachers from '../pages/Admin/Teachers';
import Exams from '../pages/Admin/Exams';
import Exam_bank from '../pages/Teacher/Exam_bank';

import Sidebar from '../components/Sidebar';




function Logout_teacher() {
    localStorage.clear();
    return <Navigate to="/login" />;
  }
  

  
function Teacher_routes() {

    const ProtectedLayout = ({ children }) => (
        <>
          <Sidebar />
          {children}
        </>
      );
    
  return (
  
    <Routes>
    
       <Route
        path="/exam_bank"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <Exam_bank />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
    
      <Route path="/logout_teacher" element={<Logout_teacher />} />
     
 
    </Routes>
 
  )
}

export default Teacher_routes
