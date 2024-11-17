import React, { useState, useEffect } from 'react';
import api from "../../api";
import {Button} from "@mui/material";
import { Card, TextInput, Label } from 'flowbite-react';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';

import ArticleIcon from '@mui/icons-material/Article';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import dayjs from 'dayjs';
import Topnavbar from '../../components/Topnavbar';
import ToastMessage from '../../components/Toast';
import EditNoteIcon from '@mui/icons-material/EditNote';
import RecommendIcon from '@mui/icons-material/Recommend';  
import RateReviewIcon from '@mui/icons-material/RateReview';

const localizer = momentLocalizer(moment);

function Dashboard() {
  const [loading,setLoading] = useState(false);
  const [user, setUser] = useState([]);
  const [TOSInfo, setTOSInfo] = useState([]);
  const [examDates, setExamDates] = useState({
    midterm_exam: '',
    finals_exam: '',
    summer_exam: ''
  });

  useEffect(() => {
    document.title = "Home";
    getUser();
    getTOSInfo();
    getExamDates(1); // Fetch exam dates with ID 1
  }, []);

  const getUser = () => {
    api.get(`/api/user/account/`)
      .then((res) => {
        setUser(res.data);
        console.log('user : ', res.data)
      })
      .catch((err) => {
        alert(err);
      });
  };

  function getUserId(users) {
    let user_id;
  
    users.map(user => {user_id = user.id });

    return user_id
  }

  const user_id = getUserId(user)


  const getTOSInfo = () => {
    api.get(`/api/tos-info/detail/admin/`)
      .then((res) => {
        setTOSInfo(res.data);
        console.log('TOS info: ', res.data);
      })
      .catch((err) => alert(err));
  };

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

  const handleExamDates = (field, value) => {
    setExamDates((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };


  

  
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
    <div>
      <Topnavbar title="Dashboard" />
      <div className='content'>
        <div className='flex flex-col gap-5 '>
        <div className='flex flex-col gap-5'>
  <div className='flex flex-col gap-5 md:flex-row'>

  <Card className='flex-1 bg-green-400 text-white w-full'>
      <div className="flex flex-row gap-5 items-center">
        <div><RateReviewIcon style={{ height: '60px', width: '60px' }} /></div>
        <div className='py-1'>
          <div className="text-white font-bold">Ongoing</div>
          <span className='font-bold text-2xl'>{TOSInfo.filter((item) => item.Status_display === "Saved" && item.user.id==user_id).length}</span>
        </div>
      </div>
    </Card>
    <Card className='flex-1 bg-blue-500 text-white w-full'>
      <div className="flex flex-row gap-5 items-center">
        <div><RateReviewIcon style={{ height: '60px', width: '60px' }} /></div>
        <div className='py-1'>
          <div className="text-white font-bold">For Reviews</div>
          <span className='font-bold text-2xl'>{TOSInfo.filter((item) => item.Status_display === "To review" && item.user.id==user_id).length}</span>
        </div>
      </div>
    </Card>

    <Card className='flex-1 bg-orange-400 text-white w-full'>
      <div className="flex flex-row gap-5 items-center">
        <div><EditNoteIcon style={{ height: '60px', width: '60px' }} /></div>
        <div className='py-1'>
          <div className="text-white font-bold">To revise</div>
          <span className='font-bold text-2xl'>{TOSInfo.filter((item) => item.Status_display === "Needs Revision" && item.user.id==user_id ).length}</span>
        </div>
      </div>
    </Card>

  
  </div>
</div>


          <Card>
       
            
            <div style={{ height: '500px' }}>
              <Calendar
                localizer={localizer}
                events={sampleEvents}
                startAccessor="start"
                endAccessor="end"
                defaultView="month"
                views={['month', 'week', 'day']}
                style={{ height: 500 }}
                eventPropGetter={eventStyleGetter}
              />
            </div>
    
          </Card>
          {loading && <ToastMessage message={"Exam dates successfully updated"} setToast={setLoading}/>}
        
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
