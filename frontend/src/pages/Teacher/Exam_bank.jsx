import { Card, Button } from "flowbite-react";
import React, { useState, useEffect } from 'react';
import api from "../../api";
import TosView from "./TosView";

function Exam_bank() {
  const [exam, setExam] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredExams, setFilteredExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null); // State to track the selected exam

  useEffect(() => {
    getExam();
  }, []);

  const getExam = () => {
    api
      .get(`/api/tos-info/detail/`)
      .then((res) => res.data)
      .then((data) => {
        setExam(data);
        setFilteredExams(data); // Initialize the filtered exams to show all exams
      })
      .catch((err) => alert(err));
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Filter the exams as the user types
    const filtered = exam.filter((item) =>
      item.Title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredExams(filtered);
  };

  // Handle card click to show details
  const handleCardClick = (exam) => {
    setSelectedExam(exam); // Set the selected exam to display its details
  };

  // Handle back to list
  const handleBackToList = () => {
    setSelectedExam(null); // Go back to the exam list
  };

  // Conditional rendering
  if (selectedExam) {
    // Show the selected exam details
    return (
      <div className="content">
      <TosView id={selectedExam.id}/>
      <Button onClick={handleBackToList}>Back to Exam List</Button>

      </div>
    );
  }

  return (
    <div className="content">
      <h1>Exam Bank</h1>

      {/* Search Bar (real-time filtering) */}
      <div className="flex items-center mb-5">
        <input
          type="text"
          placeholder="Search by title"
          className="p-2 border border-gray-300 rounded w-full"
          value={searchTerm}
          onChange={handleSearch} // Real-time search here
        />
      </div>

      {/* Display Exam Cards */}
      {filteredExams.length > 0 ? (
        filteredExams.map((exam, index) => (
          <Card 
            key={index} 
            className="m-5 cursor-pointer" 
            onClick={() => handleCardClick(exam)} // Set the selected exam on click
          >
            <p>{index + 1}. {exam.Title}</p>
            <p className="text-xs">{exam.Semester}</p>
          </Card>
        ))
      ) : (
        <p>No exams found for "{searchTerm}".</p>
      )}
    </div>
  );
}

export default Exam_bank;
