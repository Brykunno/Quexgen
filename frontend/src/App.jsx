import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";

import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoutes";
import Add_user from "./pages/Admin/Add_user";
import Topnavbar from './components/Topnavbar';
import Topnavbarcomp from './components/topnavbarcomp';

import Sidebar from "./components/Sidebar";

import "./styles/App.css";


import { Teacher_routes_data } from "./Routes/Teacher_routes_data";
import { Admin_routes_data } from "./Routes/Admin_routes_data";

import { Flowbite } from 'flowbite-react';
import { colors } from '@mui/material';

const customTheme = {
  button: {
    color: {
      primary: "border border-transparent bg-prime text-white  focus:ring-4 focus:ring-blue-300 enabled:hover:bg-blue-900 dark:border-blue-700 dark:bg-prime dark:text-white dark:focus:ring-prime dark:enabled:hover:bg-blue-700 flex items-stretch justify-center p-0.5 text-center",
      
    },
    

  },

  progress: {
    color:{
      primary:'bg-prime dark:bg-blue-700',
    },
  },

  spinner: {
    color:{
      primary:'fill-prime dark:fill-blue-700',
    },
  },
  
};


function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}



const ProtectedLayout = ({ children }) => (
  <>
    <Sidebar />
  {/* <Topnavbar/> */}
    {/* <Topnavbarcomp /> */}
    {children}
  </>
);


function App() {
 


  return (


<Flowbite theme={{ theme: customTheme }}>

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

   
   </Flowbite>
  );
}

export default App;
