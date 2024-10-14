
import {

  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,Card,Modal,Button
} from "flowbite-react";
import Avatar from '@mui/material/Avatar';
import React, { useState, useEffect } from 'react';
import { SidebarData } from "./SidebarData";
import { SidebarData_teacher } from "./SidebarData_teacher";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import api from "../api";
import "../styles/Topnavbar.css"
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import Badge from '@mui/material/Badge';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import dayjs from 'dayjs';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
const localizer = momentLocalizer(moment);
function formatDateTime(dateTimeString) {

 
  // Convert the string to a JavaScript Date object
  const date = new Date(dateTimeString);

  // Define options for formatting the date and time
  const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
  };

  // Format the date and time
  const formattedDate = date.toLocaleDateString('en-US', options);
  const formattedTime = date.toLocaleTimeString('en-US', options);

  // Combine date and time into a single string
  return `${formattedDate}`;
}
function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

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


function Topnavbar(props) {
  const [examDates, setExamDates] = useState({
    midterm_exam: '',
    finals_exam: '',
    summer_exam: ''
  });
  
const [user, setUser] = useState([]);
const [loading, setLoading] = useState(true);


const [openModal, setOpenModal] = useState(false);

useEffect(() => {

  getUser();
}, []);

useEffect(() => {
  
  getExamDates(1); // Fetch exam dates with ID 1
}, []);


const getExamDates = (id) => {
  api.get(`/api/exam-dates/${id}/`) // Adjust the endpoint as per your API
    .then((res) => {
      const { midterm_exam, finals_exam, summer_exam } = res.data;
      setExamDates({
        midterm_exam,
        finals_exam,
        summer_exam
      });
    })
    .catch((err) => {
      console.error('Error fetching exam dates:', err);
    });
};



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





function admin_account(users) {
  return users.some(user => user.is_superuser);
}

function getFullNames(users) {
    let fname;
    let lname;
    users.map(user => {fname = user.first_name ; lname = user.last_name});

    return fname + " " + lname
  }

  function getEmail(users) {
    let email;
  
    users.map(user => {email = user.email });

    return email
  }

  function getUserId(users) {
    let user_id;
  
    users.map(user => {user_id = user.id });

    return user_id
  }

  function getprofile(users) {
    let profile;
  
    users.map(user => {profile = user.profile_image_url });

    return profile
  }


console.log(admin_account(user));
console.log(getFullNames(user));
const admin = admin_account(user);
const full_name = getFullNames(user);
const email = getEmail(user);
const user_id = getUserId(user);
const profile = img_dir+getprofile(user);

const [notifData,setNotifData] = useState([])
const [notifnum,setNotifnum]=useState(0)

useEffect(() => {
  if (user_id) {

  getNotifContent();
  }
}, [user_id]);

let data;
if(admin == 1){
    data =  SidebarData.map((val, key) => {
        return (
          <NavbarLink
            key={key}
            className="row"
            id={window.location.pathname == val.link? "active":""}
            onClick={() => {
              window.location.pathname = val.link;
            }}
          >
            {/* <div id="icon">{val.icon}</div> <div id="title">{val.title}</div> */}
           <div id="title">{val.title}</div>
          </NavbarLink>
        
        );
      })






}
else{
    data =  SidebarData_teacher.map((val, key) => {
        return (
          <NavbarLink
            key={key}
            className="row"
            id={window.location.pathname == val.link? "active":""}
            onClick={() => {
              window.location.pathname = val.link;
            }}
          >
           <div id="title">{val.title}</div>
          </NavbarLink>
     
        );
      })
}

const getNotifContent = () => {
  if(admin === true){

    api
    .get(`api/notification/detail/admin/`)
    .then((res) => res.data)
    .then((data) => {setNotifData(data)
      console.log('notification: ', data);
      const unreadCount = data.filter(notification => notification.is_read === false).length;
        
        setNotifnum(unreadCount); // Set the count of unread notifications
    })
    .catch((err) => alert(err));
  }
  else{

    api
    .get(`api/notification/detail/teacher/`)
    .then((res) => res.data)
    .then((data) => {setNotifData(data)
      console.log('notification: ', data);
      const unreadCount = data.filter(notification => notification.is_read === false).length;
        
        setNotifnum(unreadCount); // Set the count of unread notifications
    })
    .catch((err) => alert(err));
  }

};

const readNotif = (id) =>{
  
  const updateStatus = {
    is_read: true
  };


  if(admin === true){

    api
    .patch(`api/notification/update/admin/${id}/`, updateStatus)
    .then((res) => {
      console.log('notif updated', res.data);
    })
    .catch((err) => {
      console.error('Error status:', err);
    });

  }
  else{
    api
    .patch(`api/notification/update/teacher/${id}/`, updateStatus)
    .then((res) => {
      console.log('notif updated', res.data);
    })
    .catch((err) => {
      console.error('Error status:', err);
    });
  }

}

const sampleEvents = [
  {
    title: 'Midterm Examination',
    start: new Date(examDates.midterm_exam), // Use the actual date
    end: new Date(new Date(examDates.midterm_exam).getTime() + 259200000), // One day later
  },
  {
    title: 'Final Examination',
    start: new Date(examDates.finals_exam),
    end: new Date(new Date(examDates.finals_exam).getTime() + 259200000), // One day later
  },
  {
    title: 'Summer Examination',
    start: new Date(examDates.summer_exam),
    end: new Date(new Date(examDates.summer_exam).getTime() + 259200000), // One day later
  },
];


const eventStyleGetter = (event) => {
  let backgroundColor = '#060164'; // Default color
  return {
    style: {
      backgroundColor,
      color: 'white', // Font color
      fontSize: '16px',
      borderRadius: '5px',
      padding: '5px',
    },
  };
};





  return (
    <Navbar fluid rounded className="topnavbar">
      <NavbarBrand href="https://flowbite-react.com">
 
      
       
        <span className="self-center whitespace-nowrap text-xl font-semibold text-white"></span>
      </NavbarBrand>
      <div>
        <p className="text-white font-semibold ">{props.title}</p>
      </div>
      <div className="flex md:order-2 gap-5">

      <div className="text-white mt-2" >

      <Dropdown
           arrowIcon={false}
           inline
           label={
           
            <CalendarMonthIcon color="white" className="text-4xl cursor-pointer"/>
          
           }
           >


          <DropdownHeader>  <Calendar
                localizer={localizer}
                events={sampleEvents}
                startAccessor="start"
                endAccessor="end"
                defaultView="month"
                views={['month', 'week', 'day']}
                style={{ height: 500 }}
                eventPropGetter={eventStyleGetter}
              /></DropdownHeader>
         
 
      </Dropdown></div>
        
        <div className="text-white mt-2" >

     
        

        <Dropdown
           arrowIcon={false}
           inline
           label={
            <Badge badgeContent={notifnum} color="info" >
            <NotificationsActiveIcon color="white" className="text-4xl cursor-pointer"/>
          </Badge>
           }
           >


            {
              notifData.slice(0, 5).map((data)=>{
                return(
                  <div key={data.id}>
                 
                <DropdownItem key={data.id} href={admin===true?`/exam_review/${data.tos}`:`/tos_view/${data.tos}`} className={`${data.is_read===false?'bg-gray-200':''}`} onClick={()=>{readNotif(data.id)}}>
                <div className="flex gap-5">
                  <div>
                  
                  {
 data.tos_data.user.profile_image != null  ? (
    <img 
      src={img_dir + data.tos_data.user.profile_image_url} 
      alt="Profile" 
      style={{ height: '40px', width: '40px', borderRadius: '50%' }} 
    />
  ) : (
    <Avatar {...stringAvatar(data.tos_data.user.first_name + ' ' + data.tos_data.user.last_name)} size="large" />
  )
}


                  </div>
                  <div>
              
              <span className="font-bold">{data.tos_data.user.first_name} {data.tos_data.user.last_name} </span><br/>  {data.notification_text} <span className="font-bold"> {data.tos_data.Title} {data.tos_data.Semester} </span><br/>
              <p className="text-sm">{ formatDateTime(data.notification_date)}</p>
              </div>
                </div>
              </DropdownItem>
       
              </div>
                )
              })
            }
      {notifData.length > 5 && (
              <DropdownItem 
                className="text-center" 
                onClick={() => setOpenModal(true)} 
              >
                <span className="mx-auto font-semibold">See all</span>
              </DropdownItem>
            )}
         
 
      </Dropdown>

      <Modal show={openModal} onClose={() => setOpenModal(false)} className="z-100" style={{zIndex:200}} >
        <Modal.Header>Notification</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
          {
              notifData.map((data)=>{
                return(
                  <div key={data.id}>
                 
                <Card key={data.id} href={admin===true?`/exam_review/${data.tos}`:`/tos_view/${data.tos}`} className={`${data.is_read===false?'bg-gray-200':''}`} onClick={()=>{readNotif(data.id)}}>
                <div className="flex gap-5">
                  <div>
                  
                  {
                      data.tos_data.user.profile_image!=null? <img src={img_dir+data.tos_data.user.profile_image_url} style={{height:'40px',width:'40px', borderRadius:'50%'}}/>:

                      <Avatar {...stringAvatar(data.tos_data.user.first_name+' '+data.tos_data.user.last_name)} size='large' />
                  }
                  </div>
                  <div>
              <span className="font-bold">{data.tos_data.user.first_name} {data.tos_data.user.last_name} </span><br/>  {data.notification_text} <span className="font-bold"> {data.tos_data.Title} {data.tos_data.Semester} </span>
              <p className="text-sm mt-2">{ formatDateTime(data.notification_date)}</p>
              </div>
                </div>
              </Card>
             
              </div>
                )
              })
            }
          </div>
        </Modal.Body>
        
      </Modal>
        </div>
        <Dropdown
          arrowIcon={false}
          inline
          label={
            profile!=='http://127.0.0.1:8000/apinull'? <img src={profile} style={{height:'40px',width:'40px', borderRadius:'50%'}}/>:

            <Avatar {...stringAvatar(full_name)} size='large' /> 
          }
        
        >
          <DropdownHeader>
            <span className="block text-sm">{full_name}</span>
            <span className="block truncate text-sm font-medium">{email}</span>
          </DropdownHeader>
     
          <DropdownItem href={admin===true?`/admin_profile`:`/profile`}>Profile </DropdownItem>
        
        </Dropdown>
        <NavbarToggle />
      </div>
      <NavbarCollapse className="SidebarList md:hidden ">
      {data}
      </NavbarCollapse>
    </Navbar>
  );
}

export default Topnavbar
