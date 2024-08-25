import React, { useState, useEffect } from 'react';
import api from "../../api";
import { Card, Button, Table, Pagination } from "flowbite-react";
import VisibilityIcon from '@mui/icons-material/Visibility';

function Exams() {
  const [exam, setExam] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page

  useEffect(() => {
    getExam();
  }, []);

  const getExam = () => {
    api
      .get(`/api/tos-info/detail/admin/`)
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
    setCurrentPage(1); // Reset to the first page when filtering
  };

  // Pagination logic
  const indexOfLastExam = currentPage * itemsPerPage;
  const indexOfFirstExam = indexOfLastExam - itemsPerPage;
  const currentExams = filteredExams.slice(indexOfFirstExam, indexOfLastExam);
  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="content">
      

    {/* Search Bar (real-time filtering) */}
    <div className="flex items-center mb-5">
      <input
        type="text"
        placeholder="Search by title"
        className="p-2 border border-gray-300 rounded w-full text-sm"
        value={searchTerm}
        onChange={handleSearch} // Real-time search here
      />
    </div>

    <Table striped>
      <Table.Head>
      <Table.HeadCell>Creator</Table.HeadCell>
        <Table.HeadCell>Title</Table.HeadCell>
        <Table.HeadCell>Course Code</Table.HeadCell>
        <Table.HeadCell>Semester</Table.HeadCell>
        <Table.HeadCell>Academic Year</Table.HeadCell>
        <Table.HeadCell>Action</Table.HeadCell>
        <Table.HeadCell>Status</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {currentExams.length > 0 ? (
          currentExams.map((exam, index) => (
            <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
               <Table.Cell>{exam.user.first_name} {exam.user.last_name}</Table.Cell>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {exam.Title}
              </Table.Cell>
              <Table.Cell>{exam.CourseCode}</Table.Cell>
              <Table.Cell>{exam.Semester}</Table.Cell>
              <Table.Cell>{exam.AcademicYear}</Table.Cell>
              <Table.Cell>
                <a href={`/exam_review/${exam.id}`} className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                <Button color={'primary'} size={'xs'} className='flex gap-3'><VisibilityIcon /> <p className='mt-1 ml-1'>View</p></Button>  
                </a>
              </Table.Cell>
              <Table.Cell>{exam.Status_display}</Table.Cell>
            </Table.Row>
          ))
        ) : (
          <Table.Row>  
            <Table.Cell colSpan={'5'} ><p className='text-center '>No exams found for "{searchTerm}".</p></Table.Cell>
           </Table.Row>
        )}
      </Table.Body>
    </Table>

    {/* Pagination Controls */}
    <div className="flex justify-center mt-4">
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        showIcons
      />
    </div>
   
  </div>
  )
}

export default Exams
