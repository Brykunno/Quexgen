import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import api from "../../api";

function Teachers() {
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    
    
    useEffect(() => {
      document.title = "Home";
      getUser();
    }, []);
  
    const getUser = () => {
      api
        .get(`/api/teachers/`)
        .then((res) => res.data)
        .then((data) => {
          setUser(data);
          console.log(data);
        })
        .catch((err) => alert(err));
    };
  
  
  
    return (
      <div className='content'>
        <h1>User Detail</h1>
        {user.map((user) => (
             <div>
             <p>Username: {user.username}</p>
             <p>First Name: {user.first_name}</p>
             <p>Last Name: {user.last_name}</p>
             <p>Email: {user.email}</p>
           </div>
          ))}
       
      </div>
    );
  }

export default Teachers
