import React, { useState, useEffect } from 'react';
import api from "../../api";
import { Card } from 'flowbite-react';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import ArticleIcon from '@mui/icons-material/Article';
import PreviewIcon from '@mui/icons-material/Preview';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import dayjs from 'dayjs';
import Topnavbar from '../../components/Topnavbar';

const localizer = momentLocalizer(moment);


const currentDate = new Date();

const year = currentDate.getFullYear();
const month = currentDate.getMonth() ; // Months are zero-indexed, so add 1
const day = currentDate.getDate();
const hours = currentDate.getHours();
const minutes = currentDate.getMinutes();
const seconds = currentDate.getSeconds();

function Dashboard() {
  const [value, setValue] = useState(dayjs('2022-04-17'));
  const [user, setUser] = useState([]);
  const [TOSInfo, setTOSInfo] = useState([]);
  const [events, setEvents] = useState([]);

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

  const StaffUsersCount = user.filter((u) => u.is_staff === true).length;
  const toreviewCount = TOSInfo.filter((r) => r.Status === 1).length;

  const sampleEvents = [
    {
      title: 'Midterm Examination',
      start: new Date(year, 9, 15),
      end: new Date(year, 9, 18),
    },
    {
      title: 'Final Examination',
      start: new Date(year, 11, 17),
      end: new Date(year, 11, 20),
    }
  ];

  // Custom styles for events
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
      <Topnavbar title="Dashboard"/>
      <div className='content'>
        <div className='flex flex-col gap-5 '>
          <div className='flex gap-5'>
            <Card className='flex-1 bg-blue-500 text-white'>
              <div className="flex flex-row gap-5">
                <div><SupervisedUserCircleIcon style={{height:'60px',width:'60px'}}/></div>
                <div className='py-1'>
                  <div className="text-white font-bold">Teachers</div>
                  <span className='font-bold text-2xl'>{StaffUsersCount}</span>
                </div>
              </div>
            </Card>

            <Card className='flex-1 bg-yellow-300 text-white'>
              <div className="flex flex-row gap-5">
                <div><ArticleIcon style={{height:'60px',width:'60px'}}/></div>
                <div className='py-1'>
                  <div className="text-white font-bold">Exams</div>
                  <span className='font-bold text-2xl'>{TOSInfo.length}</span>
                </div>
              </div>
            </Card>

            <Card className='flex-1 bg-green-400 text-white'>
              <div className="flex flex-row gap-5">
                <div><PreviewIcon style={{height:'60px',width:'60px'}}/></div>
                <div className='py-1'>
                  <div className="text-white font-bold">To Review</div>
                  <span className='font-bold text-2xl'>{toreviewCount}</span>
                </div>
              </div>
            </Card>
          </div>

          <Card >
            
            <div  style={{ height: '500px' }}>
              <Calendar
                localizer={localizer}
                events={sampleEvents}
                startAccessor="start"
                endAccessor="end"
                defaultView="month"
                views={['month', 'week', 'day']}
                style={{ height: 500 }}
                eventPropGetter={eventStyleGetter} // Apply custom event styles
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
