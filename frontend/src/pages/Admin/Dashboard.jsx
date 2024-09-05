import React, { useState, useEffect } from 'react';
import api from "../../api";
import { Card } from 'flowbite-react';

function Dashboard() {
  const [user, setUser] = useState([]);
  const [TOSInfo, setTOSInfo] = useState([]);

  useEffect(() => {
    document.title = "Home";
    getUser();
    getTOSInfo();
  }, []);

  const getUser = () => {
    api.get(`/api/user/account/admin/`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const getTOSInfo = () => {
    api
      .get(`/api/tos-info/detail/admin/`)
      .then((res) => res.data)
      .then((data) => {
        setTOSInfo(data);
        console.log('tosinfo: ', data);
      })
      .catch((err) => alert(err));
  };

  // Filter out users where is_staff is false
  const StaffUsersCount = user.filter((u) => u.is_staff === true).length;
  const toreviewCount = TOSInfo.filter((r) => r.Status === 1).length;

  return (
    <div className='content'>
      <div className='flex flex-col gap-5'>
        <div className='flex gap-5'>
          <Card className='flex-1'>
            Teachers: {StaffUsersCount} {/* Display count of non-staff users */}
          </Card>
          <Card className='flex-1'>Exams: {TOSInfo.length}</Card>
          <Card className='flex-1'>To Review {toreviewCount}</Card>
        </div>
        <Card></Card>
      </div>
    </div>
  );
}

export default Dashboard;
