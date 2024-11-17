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

function Logs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    getLogs();
  }, []);

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

  return (
    <div>
      <Topnavbar title="Logs" />
      <div className="content ">
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
              {logs.map((data, index) => (
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
                  >{data.status}</TableCell>
                  <TableCell
                   sx={{
                    color: data.status === 'success' ? 'green' : 'red',
                    fontWeight: 'bold',
                  }}

                  >{formatDate(data.log_date)}</TableCell>
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
