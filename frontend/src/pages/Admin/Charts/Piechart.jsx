import React, { useState, useEffect } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import api from "../../../api";

export default function DonutChart() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getExam();
  }, []);

  const getExam = () => {
    api
      .get(`/api/tos-info/detail/admin/`)
      .then((res) => res.data)
      .then((data) => {
        const filteredData = data.filter((exam) => exam.Status !== 0);
        const newRows = filteredData.map((data, idx) => ({
          id: data.id,
          label: data.user.username,
          value: data.total_tokens,
          color: '#1976d2', // blue for all, or use different shades if you want
        }));
        setRows(newRows);
      })
      .catch((err) => alert(err));
  };

  const settings = {
    margin: { right: 5 },
    width: 800,
    height: 200,
    hideLegend: true,
  };

  return (
    <PieChart
      series={[{ innerRadius: 50, outerRadius: 100, data: rows, arcLabel: 'value' }]}
      {...settings}
    />
  );
}
