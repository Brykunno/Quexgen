import React, { useState, useEffect } from 'react';
import Topnavbar from '../../components/Topnavbar';
import api from '../../api';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { saveAs } from 'file-saver'; // FileSaver.js for saving the Excel file
import * as XLSX from 'xlsx'; // xlsx for creating Excel file
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { format, startOfYear, startOfMonth, startOfWeek, startOfDay, isWithinInterval } from 'date-fns'; // for date manipulation

function Logs() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [timePeriod, setTimePeriod] = useState('yearly'); // Default is daily

  useEffect(() => {
    getLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, timePeriod]);

  const getLogs = () => {
    api
      .get(`/api/logs/`)
      .then((res) => res.data)
      .then((data) => {
        setLogs(data);
        console.log('datalogs:', data);
      })
      .catch((err) => alert(err));
  };

  const filterLogs = () => {
    const now = new Date();
    let filtered = [];

    switch (timePeriod) {
      case 'yearly':
        filtered = logs.filter(log => isWithinInterval(new Date(log.log_date), { start: startOfYear(now), end: now }));
        break;
      case 'monthly':
        filtered = logs.filter(log => isWithinInterval(new Date(log.log_date), { start: startOfMonth(now), end: now }));
        break;
      case 'weekly':
        filtered = logs.filter(log => isWithinInterval(new Date(log.log_date), { start: startOfWeek(now), end: now }));
        break;
      case 'daily':
      default:
        filtered = logs.filter(log => isWithinInterval(new Date(log.log_date), { start: startOfDay(now), end: now }));
        break;
    }

    setFilteredLogs(filtered);
  };

  const formatDate = (date) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(new Date(date));
    } catch {
      return date; // Fallback to original format if parsing fails
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredLogs.map(log => ({
      Message: log.log,
      Status: log.status,
      Timestamp: formatDate(log.log_date),
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Logs');
    
    // Export to file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([excelBuffer], { bookType: 'xlsx', type: 'application/octet-stream' });
    saveAs(file, 'logs_report.xlsx');
  };

  const printTable = () => {
    const printWindow = window.open('', '', 'height=650,width=900');
    printWindow.document.write('<html><head><title>Logs</title>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(`<h1>Logs Report (${timePeriod})</h1>`);
    printWindow.document.write('<table border="1" cellpadding="5" cellspacing="0">');
    printWindow.document.write('<thead><tr><th>Message</th><th>Status</th><th>Timestamp</th></tr></thead>');
    printWindow.document.write('<tbody>');

    filteredLogs.forEach((log) => {
      printWindow.document.write('<tr>');
      printWindow.document.write(`<td>${log.log}</td>`);
      printWindow.document.write(`<td>${log.status}</td>`);
      printWindow.document.write(`<td>${formatDate(log.log_date)}</td>`);
      printWindow.document.write('</tr>');
    });

    printWindow.document.write('</tbody>');
    printWindow.document.write('</table>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div>
      <Topnavbar title="Logs" />
      <div className="content">
        <div className="mb-3 flex justify-between ">
          <FormControl variant="outlined" size="small" style={{ marginRight: '10px' }}>
            <InputLabel>Time Period</InputLabel>
            <Select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              label="Time Period"
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </Select>
          </FormControl>
          <div >
          <Button variant="contained" color="primary" onClick={exportToExcel}>
            Export to Excel
          </Button>
          <Button variant="contained" color="secondary"  onClick={printTable} style={{ marginLeft: '10px' }}>
            Print
          </Button>
          </div>
        </div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="logs table">
            <TableHead>
              <TableRow>
                <TableCell>Message</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs.map((data, index) => (
                <TableRow
                  key={index}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    backgroundColor: data.status === 'success' ? '#f0fff4' : '#fff5f5',
                  }}
                >
                  <TableCell
                    sx={{
                      color: data.status === 'success' ? 'green' : 'red',
                      fontWeight: 'bold',
                    }}
                  >
                    {data.log}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: data.status === 'success' ? 'green' : 'red',
                      fontWeight: 'bold',
                    }}
                  >
                    {data.status}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: data.status === 'success' ? 'green' : 'red',
                      fontWeight: 'bold',
                    }}
                  >
                    {formatDate(data.log_date)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default Logs;
