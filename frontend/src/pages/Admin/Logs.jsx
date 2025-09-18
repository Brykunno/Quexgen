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
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { MenuItem, Select, FormControl, InputLabel, TextField } from '@mui/material';
import { format, isWithinInterval } from 'date-fns';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import PrintIcon from '@mui/icons-material/Print';

function Logs() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [timePeriod, setTimePeriod] = useState('all');
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-01'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    getLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, timePeriod, startDate, endDate]);

  const getLogs = () => {
    api
      .get(`/api/logs/`)
      .then((res) => res.data)
      .then((data) => {
        // Sort logs from latest to oldest by log_date
        const sorted = data.sort((a, b) => new Date(b.log_date) - new Date(a.log_date));
        setLogs(sorted);
        
      })
      .catch((err) => alert(err));
  };

  const filterLogs = () => {
    let filtered = [];
    if (
      timePeriod === 'range' &&
      startDate !== '' &&
      endDate !== '' &&
      startDate <= endDate
    ) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filtered = logs.filter(log =>
        isWithinInterval(new Date(log.log_date), { start, end })
      );
    } else {
      // Show all logs if no valid range is selected
      filtered = logs;
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
      return date;
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
        <div className="mb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <FormControl variant="outlined" size="small" style={{ minWidth: 140 }}>
            <InputLabel>Time Period</InputLabel>
            <Select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              label="Time Period"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="range">Date Range</MenuItem>
            </Select>
          </FormControl>
          {timePeriod === 'range' && (
            <div className="flex gap-2 items-center">
              <TextField
                label="Start Date"
                type="date"
                size="small"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="End Date"
                type="date"
                size="small"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </div>
          )}
          <div>
            <Button variant="contained" color="primary" onClick={exportToExcel} startIcon={<SaveAltIcon />}>
              Export to Excel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={printTable}
              style={{ marginLeft: '10px' }}
              startIcon={<PrintIcon />}
            >
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
