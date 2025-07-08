import React, { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import api from "../../../api";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Card } from '@mui/material';

export default function BasicBars() {
  const [rows, setRows] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    getExam();
  }, []);

  // Filter rows by date range
  const getFilteredRows = () => {
    if (!startDate || !endDate) return rows;
    return rows.filter(row => {
      const date = dayjs(row.date_created);
      return date.isAfter(dayjs(startDate).subtract(1, 'day')) && date.isBefore(dayjs(endDate).add(1, 'day'));
    });
  };

  const getExam = () => {
    api
      .get(`/api/tos-info/detail/admin/`)
      .then((res) => res.data)
      .then((data) => {
        const filteredData = data.filter((exam) => exam.Status !== 0);
        const newRows = filteredData.map((data) => ({
          id: data.id,
          username: data.user.username,
          firstName: data.user.first_name,
          middleName: data.user.middle_name,
          lastName: data.user.last_name,
          courseName: data.Title,
          courseCode: data.CourseCode,
          examDate: data.ExaminationDate,
          status: data.Status,
          statusDisplay: data.Status_display,
          total_tokens: data.total_tokens,
          date_created: data.tos_info_date_added
        }));
        setRows(newRows);
      })
      .catch((err) => alert(err));
  };

  const filteredRows = getFilteredRows();
  const users = filteredRows.map(row => row.username);
  const tokensUsed = filteredRows.map(row => row.total_tokens);
  const allTokensUsed = filteredRows.reduce((acc, token) => acc + token.total_tokens, 0).toLocaleString();

  return (
    <Card className='p-3 mb-3'>

      <LocalizationProvider  dateAdapter={AdapterDayjs}>
        <div className="flex gap-4 mb-4 justify-center">
          <DatePicker
            label="Start date"
            value={startDate}
            onChange={setStartDate}
            slotProps={{ textField: { size: 'small' } }}
          />
          <DatePicker
            label="End date"
            value={endDate}
            onChange={setEndDate}
            slotProps={{ textField: { size: 'small' } }}
          />
        </div>
      </LocalizationProvider>
         
      <BarChart
        xAxis={[{ data: users, scaleType: 'band' }]}
        series={[
          { data: tokensUsed, label: `Tokens Used (${allTokensUsed})`, color: '#1976d2' }
        ]}
        height={300}
      />
    </Card>
  );
}
