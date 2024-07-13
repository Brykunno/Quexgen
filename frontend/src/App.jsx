import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";

import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoutes";
import Add_user from "./pages/Admin/Add_user";
import Topnavbar from './components/Topnavbar';

import Sidebar from "./components/Sidebar";

import "./styles/App.css";

import Admin_routes from './Routes/Admin_routes';
import Teacher_routes from './Routes/Teacher_routes';
import { Teacher_routes_data } from "./Routes/Teacher_routes_data";
import { Admin_routes_data } from "./Routes/Admin_routes_data";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function Add_userlogout() {
  localStorage.clear();
  return <Add_user />;
}

const ProtectedLayout = ({ children }) => (
  <>
    <Topnavbar />
    {children}
  </>
);


function App() {
 


  return (

<div>

<BrowserRouter>
    <Routes>

    {Admin_routes_data.map((val, key) => {
            return (
              <Route
              key={key}
              path={val.path}
              element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    {val.element}
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />
            );
          })}
    {Teacher_routes_data.map((val, key) => {
            return (
              <Route
              key={key}
              path={val.path}
              element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    {val.element}
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />
            );
          })}
      
 
    <Route path="/login" element={<Login />} />
    <Route path="/logout" element={<Logout />} />
    <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>

   
   </div>
  );
}

export default App;
