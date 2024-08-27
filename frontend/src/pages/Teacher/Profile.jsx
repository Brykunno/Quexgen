import React, { useState, useEffect } from 'react';
import { Card,TextInput,Label,Button } from 'flowbite-react';

import api from "../../api";

function Profile() {

  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  
  
  useEffect(() => {
    document.title = "Profile";
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
    <div className="flex items-center justify-center min-h-screen">
    <Card style={{width:'500px'}}>
    
      {user.map((user) => (
        
           <div className='flex'>
            <div style={{flex:0.5}}></div>

            <div className='flex-1'>
           <div className='mb-3 flex gap-3 justify-end'>
              <Label value='Username:' className='mt-2 font-bold'></Label>
          
            <TextInput value={user.username}></TextInput>
            </div>

            <div className='mb-3 flex gap-3 justify-end'>
              <Label value='First name:' className='mt-2 font-bold'></Label>
          
            <TextInput value={user.first_name}></TextInput>
            </div>

            <div className='mb-3 flex gap-3 justify-end'>
              <Label value='Last name:' className='mt-2 font-bold'></Label>
          
            <TextInput value={user.last_name}></TextInput>
            </div>

            <div className='mb-3 flex gap-3 justify-end'>
              <Label value='Email:' className='mt-2 font-bold'></Label>
          
            <TextInput value={user.email}></TextInput>
            </div>
            
            </div>
         </div>
        ))}

<Button color={'primary'}>Update</Button>
    </Card>
  </div>
  );
}

export default Profile;
