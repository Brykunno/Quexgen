import React, { useState, useEffect } from 'react';
import api from "../../api";
import Add_user from './Add_user';
import {Button} from "@mui/material";
import { Table, Pagination, Modal, Radio, Label, TextInput } from 'flowbite-react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import HideSourceIcon from '@mui/icons-material/HideSource';
import Topnavbar from '../../components/Topnavbar';
import ToastMessage from '../../components/Toast';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Autocomplete, TextField, Chip } from '@mui/material';
import { useSnackbar } from 'notistack';
import useAppSnackbar from '../../components/ui/snackbar/Snackbar';

function Instructors() {
   const { showSnackbar } = useAppSnackbar();
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage] = useState(7);
  const [openModal, setOpenModal] = useState(false);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [username, setUsername] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [is_staff, setIsStaff] = useState(false);
  const [is_superuser, setIsSuperuser] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [testError,setTestError] = useState(false);
  const [options,setOptions] = useState([]);
  const [teacherCourse,setTeacherCourse] = useState([])
  const [updateTC,setUpdateTC] = useState([])

  const [courses,setCourses] = useState([])

  const [updateOptions,setUpdateOptions] = useState([]);
  const [refresh,setRefresh] = useState(false)



  useEffect(() => {
    api.get(`/api/courses/`)
      .then((res) => {
        const courseNames = res.data.filter((course) => course.status!="archived").map((course) => course.course_name);// Extract course names
        setOptions(courseNames); // Update state once with the full array
        setCourses(res.data)
      })
      .catch((err) => {
        console.error("Error fetching courses:", err);
      });
api.get(`/api/teacherCourse/`)
      .then((res) => {
       
        setTeacherCourse(res.data);
        
      })
      .catch((err) => {
        console.error("Error fetching courses:", err);
      });

  }, [refresh]);

  
  

  useEffect(() => {
    api.get(`/api/courses/`)
      .then((res) => {
        const courseNames = res.data.filter((course) => course.status!="archived").map((course) => course.course_name); // Extract course names
        setOptions(courseNames); // Update state once with the full array
 
      })
      .catch((err) => {
        console.error("Error fetching courses:", err);
      });
  }, [refresh]);

  useEffect(() => {
    document.title = "Home";
    getUser();
  },[refresh]);

  const getUser = () => {
    api.get(`/api/user/account/admin/`)
      .then((res) => {
        setUser(res.data);
      
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

  const openEditModal = (user,courses,tc) => {

    const teacherCourses = tc.filter(course => course.user_id === user.id);
    const teacherCourseIds = teacherCourses .map(course => course.course_id);
    const filteredCourses = courses.filter(course => teacherCourseIds.includes(course.id));
    setUpdateOptions(filteredCourses.map(course => course.course_name))
    setSelectedUserId(user.id);
    setUsername(user.username);
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setIsStaff(user.is_staff);
    setIsSuperuser(user.is_superuser);
    setEmail(user.email);
    setUpdateTC()
    setOpenModal(true);
  };

  const handleUserUpdate = () => {
    const updatedUser = {
      username,
      first_name,
      last_name,
      is_staff,
      is_superuser,
      email,
    };
  
    // Get the course IDs associated with the selected user
    const tcIds = teacherCourse
      .filter(course => course.user_id == selectedUserId) // Filter the courses matching the user_id
      .map(course => course.id); // Get the ids of the matching courses
  
    
  
    // Update the user details
    api
      .put(`/api/users/${selectedUserId}/`, updatedUser)
      .then((res) => {

        getUser(); // Refresh the user list after the update
            setRefresh((prev)=> !prev)
      })
      .catch((err) => {
        console.error('Error updating user:', err);
      });
  
    // Delete the teacher courses
    tcIds.forEach((courseId) => {
      api
        .delete(`/api/teacherCourse/${courseId}/`)
        .then((res) => {
          
          // Optionally, refresh the teacher courses if needed
          getUser(); // Refresh the teacher courses
          setOpenModal(false); // Close the modal
          setRefresh((prev)=> !prev)
        })
        .catch((err) => {
          console.error('Error deleting teacher course:', err);
        });
    });
  
    // Now, add new teacher courses based on the selected courses (updateOptions)
    const user_id = selectedUserId;
  
    // Loop through courses and add the selected ones
    updateOptions.forEach((courseName) => {
      const course = courses.find(course => course.course_name === courseName);
      if (course) {
        const course_id = course.id;
        // Assign the teacher to the new course
        api
          .post(`/api/teacherCourse/`, { user_id, course_id })
          .then((res) => {
            
            getUser(); // Refresh the teacher courses after assignment
            setRefresh((prev)=> !prev)
          })
          .catch((err) => {
            console.error('Error assigning teacher to course:', err);
          });
      }
    });

    showSnackbar("User successfully updated!", { variant: 'success' });
  };
  
  

  const filteredUsers = user.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserArchive = (selectedUserId) => {
    const updatedUser = {
      is_active: false
    };
    
    api
      .patch(`/api/users/${selectedUserId}/`, updatedUser)
      .then((res) => {
        
        getUser(); // Refresh the user list
        setOpenModal(false); // Close the modal
        
      })
      .catch((err) => {
        console.error('Error archiving user:', err);
      });
  };

  
  const handleUserActivate = (selectedUserId) => {
    const updatedUser = {
      is_active: true
    };
    
    api
      .patch(`/api/users/${selectedUserId}/`, updatedUser)
      .then((res) => {
        
        getUser(); // Refresh the user list
        setOpenModal(false); // Close the modal
      })
      .catch((err) => {
        console.error('Error archiving user:', err);
      });
  };


  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div>
      <Topnavbar title="Instructors / Users"/>
    <div className='content'>
      <div className='flex gap-10 '>
     
        <div className='flex-1'>
        
          <div className="flex items-center my-5 justify-between">
            <div className="relative shadow-lg">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
              <input
                type="text"
                placeholder="Search by username"
                className="p-2 pl-10 border border-gray-300 rounded w-full text-sm"
                value={searchTerm}
                onChange={handleSearch} // Real-time search here
              />
            </div>

            <Button
                        color={'primary'}
                        variant='contained'
                        size={'small'}
                        onClick={() => setOpenModalAdd(true)}
                        className='flex gap-1'
                      >
                        <PersonAddIcon />
                        <p className='mt-1 ml-1'>Add user</p>
                      </Button>
                     
          </div>
          <Table striped>
            <Table.Head>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell className="hidden lg:table-cell">First Name</Table.HeadCell>
              <Table.HeadCell className="hidden lg:table-cell">Last Name</Table.HeadCell>
              <Table.HeadCell className="hidden lg:table-cell">Position</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
              <Table.HeadCell >Status</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {currentUsers.length > 0 ? (
                currentUsers.map((user, index) => (
                  <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {user.username}
                    </Table.Cell>
                    <Table.Cell className="hidden lg:table-cell">{user.first_name}</Table.Cell>
                    <Table.Cell className="hidden lg:table-cell">{user.last_name}</Table.Cell>
                    <Table.Cell className="hidden lg:table-cell">{user.is_staff ? 'Instructor' : 'Admin'}</Table.Cell>
                    <Table.Cell className="flex gap-3">
                      <Button
                        color={'primary'}
                        variant='contained'
                        size={'small'}
                        onClick={() => openEditModal(user,courses,teacherCourse)}
                        className='flex gap-1'
                      >
                        <VisibilityIcon />
                        <p className='mt-1 ml-1'>View</p>
                      </Button>
                     
                      {user.is_active!==true? <Button size={'small'} variant='contained' color={'success'} onClick={()=>{handleUserActivate(user.id)}}><PowerSettingsNewIcon/><p className='mt-1 ml-1'>Activate</p></Button>:  <Button size={'small'} variant='contained' color={'error'} onClick={()=>{handleUserArchive(user.id)}}><HideSourceIcon/><p className='mt-1 ml-1'>Deactivate</p></Button>}
                    </Table.Cell>
                    <Table.Cell >
                      {user.is_active ? (
                        <div className='text-green-600 font-bold'>Active</div>
                      ) : (
                        <div className='text-red-600 font-bold'>Deactivated</div>
                      )}
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
            <Modal.Header>User Information</Modal.Header>
            <Modal.Body>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="uname" value="Username" />
                  <TextInput
                    id="uname"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="first_name" value="First Name" />
                  <TextInput
                    id="first_name"
                    type="text"
                    value={first_name}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="last_name" value="Last Name" />
                  <TextInput
                    id="last_name"
                    type="text"
                    value={last_name}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex max-w-md flex-col gap-4">
                  <Label>User Type</Label>
                  <div className="flex gap-10">
                    <div className="flex items-center gap-2">
                      <Radio
                        id="superuser"
                        name="account"
                        value="superuser"
                        checked={is_superuser}
                        onChange={() => { setIsSuperuser(true); setIsStaff(false); }}
                      />
                      <Label htmlFor="superuser">Admin</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Radio
                        id="teacher"
                        name="account"
                        value="teacher"
                        checked={is_staff}
                        onChange={() => { setIsSuperuser(false); setIsStaff(true); }}
                      />
                      <Label htmlFor="teacher">Instructor</Label>
                    </div>
                  </div>
                </div>

                <div>
                <Autocomplete
  multiple
  id="chip-selection"
  className={is_superuser?'hidden':'show'}
  name="ExaminationType"
  options={options} // List of options
  value={updateOptions} // Current selected options
  onChange={(event, newValue) => {
    setUpdateOptions(newValue); // Directly set the updated list
  }}
  renderTags={(value, getTagProps) =>
    value.map((option, index) => (
      <Chip
        variant="outlined"
        label={option}
        {...getTagProps({ index })}
        key={index}
      />
    ))
  }
  renderInput={(params) => (
    <TextField
      error={testError}
      {...params}
      variant="outlined"
      label="Courses"
    />
  )}
/>
                </div>
                <div>
                  <Label htmlFor="email" value="Email" />
                  <TextInput
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
               
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button color={'primary'} variant='contained' onClick={handleUserUpdate}>Update</Button>
              
              <Button  onClick={() => setOpenModal(false)}>
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>

      <Add_user refresh={refresh} setRefresh={setRefresh} setOpenModalAdd={setOpenModalAdd} openModalAdd={openModalAdd} setLoading={setLoading}/>

          <div className="flex justify-center mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              showIcons
            />

          </div>
        </div>
      </div>
    </div></div>
  );
}

export default Instructors;
