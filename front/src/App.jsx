

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Teacher_routes } from "./Routes/Teacher_routes";
import { Admin_routes } from "./Routes/Admin_routes";
import LoginPage from './Pages/login';
import Demo from './Pages/demo';
import ProtectedRoute from "./components/ProtectedRoutes";
import { ThemeProvider } from "@/components/theme-provider"





function App() {
  

  function Logout() {
    localStorage.clear();
    return <Navigate to="/login" />;
  }
  const ProtectedLayout = ({ children }) => (
    <>
      {children}
    </>
  );

  return (
    <>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
    <Routes>


    {Admin_routes.map((val, key) => {
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
    {Teacher_routes.map((val, key) => {
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
      
 
 
    <Route path="/" element={<LoginPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/logout" element={<Logout />} />

    </Routes>
  </BrowserRouter>
  </ThemeProvider>
    </>
  )
}

export default App
