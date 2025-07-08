import Admin_layout from '@/Layouts/Admin_layout';
import React, { useEffect, useState } from 'react';
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { AddUser } from './sheet';
import api from '@/lib/api';

function Exams() {
  const [data, setData] = useState([]);


  useEffect(() => {
    const getData = async () => {
      try {
        const res = await api.get(`/api/courses/`);
        setData(res.data);
      } catch (err) {
        alert(err);
      }
    };

    getData();
  }, []);

  // useEffect(() => {
  //   async function fetchPosts() {
  //     const res = await api.get(
  //       "https://res.cloudinary.com/dlzlfasou/raw/upload/users-01_fertyx.json",
  //     );
  //     const data = await res.json();
  //     setData(data);
  //   }
  //   fetchPosts();
  // }, []);

  return (
    <Admin_layout title="Exams">
   
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data} AddUser={AddUser} />
 
      </div>
    </Admin_layout>
  );
}

export default Exams;
