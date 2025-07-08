import React, { useState, useEffect } from 'react';
import { Card, TextInput, Label, Button as FlowButton } from 'flowbite-react';
import api from "../../api";
import Avatar from '@mui/material/Avatar';
import LoadingSubmit from '../../components/LoadingSubmit';
import Topnavbar from '../../components/Topnavbar';

// --- MUI Upload Button ---
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function InputFileUpload({ onChange }) {
  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
      sx={{ width: '100%', mt: 1 }}
    >
      Upload image
      <VisuallyHiddenInput
        type="file"
        onChange={onChange}
        accept="image/*"
      />
    </Button>
  );
}
// --- end MUI Upload Button ---

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

function Admin_profile() {
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
    <div className="min-h-screen bg-gray-100">
      <Topnavbar title="Profile"/>
      <div className="flex justify-center items-center min-h-[80vh]">
        <Card style={{ width: '100%', maxWidth: '600px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }} className="mx-auto mt-10">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="flex flex-col items-center w-full md:w-1/3">
              {userInfo.profile_image !== null ? (
                <img
                  src={typeof userInfo.profile_image === 'object' && userInfo.profile_image !== null && !Array.isArray(userInfo.profile_image) ? URL.createObjectURL(userInfo.profile_image) : userInfo.profile_image_url}
                  alt="Profile"
                  style={{
                    width: '140px',
                    height: '140px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '4px solid #e5e7eb',
                  }}
                  className="mx-auto mb-3 shadow"
                />
              ) : (
                <Avatar {...stringAvatar("admin admin")} sx={{ width: 140, height: 140, fontSize: 48, margin: '0 auto 12px auto' }} />
              )}
              {/* Use the custom MUI upload button */}
              <InputFileUpload onChange={e => handleChange(e, 'profile_image')} />
            </div>
            <div className="flex-1 w-full">
              <div className="mb-4">
                <Label value="Username:" className="font-semibold" />
                <TextInput value={userInfo.username} onChange={(e) => handleChange(e, 'username')} className="mt-1" />
              </div>
              <div className="mb-4">
                <Label value="First Name:" className="font-semibold" />
                <TextInput value={userInfo.first_name} onChange={(e) => handleChange(e, 'first_name')} className="mt-1" />
              </div>
              <div className="mb-4">
                <Label value="Last Name:" className="font-semibold" />
                <TextInput value={userInfo.last_name} onChange={(e) => handleChange(e, 'last_name')} className="mt-1" />
              </div>
              <div className="mb-4">
                <Label value="Email:" className="font-semibold" />
                <TextInput value={userInfo.email} onChange={(e) => handleChange(e, 'email')} className="mt-1" />
              </div>
              <div className="flex justify-end">
                <FlowButton color="primary" onClick={updateProfile} disabled={loading}>
                  {loading ? <LoadingSubmit /> : "Update"}
                </FlowButton>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Admin_profile;
