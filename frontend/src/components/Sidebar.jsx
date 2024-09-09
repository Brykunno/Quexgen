import React, { useState, useEffect } from 'react';
import { SidebarData } from "./SidebarData";
import { SidebarData_teacher } from "./SidebarData_teacher";
import api from "../api";
import Avatar from '@mui/material/Avatar';




function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

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



function Sidebar() {

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
          console.log(data);
        })
        .catch((err) => alert(err));
    };
  
  
    function removeIdFromPath(path) {
      const index = path.lastIndexOf('/');
      return path.slice(0, index);  // Remove everything after the last '/'
    }
    
  
    function admin_account(users) {
      return users.some(user => user.is_superuser);
    }

    function getFullNames(users) {
        let fname;
        let lname;
        users.map(user => {fname = user.first_name ; lname = user.last_name});

        return fname + " " + lname
      }


    console.log(admin_account(user));
    console.log(getFullNames(user));
    const admin = admin_account(user);
    const full_name = getFullNames(user);
  

    let data;
    if(admin == 1){
        data =  SidebarData.map((val, key) => {
            return (
              <li
                key={key}
                className="row"
                id={window.location.pathname == val.link || removeIdFromPath(window.location.pathname) == val.link2 ? "active":""}
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
        data =  SidebarData_teacher.map((val, key) => {
            return (
              <li
                key={key}
                className="row"
                id={window.location.pathname == val.link || removeIdFromPath(window.location.pathname) == val.link2? "active":""}
                onClick={() => {
                  window.location.pathname = val.link;
                }}
              >
                <div id="icon">{val.icon}</div> <div id="title">{val.title} </div>
              </li>
            );
          })
    }
  return (
    <div className="Sidebar ">

      <div className='mx-auto p-3 '>
<div className="text-white font-bold text-center text-2xl ">

  <img src="/images/quexgen.png" alt="jbj" style={{height:'80px',width:'80px'}} className='mx-auto'/>
  
  Quexgen
  
  </div>
      </div>
     

      <ul className="SidebarList">

        {data}
       
      </ul>
    </div>
  );
}

export default Sidebar;
