import React, { useState, useEffect } from 'react';
import api from "../../api";
import {Button} from "@mui/material";
import { Card, TextInput, Label } from 'flowbite-react';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import RateReviewIcon from '@mui/icons-material/RateReview';
import ArticleIcon from '@mui/icons-material/Article';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import dayjs from 'dayjs';
import Topnavbar from '../../components/Topnavbar';
import ToastMessage from '../../components/Toast';
import Barchart from './Charts/Barchart.jsx';
import DataGrid from './Charts/DataGrid.jsx';
import Piechart from './Charts/Piechart.jsx';


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
    api.get(`/api/user/account/admin/`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        alert(err);
      });
  };

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

  const handleSubmit = () => {
    const examDatesJson = JSON.stringify(examDates);

    // Always try to insert first (POST), if it fails due to existing record, then update (PUT)
    api.post("/api/exam-dates/", examDates)
      .then(response => {
        console.log('Exam dates added:', response.data);
        setLoading(true);
        // Optionally reset form or show success message
      })
      .catch(error => {
        // If already exists (e.g., 400 or 409), then update instead
        if (
          error.response &&
          (error.response.status === 400 || error.response.status === 409)
        ) {
          api.put(`/api/exam-dates/1/`, examDates)
            .then(response => {
              console.log('Exam dates updated:', response.data);
              setLoading(true);
            })
            .catch(error2 => {
              console.error('There was an error updating the exam dates:', error2.response?.data || error2);
            });
        } else {
          console.error('There was an error creating the exam dates:', error.response?.data || error);
        }
      });
  };
  
  const StaffUsersCount = user.filter((u) => u.is_staff === true).length;
  const toreviewCount = TOSInfo.filter((r) => r.Status === 1).length;
 const currentMonth = dayjs().month();
const currentYear = dayjs().year();

const token_usage_this_month = TOSInfo
  .filter(item => {
    const date = dayjs(item.tos_info_date_added);
    return date.month() === currentMonth && date.year() === currentYear;
  })
  .reduce((acc, tokens) => acc + tokens.total_tokens, 0);

  
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
    let backgroundColor = '#0f23a5'; // Default color
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
  <div className='flex flex-col gap-5 lg:flex-row'>
    <Card className='flex-1 bg-blue-500 text-white w-full'>
      <div className="flex flex-row gap-5 items-center">
        <div><SupervisedUserCircleIcon style={{ height: '60px', width: '60px' }} /></div>
        <div className='py-1'>
          <div className="text-white font-bold">Instructors</div>
          <span className='font-bold text-2xl'>{StaffUsersCount}</span>
        </div>
      </div>
    </Card>

    <Card className='flex-1 bg-yellow-300 text-white w-full'>
      <div className="flex flex-row gap-5 items-center">
        <div><ArticleIcon style={{ height: '60px', width: '60px' }} /></div>
        <div className='py-1'>
          <div className="text-white font-bold">Exams</div>
          <span className='font-bold text-2xl'>{TOSInfo.length}</span>
        </div>
      </div>
    </Card>

    <Card className='flex-1 bg-green-400 text-white w-full'>
      <div className="flex flex-row gap-5 items-center">
        <div><RateReviewIcon style={{ height: '60px', width: '60px' }} /></div>
        <div className='py-1'>
          <div className="text-white font-bold">To Review</div>
          <span className='font-bold text-2xl'>{toreviewCount}</span>
        </div>
      </div>
    </Card>

        <Card className='flex-1 bg-green-400 text-white w-full'>
      <div className="flex flex-row gap-5 items-center">
        <div><RateReviewIcon style={{ height: '60px', width: '60px' }} /></div>
        <div className='py-1'>
          <div className="text-white font-bold">Token Usage This Month</div>
          <span className='font-bold text-2xl'>{token_usage_this_month.toLocaleString()}</span>
        </div>
      </div>
    </Card>
  </div>
</div>

<div className='flex flex-col lg:flex-row gap-5'>
    <div className='flex-1 flex-col gap-5'>

      {<Barchart />}
      {/* <div>
 {<Piechart />}
      </div> */}
           
        {<DataGrid />}
      
          </div>
          <div className='flex-1'>
            <div> 
   <Card >
          <div className='flex flex-col gap-5 lg:flex-row'>
  <div className='flex-1 w-full'>
    <Label>Midterm exam</Label>
    <TextInput
      type='date'
      value={examDates.midterm_exam}
      onChange={(e) => { handleExamDates('midterm_exam', e.target.value) }}
      className='w-full'
    />
  </div>

  <div className='flex-1 w-full'>
    <Label>Finals exam</Label>
    <TextInput
      type='date'
      value={examDates.finals_exam}
      onChange={(e) => { handleExamDates('finals_exam', e.target.value) }}
      className='w-full'
    />
  </div>

  <div className='flex-1 w-full'>
    <Label>Summer exam</Label>
    <TextInput
      type='date'
      value={examDates.summer_exam}
      onChange={(e) => { handleExamDates('summer_exam', e.target.value) }}
      className='w-full'
    />
  </div>
</div>

            
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
            <div className='flex justify-center'>
              <Button color={'primary'} variant='contained' className='mx-auto' onClick={handleSubmit}>Update</Button>
            </div>
          </Card>
          </div>
          </div>

        
</div>
       
    
          {loading && <ToastMessage message={"Exam dates successfully updated"} setToast={setLoading}/>}
        
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
