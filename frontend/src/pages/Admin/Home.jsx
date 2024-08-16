import React, { useState, useEffect } from 'react';

import api from "../../api";

function Home() {

  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  
  
  useEffect(() => {
    document.title = "Home";
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

export default Home;
