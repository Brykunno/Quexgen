import React, { useState, useEffect } from 'react';
import api from "../../api";
import {Button} from "@mui/material";
import { Card,  Table, Pagination, Select,  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,TextInput } from "flowbite-react";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import EditNoteIcon from '@mui/icons-material/EditNote';
import RecommendIcon from '@mui/icons-material/Recommend';  
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import RateReviewIcon from '@mui/icons-material/RateReview';
import DeleteIcon from '@mui/icons-material/Delete';
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Modal } from "flowbite-react";

import Topnavbar from '../../components/Topnavbar';

import { Tabs } from "flowbite-react";
import { useSnackbar } from 'notistack';


function Exam_bank() {
  const {enqueueSnackbar} = useSnackbar();
  const [exam, setExam] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // Add status filter state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page

  const [academicYearFilter, setAcademicYearFilter] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  const [termFilter, setTermFilter] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

 const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteId !== null) {
      try{
      api
        .delete(`/api/tosinfo/${deleteId}/delete/`)
        .then(() => {
          setExam(prev => prev.filter(item => item.id !== deleteId));
          setFilteredExams(prev => prev.filter(item => item.id !== deleteId));
          enqueueSnackbar("Exam deleted successfully", { variant: 'success' });
            const log = `User ${localStorage.getItem('first_name')+" "+localStorage.getItem("last_name")} deleted an exam successfully`;
            const status = "success";
           api.post("/api/logs/", { log, status });
        })
      }
      catch(err){ alert("Failed to delete exam.")};
    }
    setShowDeleteModal(false);
    setDeleteId(null);
  };

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
  

  const handlePageChange = (pageNumber) => {
    
    setCurrentPage(pageNumber);
  };

  function statusIcons(status,status_name){
    if(status===0){
      return <div className='border border-blue-700 rounded-full px-2 py-1 text-blue-700 font-bold'>ONGOING<ManageHistoryIcon className='ml-2' /></div>
    }
    else if(status===1){
      return <div className='border border-green-700 rounded-full px-2 py-1 text-green-700 font-bold'>FOR REVIEW<RateReviewIcon className='ml-2'/></div>
    }
    else if(status===2){
      return <div className='border border-green-800 rounded-full px-2 py-1 text-green-800 font-bold'>APPROVED<RecommendIcon className='ml-2'/></div>
    }
    else if(status===3){
      return <div className='border border-orange-600 rounded-full px-2 py-1 text-orange-600 font-bold'>TO REVISE <EditNoteIcon className='ml-2'/></div>
    }
    else {
      return null
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
 {/* Search Bar (real-time filtering) */}
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
        {/* <Dropdown
          arrowIcon={false}
          inline
          label={
           
            <FilterAltIcon/>
          }
        
        >
          <DropdownHeader>
  <span className="block text-sm">
    <TextInput
      type='text'
      placeholder='Academic Year'
      value={academicYearFilter}
      onChange={handleAcademicYearChange}  // Update for academic year
    />
  </span>

</DropdownHeader>

<DropdownHeader>
  <span className="block text-sm">
    <Select value={semesterFilter} onChange={handleSemesterChange}>  // Update for semester
      <option value="">All Semesters</option>
      <option value="1st Semester">1st Semester</option>
      <option value="2nd Semester">2nd Semester</option>
      <option value="Summer">Summer</option>
    </Select>
  </span>
</DropdownHeader>

<DropdownHeader>
  <span className="block text-sm">
    <Select value={termFilter} onChange={handleTermChange}>  // Update for term
      <option value="">All Terms</option>
      <option value="Midterm">Midterm</option>
      <option value="Finals">Finals</option>
    </Select>
  </span>
</DropdownHeader>

     
 
        
        </Dropdown> */}
     

    
       
      </div>
      

      <Table striped>
        <Table.Head>
          <Table.HeadCell className="hidden lg:table-cell">Subject</Table.HeadCell>
          <Table.HeadCell>Course Code</Table.HeadCell>
          <Table.HeadCell>Semester</Table.HeadCell>
          <Table.HeadCell>Exam Date</Table.HeadCell>
          <Table.HeadCell className="hidden lg:table-cell">Academic Year</Table.HeadCell>
          <Table.HeadCell>Action</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {currentExams.length > 0 ? (
            currentExams.map((exam, index) => (
              <Table.Row key={index} className=" bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="hidden lg:table-cell whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {exam.Title}
                </Table.Cell>
                <Table.Cell>{exam.CourseCode}</Table.Cell>
                <Table.Cell>{exam.Semester}</Table.Cell>
                    <Table.Cell>
  {new Date(exam.ExaminationDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })}
</Table.Cell>
                <Table.Cell className="hidden lg:table-cell">{exam.AcademicYear}</Table.Cell>
                <Table.Cell>
                  <div className="flex gap-2">
                    <a href={`/tos_view/${exam.id}`} className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                      <Button color={'primary'} size={'small'} variant='contained' className='flex gap-1'>
                        <VisibilityIcon /> <p className='mt-1 ml-1'>View</p>
                      </Button>  
                    </a>
                    {exam.Status === 0?( <Button
                      color="error"
                      size="small"
                      variant="contained"
                      className="flex gap-1"
                      onClick={() => handleDeleteClick(exam.id)}
                    >
                      <DeleteIcon /> <p className='mt-1 ml-1'>Delete</p>
                    </Button>):''}
                   
                  </div>
                </Table.Cell>
                <Table.Cell className='flex flex-wrap'>{statusIcons(exam.Status, exam.Status_display)}</Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>  
              <Table.Cell colSpan={'6'}><p className='text-center '>No exams found.</p></Table.Cell>
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

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} size="md" onClose={() => setShowDeleteModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this exam?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="error" variant='contained' onClick={handleDeleteConfirm}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="secondary" onClick={() => setShowDeleteModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>)
  }

  let Ongoing = exam.filter(
    (item) => item.Status_display === 'Saved'
  ).length;

  let review = exam.filter(
    (item) => item.Status_display === 'To review'
  ).length;

  let revise = exam.filter(
    (item) => item.Status_display === 'Needs Revision'
  ).length;

  let approve = exam.filter(
    (item) => item.Status_display === 'Approved'
  ).length;

  return (
    <div>
      <Topnavbar title="Exam Bank"/>
    <div className="content">
      
    <Tabs aria-label="Tabs with icons" variant="fullWidth"  >
    <Tabs.Item active title={<b className='text-blue-600'>ONGOING <ManageHistoryIcon/></b>}   >
      {content(exam,'Saved')}
      {statusFilter}  
      </Tabs.Item>
      <Tabs.Item  title={<b className='text-green-600'>FOR REVIEW <RateReviewIcon/></b>}   >
      {content(exam,'To review')}
      {statusFilter}
      </Tabs.Item>
      <Tabs.Item title={<b className='text-orange-600'>TO REVISE <EditNoteIcon/></b>}  >
      {content(exam,'Needs Revision')}
      {statusFilter}

      </Tabs.Item>
      <Tabs.Item title={<b className='text-green-700'>APPROVED <RecommendIcon/></b>}  >
      {content(exam,'Approved')}
      {statusFilter}  
      </Tabs.Item>
  
    
    </Tabs>

    </div>
    </div>
  );
}

export default Exam_bank;
