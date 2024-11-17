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
import { colors, ThemeProvider } from '@mui/material';
import Reset_password from './pages/reset_password';
import Reset_form from './components/reset_form';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#373383',
      main: '#060164',
      dark: '#040046',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
});

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
      primary:'fill-prime dark:fill-prime',
    },
  },


  toggleSwitch:{
    root:{
    base: "group flex rounded-lg focus:outline-none",
    active: {
      "on": "cursor-pointer",
      "off": "cursor-not-allowed opacity-50"
    },
    "label": "ms-3 mt-0.5 text-start text-sm font-medium text-gray-900 dark:text-gray-300"
  },
  toggle: {
    "base": "relative rounded-full border after:absolute after:rounded-full after:bg-white after:transition-all group-focus:ring-4 group-focus:ring-cyan-500/25",
    checked: {
      on: "after:translate-x-full after:border-white rtl:after:-translate-x-full",
      off: "border-prime bg-lite dark:border-lite dark:bg-lite",
      color: {
        primary: "border-prime bg-prime",
    
      }
    },
  },
  }

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
<ThemeProvider theme={theme}>

<BrowserRouter>
    <Routes>


    <Route path="/password-reset" element={<Reset_password />} />
    <Route path="/password/reset/confirm/:uid/:token" element={<Reset_form />} />

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
    <Route path="/" element={<Login />} />

    <Route path="/logout" element={<Logout />} />
    <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>

  </ThemeProvider>
   </Flowbite>
  );
}

export default App;
