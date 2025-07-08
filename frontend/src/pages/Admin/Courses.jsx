
import React, { useState, useEffect } from 'react';
import api from "../../api";
import Add_Course from './Add_Course';
import {Button} from "@mui/material";
import { Table, Pagination,FileInput,  Modal, Radio, Label, TextInput } from 'flowbite-react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import HideSourceIcon from '@mui/icons-material/HideSource';
import Topnavbar from '../../components/Topnavbar';
import ToastMessage from '../../components/Toast';
import { Worker } from '@react-pdf-viewer/core';  // Import the Worker component
import { Viewer } from '@react-pdf-viewer/core';  // Import the Viewer component
import '@react-pdf-viewer/core/lib/styles/index.css';  // Import necessary styles



// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css';



function Courses() {
  const [course, setcourse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage] = useState(7);
  const [openModal, setOpenModal] = useState(false);
  const [course_name, setcourse_name] = useState("");
  const [course_code, setcourse_code] = useState("");
  const [course_type, setcourse_type] = useState("");
  const [course_syllabus, setcourse_syllabus] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [refresh,setRefresh] = useState(false);

  useEffect(() => {
    document.title = "Home";
    getUser();
  },[refresh]);

  const getUser = () => {
    api.get(`/api/courses/`)
      .then((res) => {
        setcourse(res.data);
        
      })
      .catch((err) => {
        alert(err);
        
      });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const openEditModal = (user) => {
    setSelectedUserId(user.id);
    setcourse_name(user.course_name);
    setcourse_code(user.course_code);
    setcourse_type(user.course_type);
    
    setOpenModal(true);
  };

  const handleUserUpdate = () => {
    const formData = new FormData();
  
    // Append all form data to the FormData object
    formData.append("course_name", course_name);
    formData.append("course_code", course_code);
    formData.append("course_type", course_type);
  
    // Append file only if it's selected (not null)
    if (course_syllabus) {
      formData.append("course_syllabus", course_syllabus);
    }
  
    api
      .put(`/api/courses/${selectedUserId}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log("Course updated successfully", res.data);
        getUser(); // Refresh the course list
        setOpenModal(false); // Close the modal
      })
      .catch((err) => {
        console.error("Error updating course:", err);
      });
  };
  

  const handleUserDelete = () => {
    api
      .delete(`/api/courses/${selectedUserId}/`) // Remove the unnecessary parameter
      .then((res) => {
        console.log('User deleted successfully', res.data);
        getUser(); // Refresh the user list
        setOpenModal(false); // Close the modal
      })
      .catch((err) => {
        console.error('Error deleting user:', err);
      });
  };
  
  const filteredUsers = course.filter((user) =>
    user.course_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  
 

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    setcourse_syllabus(file); // Update state with the file
  };

  return (
    <div>
        <Topnavbar title="Courses"/>
        <div className="content">

        <div className='flex flex-col xl:flex-row gap-10 '>
        <div style={{ flex: 0.4 }}>
          <Add_Course setLoading={setLoading} setRefresh={setRefresh}/>
        </div>
        <div className='flex-1'>
          <div className="flex items-center mb-5">
            <div className="relative shadow-lg">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
              <input
                type="text"
                placeholder="Search by course name"
                className="p-2 pl-10 border border-gray-300 rounded w-full text-sm"
                value={searchTerm}
                onChange={handleSearch} // Real-time search here
              />
            </div>
          </div>
          <Table striped>
            <Table.Head>
              <Table.HeadCell>Course Name</Table.HeadCell>
              <Table.HeadCell>Course Code</Table.HeadCell>
              <Table.HeadCell className="hidden lg:table-cell" >Course Type</Table.HeadCell>
           
              <Table.HeadCell>Action</Table.HeadCell>
              
            </Table.Head>
            <Table.Body className="divide-y">
              {currentUsers.length > 0 ? (
                currentUsers.map((user, index) => (
                  <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {user.course_name}
                    </Table.Cell>
                    <Table.Cell>{user.course_code}</Table.Cell>
                    <Table.Cell className="hidden lg:table-cell">{user.course_type}</Table.Cell>
                    
                    <Table.Cell className='flex gap-3'>
                      <Button
                        color={'primary'}
                        variant='contained'
                        size={'small'}
                        onClick={() => openEditModal(user)}
                        className='flex gap-1'
                      >
                        <VisibilityIcon />
                        <p className='mt-1 ml-1'>View</p>
                      </Button>
                     
                    
                    </Table.Cell>
                   
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={'5'}>
                    <p className='text-center'>No users found for "{searchTerm}".</p>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>

          <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
            <Modal.Header>Course Information</Modal.Header>
            <Modal.Body>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="uname" value="Course name" />
                  <TextInput
                    id="uname"
                    type="text"
                    value={course_name}
                    onChange={(e) => setcourse_name(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="course_code" value="Course code" />
                  <TextInput
                    id="course_code"
                    type="text"
                    value={course_code}
                    onChange={(e) => setcourse_code(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="course_type" value="Course type" />
                  <TextInput
                    id="course_type"
                    type="text"
                    value={course_type}
                    onChange={(e) => setcourse_type(e.target.value)}
                    required
                  />
                </div>

                <div>
  <Label htmlFor="course_syllabus" value="Course syllabus" />
  <FileInput
    id="course_syllabus"
    onChange={handleFileChange} // Calls the file change handler
    required={false} // Not required for updates
  />
</div>
               
              
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button color={'primary'} variant='contained' onClick={handleUserUpdate}>Update</Button>
              <Button color={'error'} variant='contained' onClick={handleUserDelete}>Delete</Button>
              
              <Button color="secondary" onClick={() => setOpenModal(false)}>
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>

          <div className="flex justify-center mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              showIcons
            />
            {loading && <ToastMessage message="course successfully added!" setToast={setLoading}/>}
          </div>
        </div>
      </div>

            
        </div>
      
    </div>
  )
}

export default Courses
