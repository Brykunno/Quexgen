import React, { useState, useEffect } from 'react';
import api from "../../api";
import { Card, Button, Table, Pagination, Select } from "flowbite-react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import EditNoteIcon from '@mui/icons-material/EditNote';
import RecommendIcon from '@mui/icons-material/Recommend';  
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import RateReviewIcon from '@mui/icons-material/RateReview';


import Topnavbar from '../../components/Topnavbar';

import { Tabs } from "flowbite-react";



function Exam_bank() {
  const [exam, setExam] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // Add status filter state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page

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
    filterExams(value, statusFilter);
  };

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
    filterExams(searchTerm, value);
  };

  const filterExams = (searchTerm, status) => {
    let filtered = exam;

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.Title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (status) {
      filtered = filtered.filter((item) => item.Status_display === status);
    }

    setFilteredExams(filtered);
    setCurrentPage(1); // Reset to the first page when filtering
  };

  // Pagination logic
  

  const handlePageChange = (pageNumber) => {
    
    setCurrentPage(pageNumber);
  };

  function statusIcons(status,status_name){
    if(status===0){
      return <div className='border border-blue-700 rounded-full px-2 py-1 text-blue-700 font-bold'>{status_name} <CheckBoxIcon className='ml-2' /></div>
    }
    else if(status===1){
      return <div className='border border-green-700 rounded-full px-2 py-1 text-green-700 font-bold'>{status_name} <RateReviewIcon className='ml-2'/></div>
    }
    else if(status===2){
      return <div className='border border-green-800 rounded-full px-2 py-1 text-green-800 font-bold'>{status_name} <RecommendIcon className='ml-2'/></div>
    }
    else if(status===3){
      return <div className='border border-orange-600 rounded-full px-2 py-1 text-orange-600 font-bold'>{status_name} <EditNoteIcon className='ml-2'/></div>
    }
    else {
      return null
    }

  }



  function content(exams,status){

   

  const filteredExams = exams.filter((item) => item.Status_display === status)
  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);
  let page = currentPage>totalPages?1:currentPage
  const indexOfLastExam = page * itemsPerPage;
  const indexOfFirstExam = indexOfLastExam - itemsPerPage;
  const currentExams = filteredExams.slice(indexOfFirstExam, indexOfLastExam);

    return(<div>
 {/* Search Bar (real-time filtering) */}
 <div className="flex items-center mb-5 gap-4">
        <div className="relative shadow-lg">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
          <input
            type="text"
            placeholder="Search by title"
            className="p-2 pl-10 border border-gray-300 rounded w-full text-sm"
            value={searchTerm}
            onChange={handleSearch} // Real-time search here
          />
        </div>

    
       
      </div>

      <Table striped>
        <Table.Head>
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
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {exam.Title}
                </Table.Cell>
                <Table.Cell>{exam.CourseCode}</Table.Cell>
                <Table.Cell>{exam.Semester}</Table.Cell>
                <Table.Cell>{exam.AcademicYear}</Table.Cell>
                <Table.Cell>
                  <a href={`/tos_view/${exam.id}`} className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                    <Button color={'primary'} size={'xs'} className='flex gap-3'>
                      <VisibilityIcon /> <p className='mt-1 ml-1'>View</p>
                    </Button>  
                  </a>
                </Table.Cell>
                <Table.Cell className='flex flex-wrap'>{statusIcons(exam.Status, exam.Status_display)}</Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>  
              <Table.Cell colSpan={'6'}><p className='text-center '>No exams found for "{searchTerm}" with status "{status}".</p></Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          showIcons
        />
      </div>
    </div>)
  }


  return (
    <div>
      <Topnavbar title="Exam Bank"/>
    <div className="content">
      
    <Tabs aria-label="Tabs with icons" variant="fullWidth" >
    <Tabs.Item active title="Saved" icon={CheckBoxIcon} >
      {content(exam,'Saved')}
      {statusFilter}  
      </Tabs.Item>
      <Tabs.Item  title="To review" icon={RateReviewIcon} >
      {content(exam,'To review')}
      {statusFilter}
      </Tabs.Item>
      <Tabs.Item title="Needs revision" icon={EditNoteIcon}>
      {content(exam,'Needs Revision')}
      {statusFilter}

      </Tabs.Item>
      <Tabs.Item title="Approved" icon={RecommendIcon}>
      {content(exam,'Approved')}
      {statusFilter}  
      </Tabs.Item>
  
    
    </Tabs>

    </div>
    </div>
  );
}

export default Exam_bank;
