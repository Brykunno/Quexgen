import React, { useState, useEffect } from 'react';
import { Card, TextInput, Label, Button, FileInput } from 'flowbite-react';
import api from "../../api";
import Avatar from '@mui/material/Avatar';
import LoadingSubmit from '../../components/LoadingSubmit';
import Topnavbar from '../../components/Topnavbar';

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

const img_dir = String(localStorage.getItem('img_dir'))

function Profile() {
  const [loading, setLoading] = useState(false);
  const [initialUserInfo, setInitialUserInfo] = useState(null);
  const [userInfo, setUserInfo] = useState({
    id: 0,
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    profile_image: null,
    profile_image_url: ''
  });

  useEffect(() => {
    document.title = "Profile";
    getUser();
  }, []);

  const getUser = () => {
    api.get(`/api/user/account/`)
      .then((res) => res.data)
      .then((data) => {
        const fetchedData = {
          id: data[0].id,
          username: data[0].username,
          first_name: data[0].first_name,
          last_name: data[0].last_name,
          email: data[0].email,
          profile_image: data[0].profile_image,
          profile_image_url: `${img_dir}${data[0].profile_image_url}`
        };
        setUserInfo(fetchedData);
        setInitialUserInfo(fetchedData);
      })
      .catch((err) => alert(err));
  };

  const updateProfile = () => {
    const formData = new FormData();
    setLoading(true);

    for (const key in userInfo) {
      if (userInfo[key] !== null && key !== 'profile_image') {
        if (userInfo[key] !== initialUserInfo[key]) {
          formData.append(key, userInfo[key]);
        }
      }
    }

    if (userInfo.profile_image && userInfo.profile_image !== initialUserInfo.profile_image) {
      formData.append('profile_image', userInfo.profile_image);
    }

    api.put(`/api/users/${userInfo.id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => res.data)
    .then((data) => {
      console.log(data);
      setLoading(false);
      getUser(); // Optionally refresh the user data after update
    })
    .catch((err) => {
      console.error(err);
      setLoading(false);
      alert('Failed to update profile');
    });
  };

  const handleChange = (e, field) => {
    const value = field === 'profile_image' ? e.target.files[0] : e.target.value;
    setUserInfo({
      ...userInfo,
      [field]: value,
    });
  };

  return (
    <div>
          <Topnavbar title="Profile"/>
    <div className="content">
      <Card style={{ width: '700px' }} className=' mx-auto mt-24'>
        <div className="flex gap-5">
          <div style={{ flex: 1 }}>
            {userInfo.profile_image || userInfo.profile_image_url ? (
              <img
              src={typeof userInfo.profile_image === 'object' && userInfo.profile_image !== null && !Array.isArray(userInfo.profile_image) ? URL.createObjectURL(userInfo.profile_image) : userInfo.profile_image_url}
                alt="Profile"
                style={{
                  width: '180px',
                  height: '180px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
                className="mx-auto mb-3"
              />
            ) : (
              <Avatar {...stringAvatar(userInfo.first_name + ' ' + userInfo.last_name)} size="large" style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                objectFit: 'cover',
              }} className="mb-3 mx-auto" />
            )}
            <div className="mb-3 flex-1 gap-3 justify-end">
              <FileInput id="file" onChange={(e) => handleChange(e, 'profile_image')} size="xs" />
            </div>
          </div>
          <div className="flex-1">
            <div className="mb-3 flex gap-3 justify-end">
              <Label value="Username:" className="mt-2 font-bold" />
              <TextInput value={userInfo.username} onChange={(e) => handleChange(e, 'username')} />
            </div>
            <div className="mb-3 flex gap-3 justify-end">
              <Label value="First name:" className="mt-2 font-bold" />
              <TextInput value={userInfo.first_name} onChange={(e) => handleChange(e, 'first_name')} />
            </div>
            <div className="mb-3 flex gap-3 justify-end">
              <Label value="Last name:" className="mt-2 font-bold" />
              <TextInput value={userInfo.last_name} onChange={(e) => handleChange(e, 'last_name')} />
            </div>
            <div className="mb-3 flex gap-3 justify-end">
              <Label value="Email:" className="mt-2 font-bold" />
              <TextInput value={userInfo.email} onChange={(e) => handleChange(e, 'email')} />
            </div>
            <div className="mb-3 flex gap-3 justify-center">
             <Button color={'primary'} href='/password-reset' >Reset password</Button>
            </div>
          </div>
        </div>
        {loading && <LoadingSubmit />}
        <Button color="primary" onClick={updateProfile}>Update</Button>
      </Card>
      {JSON.stringify(userInfo)}
    </div></div>
  );
}

export default Profile;
