import Admin_layout from '@/Layouts/Admin_layout';
import React, {  createContext,useEffect, useState } from 'react';
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { AddUser } from './sheet';
import api from '@/lib/api';

export const DataContext = createContext();

function Instructors() {
    const [refresh, setRefresh] = useState(false);
  const [data, setData] = useState([]);


  useEffect(() => {
    const getData = async () => {
      try {
        const res = await api.get(`/api/user/`);
        setData(res.data);
      } catch (err) {
        alert(err);
      }
    };

    getData();
  }, [refresh]);


  return  <DataContext.Provider value={{setRefresh}}>
      <Admin_layout title="Users">
   
  <div className="container mx-auto py-10">
    <DataTable columns={columns} data={data} AddUser={AddUser} />

  </div>
</Admin_layout>
</DataContext.Provider>
}

export default Instructors
