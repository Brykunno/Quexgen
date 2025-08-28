import React, { useState, useEffect } from 'react';
import { SidebarData } from "./SidebarData";
import { SidebarData_teacher } from "./SidebarData_teacher";
import api from "../api";
import Avatar from '@mui/material/Avatar';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LoadingPage from './LoadingPage';
import Sidebarload from './Sidebarload';

function stringToColor(string) {
  let hash = 0;
  let i;
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}
function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    getUser();
  }, []);

  const getUser = () => {
    api
      .get(`/api/user/account/`)
      .then((res) => res.data)
      .then((data) => {
        setUser(data);
     
      })
      .catch((err) => alert(err));
  };

  function removeIdFromPath(path) {
    const index = path.lastIndexOf('/');
    return path.slice(0, index);
  }

  function admin_account(users) {
    console.log("user_data: ",user)
    return users.some(user => user.is_superuser);
  }
    function staff_account(users) {
    return users.some(user => user.is_staff);
  }

  function getFullNames(users) {
    let fname;
    let lname;
    users.map(user => { fname = user.first_name; lname = user.last_name });
    return fname + " " + lname
  }

  const admin = admin_account(user);
  const full_name = getFullNames(user);
  const staff = staff_account(user);

  let data;
  if(!admin && staff) {
    data = SidebarData_teacher.map((val, key) => {
      return (
        <li
          key={key}
          className="row"
          id={window.location.pathname == val.link || removeIdFromPath(window.location.pathname) == val.link2 ? "active" : ""}
          onClick={() => {
            window.location.pathname = val.link;
          }}
          
        >
    
          <div id="icon">{val.icon}</div> <div id="title">{val.title}   </div>
        </li>
      );
    })
  }

  else if (admin || staff) {
    data = SidebarData.map((val, key) => {
      return (
        <li
          key={key}
          className="row"
          id={window.location.pathname == val.link || removeIdFromPath(window.location.pathname) == val.link2 ? "active" : ""}
          onClick={() => {
            window.location.pathname = val.link;
          }}
        >
          <div id="icon">{val.icon}</div> <div id="title">{val.title} </div>
        </li>
      );
    })
  }
  else{
    data = null
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        className="fixed top-2 left-4 z-50 bg-gray-800 text-white p-2 rounded-md shadow-md focus:outline-none"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{ transition: 'left 0.3s' }}
      >
        {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* Sidebar */}
      <div
        className={`Sidebar fixed top-0 left-0 h-full bg-[#1a1a2e] transition-transform duration-300 z-40 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: '210px', minWidth: '200px', maxWidth: '300px' }}
      >
        <div className='mx-auto p-3 '>
          <div className="text-white font-bold text-center text-2xl ">
            <img src="/images/quexgen.png" alt="jbj" style={{ height: '80px', width: '80px' }} className='mx-auto' />
            Quexgen
          </div>
        </div>
        <ul className="SidebarList">
          {data?(data):(<Sidebarload/>)}
          
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
