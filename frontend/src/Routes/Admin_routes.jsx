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




function Logout() {
    localStorage.clear();
    return <Navigate to="/login" />;
  }
  
  function Add_userlogout() {
    localStorage.clear();
    return <Add_user />;
  }
  

function Admin_routes() {
    const ProtectedLayout = ({ children }) => (
        <>
          <Sidebar />
          {children}
        </>
      );
    
  return (

    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <Home />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teachers"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <Teachers />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/exams"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <Exams />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
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
   
      <Route path="/logout" element={<Logout />} />
      <Route path="/add_user" element={<Add_userlogout />} />
  
    </Routes>

  )
}

export default Admin_routes
