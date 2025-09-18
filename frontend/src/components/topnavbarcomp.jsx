
import {

    Dropdown,
    DropdownDivider,
    DropdownHeader,
    DropdownItem,
    Navbar,
    NavbarBrand,
    NavbarCollapse,
    NavbarLink,
    NavbarToggle,
  } from "flowbite-react";
  import Avatar from '@mui/material/Avatar';
  import React, { useState, useEffect } from 'react';
  import { SidebarData } from "./SidebarData";
  import { SidebarData_teacher } from "./SidebarData_teacher";
  import api from "../api";
  import "../styles/Topnavbar.css"
  
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
  
  
  
  function Topnavbarcomp() {
  
    
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
  
  
  
  
  
  function admin_account(users) {
    return users.some(user => user.is_superuser);
  }
  
  function getFullNames(users) {
      let fname;
      let lname;
      users.map(user => {fname = user.first_name ; lname = user.last_name});
  
      return fname + " " + lname
    }
  
    function getEmail(users) {
      let email;
    
      users.map(user => {email = user.email });
  
      return email
    }
  
  
  
  
  const admin = admin_account(user);
  const full_name = getFullNames(user);
  const email = getEmail(user);
  
  
  
  let data;
  if(admin == 1){
      data =  SidebarData.map((val, key) => {
          return (
            <NavbarLink
              key={key}
              className="row"
              id={window.location.pathname == val.link? "active":""}
              onClick={() => {
                window.location.pathname = val.link;
              }}
            >
              {/* <div id="icon">{val.icon}</div> <div id="title">{val.title}</div> */}
             <div id="title">{val.title}</div>
            </NavbarLink>
          );
        })
  }
  else{
      data =  SidebarData_teacher.map((val, key) => {
          return (
            <NavbarLink
              key={key}
              className="row"
              id={window.location.pathname == val.link? "active":""}
              onClick={() => {
                window.location.pathname = val.link;
              }}
            >
             <div id="title">{val.title}</div>
            </NavbarLink>
          );
        })
  }
    return (
      <Navbar fluid rounded className="topnavbar">
        <NavbarBrand href="https://flowbite-react.com">
         
          <span className="self-center whitespace-nowrap text-xl font-semibold text-white">Quexgen</span>
        </NavbarBrand>
        <div className="flex md:order-2">
          <Dropdown
          size={'xs'}
            arrowIcon={false}
            inline
            label={
              <Avatar {...stringAvatar(full_name)} size='large' />
            }
          >
            <DropdownHeader>
              <span className="block text-sm">{full_name}</span>
              <span className="block truncate text-sm font-medium">{email}</span>
            </DropdownHeader>
            <DropdownItem>Dashboard</DropdownItem>
            <DropdownItem>Settings</DropdownItem>
            <DropdownItem>Earnings</DropdownItem>
            <DropdownDivider />
            <DropdownItem href="/logout">Sign out</DropdownItem>
          </Dropdown>
          <NavbarToggle />
        </div>
        <NavbarCollapse className="SidebarList">
        {data}
        </NavbarCollapse>
      </Navbar>
    );
  }
  
  export default Topnavbarcomp
  