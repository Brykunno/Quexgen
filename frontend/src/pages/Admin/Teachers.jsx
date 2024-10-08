import React, { useState, useEffect } from 'react';
import api from "../../api";
import Add_user from './Add_user';
import { Table, Pagination, Button, Modal, Radio, Label, TextInput } from 'flowbite-react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import HideSourceIcon from '@mui/icons-material/HideSource';
import Topnavbar from '../../components/Topnavbar';
import ToastMessage from '../../components/Toast';

function Teachers() {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [username, setUsername] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [is_staff, setIsStaff] = useState(false);
  const [is_superuser, setIsSuperuser] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    document.title = "Home";
    getUser();
  });

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

  const openEditModal = (user) => {
    setSelectedUserId(user.id);
    setUsername(user.username);
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setIsStaff(user.is_staff);
    setIsSuperuser(user.is_superuser);
    setEmail(user.email);
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
  
    api
      .put(`/api/users/${selectedUserId}/`, updatedUser)
      .then((res) => {
        console.log('User updated successfully', res.data);
        getUser(); // Refresh the user list
        setOpenModal(false); // Close the modal
      })
      .catch((err) => {
        console.error('Error updating user:', err);
      });
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
        console.log('User archived successfully', res.data);
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
        console.log('User archived successfully', res.data);
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
      <Topnavbar title="Teachers / Users"/>
    <div className='content'>
      <div className='flex gap-10 '>
        <div style={{ flex: 0.4 }}>
          <Add_user setLoading={setLoading}/>
        </div>
        <div className='flex-1'>
          <div className="flex items-center mb-5">
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
          </div>
          <Table striped>
            <Table.Head>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>First Name</Table.HeadCell>
              <Table.HeadCell>Last Name</Table.HeadCell>
              <Table.HeadCell>Position</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {currentUsers.length > 0 ? (
                currentUsers.map((user, index) => (
                  <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {user.username}
                    </Table.Cell>
                    <Table.Cell>{user.first_name}</Table.Cell>
                    <Table.Cell>{user.last_name}</Table.Cell>
                    <Table.Cell>{user.is_staff ? 'Teacher' : 'Admin'}</Table.Cell>
                    <Table.Cell className='flex gap-3'>
                      <Button
                        color={'primary'}
                        size={'xs'}
                        onClick={() => openEditModal(user)}
                        className='flex gap-3'
                      >
                        <VisibilityIcon />
                        <p className='mt-1 ml-1'>View</p>
                      </Button>
                     
                      {user.is_active!==true? <Button size={'xs'} color={'success'} onClick={()=>{handleUserActivate(user.id)}}><PowerSettingsNewIcon/><p className='mt-1 ml-1'>Activate</p></Button>:  <Button size={'xs'} color={'failure'} onClick={()=>{handleUserArchive(user.id)}}><HideSourceIcon/><p className='mt-1 ml-1'>Deactivate</p></Button>}
                    </Table.Cell>
                    <Table.Cell>{user.is_active ? 'Active' : 'Inactive'}</Table.Cell>
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
                      <Label htmlFor="teacher">Teacher</Label>
                    </div>
                  </div>
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
              <Button color={'primary'} onClick={handleUserUpdate}>Update</Button>
              
              <Button color="gray" onClick={() => setOpenModal(false)}>
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
            {loading && <ToastMessage message="Instructor successflly added!" setToast={setLoading}/>}
          </div>
        </div>
      </div>
    </div></div>
  );
}

export default Teachers;
