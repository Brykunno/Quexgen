import React, { useState, useEffect } from 'react';
import api from "../../api";
import {Button} from "@mui/material";
import { Card,  Table, Pagination, Select,TextInput } from "flowbite-react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import EditNoteIcon from '@mui/icons-material/EditNote';
import RecommendIcon from '@mui/icons-material/Recommend';  

import RateReviewIcon from '@mui/icons-material/RateReview';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Topnavbar from '../../components/Topnavbar';

import { Tabs } from "flowbite-react";




function Exams() {
  const [exam, setExam] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [pendingExams,setPendingExams] = useState([]);
  const [approvedExams,setApprovedExams] = useState([]);
  const [revisionExams,setRevisionExams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page


  const [academicYearFilter, setAcademicYearFilter] = useState('');
const [semesterFilter, setSemesterFilter] = useState('');
const [termFilter, setTermFilter] = useState('');

  useEffect(() => {
    getExam();
  
  }, []);

  const getExam = () => {
    api
      .get(`/api/tos-info/detail/admin/`)
      .then((res) => res.data)
      .then((data) => {
        const filteredData = data.filter((exam) => exam.Status !== 0); // Filter out exams with Status of 0
        setExam(filteredData);
        setFilteredExams(filteredData); // Initialize filtered exams to show only the filtered exams
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

  const filterExams = (searchTerm, status, academicYear, semester, term) => {
    let filtered = exam;
  
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.Title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  
    if (status) {
      filtered = filtered.filter((item) => item.Status_display === status);
    }
  
    if (academicYear) {
      filtered = filtered.filter((item) =>  item.AcademicYear.toLowerCase().includes(academicYear.toLowerCase()));
    }
  
    if (semester) {
      filtered = filtered.filter((item) => item.Semester === semester);
    }
  
    if (term) {
      filtered = filtered.filter((item) => item.Term === term); // Assuming 'Term' is part of the exam data
    }
  
    setFilteredExams(filtered);
    setCurrentPage(1); // Reset to the first page when filtering
  };


  
  const handleAcademicYearChange = (e) => {
    const value = e.target.value;
    setAcademicYearFilter(value);
    filterExams(searchTerm, statusFilter, value, semesterFilter, termFilter);
  };
  
  const handleSemesterChange = (e) => {
    const value = e.target.value;
    setSemesterFilter(value);
    filterExams(searchTerm, statusFilter, academicYearFilter, value, termFilter);
  };
  
  const handleTermChange = (e) => {
    const value = e.target.value;
    setTermFilter(value);
    filterExams(searchTerm, statusFilter, academicYearFilter, semesterFilter, value);
  };
  

  // Pagination logic
  const indexOfLastExam = currentPage * itemsPerPage;
  const indexOfFirstExam = indexOfLastExam - itemsPerPage;
  const currentExams = filteredExams.slice(indexOfFirstExam, indexOfLastExam);
  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);

  const approvedcurrentExams = filteredExams.slice(indexOfFirstExam, indexOfLastExam);
  const approvedtotalPages = Math.ceil(filteredExams.length / itemsPerPage);
 



  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  function statusIcons(status, status_name) {
    if (status === 0) {
      return (
        <div className='border border-blue-700 rounded-full px-2 py-1 text-blue-700 font-bold'>
          {status_name} <CheckBoxIcon className='ml-2' />
        </div>
      );
    } else if (status === 1) {
      return (
        <div className='border border-green-700 rounded-full px-2 py-1 text-green-700 font-bold'>
          For review <RateReviewIcon className='ml-2'/>
        </div>
      );
    } else if (status === 2) {
      return (
        <div className='border border-green-800 rounded-full px-2 py-1 text-green-800 font-bold'>
          {status_name} <RecommendIcon className='ml-2'/>
        </div>
      );
    } else if (status === 3) {
      return (
        <div className='border border-orange-600 rounded-full px-2 py-1 text-orange-600 font-bold'>
          For revision <EditNoteIcon className='ml-2'/>
        </div>
      );
    } else {
      return null;
    }
  }

  

  function content(exams,status){

    
   

    const filteredExams = exams.filter(
      (item) => item.Status_display === status && 
                (academicYearFilter ? item.AcademicYear === academicYearFilter : true) &&
                (semesterFilter ? item.Semester === semesterFilter : true) &&
                (termFilter ? item.Term === termFilter : true) &&
                (searchTerm ? item.Title.toLowerCase().includes(searchTerm.toLowerCase()) : true)
    );
    const totalPages = Math.ceil(filteredExams.length / itemsPerPage);
    let page = currentPage>totalPages?1:currentPage
    const indexOfLastExam = page * itemsPerPage;
    const indexOfFirstExam = indexOfLastExam - itemsPerPage;
    const currentExams = filteredExams.slice(indexOfFirstExam, indexOfLastExam);
    return(<div>
      <div className="flex items-center mb-5 gap-4">
        <div className="relative shadow-lg">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
          <input
            type="text"
            placeholder="Search by course name"
            className="p-2 pl-10 border border-gray-300 rounded w-full text-sm"
            value={searchTerm}
            onChange={handleSearch} // Real-time search here
          />
        </div>
        <TextInput
      type='text'
      placeholder='Academic Year'
      value={academicYearFilter}
      onChange={handleAcademicYearChange}  // Update for academic year
    />

    
  <span className="block text-sm">
    <Select value={semesterFilter} onChange={handleSemesterChange}>  // Update for semester
      <option value="">All Semesters</option>
      <option value="1st Semester">1st Semester</option>
      <option value="2nd Semester">2nd Semester</option>
      <option value="Summer">Summer</option>
    </Select>
  </span>

  <span className="block text-sm">
    <Select value={termFilter} onChange={handleTermChange}>  // Update for term
      <option value="">All Terms</option>
      <option value="Midterm">Midterm</option>
      <option value="Finals">Finals</option>
    </Select>
  </span>

        {/* Status Filter */}
       
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
          {
          currentExams.length > 0 ? (
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
                    <Button color={'primary'} variant='contained' size={'small'} className='flex gap-1'>
                      <VisibilityIcon /> <p className='mt-1 ml-1'>View</p>
                    </Button>  
                  </a>
                </Table.Cell>
                <Table.Cell className='flex flex-wrap'>{statusIcons(exam.Status, exam.Status_display)}</Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>  
              <Table.Cell colSpan={'7'}><p className='text-center '>No exams found for "{searchTerm}" with status "{status}".</p></Table.Cell>
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
        
      <Topnavbar title="Exams"/>
    <div className="content">

    <Tabs aria-label="Tabs with icons" variant="fullWidth" >
      <Tabs.Item active title="For review" icon={RateReviewIcon} >
      {content(exam,'To review')}
      {statusFilter}
      </Tabs.Item>
      <Tabs.Item title="For revision" icon={EditNoteIcon}>
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

export default Exams;
