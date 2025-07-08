import Admin_layout from '@/Layouts/Admin_layout';
import React, { createContext,useEffect, useState } from 'react';
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { AddCourse } from './sheet';
import api from '@/lib/api';

export const DataContext = createContext();

function Courses() {

  const [refresh, setRefresh] = useState(false);


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
  }, [refresh]);

  


  // useEffect(() => {
    return (
        <DataContext.Provider value={{setRefresh}} >
          <Admin_layout title={"Courses"}>
              <div className="container mx-auto py-10">
                    <DataTable columns={columns} data={data} AddCourse={AddCourse} />
                  </div>
    
          </Admin_layout>
          
        </DataContext.Provider>
      )
}

export default Courses
