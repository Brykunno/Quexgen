import React, { useState,useEffect } from 'react';
import { Progress, Label, TextInput, Select, Card,Button } from "flowbite-react";
import api from "../api";

function TOSform() {

  const [Title,setTitle] = useState('');
  const [Semester,setSemester] = useState('1st Semester');
  const [AlumniYear,setAlumniYear] = useState('');
  const [CourseCode,setCourseCode] = useState('');
  const [Campus,setCampus] = useState('');
  const [Department,setDepartment] = useState('');
  const [ExaminationType,setExaminationType] = useState('');
  const [CourseType,setCourseType] = useState('');
  const [ExaminationDate,setExaminationDate] = useState('');
  const [Faculty,setFaculty] = useState('');
  const [Chairperson,setChairperson] = useState('');
  const [Dean,setDean] = useState('');
  const [Director,setDirector] = useState('');


// Event handlers for each field
const handleTitle = (event) => {
  setTitle(event.target.value);
  saveDataToLocalStorage();
};

const handleSemester = (event) => {
  setSemester(event.target.value);
  saveDataToLocalStorage();
};

const handleAlumniYear = (event) => {
  setAlumniYear(event.target.value)
  saveDataToLocalStorage();;
};

const handleCampus = (event) => {
  setCampus(event.target.value)
  saveDataToLocalStorage();;
};

const handleCourseCode = (event) => {
  setCourseCode(event.target.value);
  saveDataToLocalStorage();
};

const handleDepartment = (event) => {
  setDepartment(event.target.value);
  saveDataToLocalStorage();
};

const handleExaminationType = (event) => {
  setExaminationType(event.target.value);
  saveDataToLocalStorage();
};

const handleCourseType = (event) => {
  setCourseType(event.target.value);
  saveDataToLocalStorage();
};

const handleExaminationDate = (event) => {
  setExaminationDate(event.target.value);
  saveDataToLocalStorage();
};

const handleFaculty = (event) => {
  setFaculty(event.target.value);
  saveDataToLocalStorage();
};

const handleChairperson = (event) => {
  setChairperson(event.target.value);
  saveDataToLocalStorage();
};

const handleDean = (event) => {
  setDean(event.target.value);
  saveDataToLocalStorage();
};

const handleDirector = (event) => {
  setDirector(event.target.value);
  saveDataToLocalStorage();
};

// Function to save all data to local storage
const saveDataToLocalStorage = () => {
  const data = {
    Title,
    Semester,
    AlumniYear,
    Campus,
    CourseCode,
    Department,
    ExaminationType,
    CourseType,
    ExaminationDate,
    Faculty,
    Chairperson,
    Dean,
    Director,
  };

  localStorage.setItem('formData', JSON.stringify(data));
};

// Call this function to load data from local storage when the component mounts
const loadDataFromLocalStorage = () => {
  const storedData = localStorage.getItem('formData');
  if (storedData) {
    const data = JSON.parse(storedData);
    setTitle(data.Title || '');
    setSemester(data.Semester || '');
    setAlumniYear(data.AlumniYear || '');
    setCampus(data.Campus || '');
    setCourseCode(data.CourseCode || '');
    setDepartment(data.Department || '');
    setExaminationType(data.ExaminationType || '');
    setCourseType(data.CourseType || '');
    setExaminationDate(data.ExaminationDate || '');
    setFaculty(data.Faculty || '');
    setChairperson(data.Chairperson || '');
    setDean(data.Dean || '');
    setDirector(data.Director || '');

  }
};

// Use the effect hook to load data when the component mounts
useEffect(() => {
  loadDataFromLocalStorage();
 
}, []);

// Example of how to call saveDataToLocalStorage when a form is submitted
// const handleSubmit = (event) => {
//   event.preventDefault();
//   saveDataToLocalStorage();
//   // Handle form submission logic
// };

for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);
  
}

const formDataStorage = localStorage.getItem('formData');
const formData = formDataStorage ? JSON.parse(formDataStorage) : null;

const handleSubmit = (e) => {
  e.preventDefault();

  if (formData) {
    
    const formDataJson = JSON.stringify(formData)
    api.post("/api/tos-info/", {formDataJson})  // send as object, not JSON string
      .then((res) => {
        if (res.status === 201) {
          alert("Note created!");
          localStorage.removeItem('formData');
          setTitle('');
          setSemester('');
          setAlumniYear('');
          setCampus('');
          setCourseCode('');
          setDepartment('');
          setExaminationType('');
          setCourseType('');
          setExaminationDate('');
          setFaculty('');
          setChairperson('');
          setDean('');
          setDirector('');
      
        } else {
          alert("Failed to make note.");
        }
      })
      .catch((err) => alert(err));
  } else {
    alert("No form data to submit.");
  }
};



return (
  <div className='mb-5'> 
   
      <h1 className='text-3xl'>Course Information</h1>
      {/* <Progress progress={33} /> */}
      <hr />
      <br />
      <Card className='max-w-3xl mx-auto'>
        <form onSubmit={handleSubmit}>
        <div className='w-full gap-4'>


          {/* Title and Semester */}
          <div className='w-full gap-4 flex flex-col sm:flex-row'>
            <div className='w-full'>
              <div className="mb-2 block">
                <Label htmlFor="title" value="Title" />
              </div>
              <TextInput id="title" type="text" value={Title} onChange={handleTitle} />
            </div>
            <div className="w-full">
              <div className="mb-2 block">
                <Label htmlFor="semester" value="Semester" />
              </div>
              <Select id="semester" value={Semester} onChange={handleSemester} required>
            
                <option value="1st Semester">1st Semester</option>
                <option value="2nd Semester">2nd Semester</option>
            
              </Select>
            </div>
          </div>
      

          {/* Alumni Year and Campus */}
          <div className='w-full gap-4 flex flex-col sm:flex-row'>
            <div className="w-full">
              <div className="mb-2 block">
                <Label htmlFor="alumni-year" value="Alumni Year" />
              </div>
              <TextInput id="title" type="text" value={AlumniYear} onChange={handleAlumniYear} />
            </div>
        
            <div className="w-full">
              <div className="mb-2 block">
                <Label htmlFor="campus" value="Campus" />
              </div>
              <Select id="campus" value={Campus} onChange={handleCampus} required>
                <option value="Main Campus">Main Campus</option>
                <option value="Satellite Campus">Satellite Campus</option>
              </Select>
            </div>
          </div>

          {/* Course Code and Department */}
          <div className='w-full gap-4 flex flex-col sm:flex-row'>
            <div className='w-full'>
              <div className="mb-2 block">
                <Label htmlFor="course-code" value="Course Code" />
              </div>
              <TextInput id="course-code" type="text" value={CourseCode} onChange={handleCourseCode} />
            </div>
            <div className="w-full">
              <div className="mb-2 block">
                <Label htmlFor="department" value="Department" />
              </div>
              <Select id="department" value={Department} onChange={handleDepartment} required>
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
              </Select>
            </div>
          </div>

          {/* Type of Examination and Course Type */}
          <div className='w-full gap-4 flex flex-col sm:flex-row'>
            <div className="w-full">
              <div className="mb-2 block">
                <Label htmlFor="exam-type" value="Type of Examination" />
              </div>
              <Select id="exam-type" value={ExaminationType} onChange={handleExaminationType} required>
                <option value="Written">Written</option>
                <option value="Oral">Oral</option>
                <option value="Practical">Practical</option>
              </Select>
            </div>
            <div className='w-full'>
              <div className="mb-2 block">
                <Label htmlFor="course-type" value="Course Type" />
              </div>
              <TextInput id="course-type" type="text" value={CourseType} onChange={handleCourseType} />
            </div>
          </div>

          {/* Date of Examination */}
          <div className='w-full'>
            <div className="mb-2 block">
              <Label htmlFor="exam-date" value="Date of Examination" />
            </div>
            <TextInput id="exam-date" type="date" value={ExaminationDate} onChange={handleExaminationDate} />
          </div>

          {/* Faculty */}
          <div className='w-full'>
            <div className="mb-2 block">
              <Label htmlFor="faculty" value="Faculty" />
            </div>
            <TextInput id="faculty" type="text" value={Faculty} onChange={handleFaculty} />
          </div>

          {/* Department Chairperson */}
          <div className='w-full'>
            <div className="mb-2 block">
              <Label htmlFor="chairperson" value="Department Chairperson" />
            </div>
            <TextInput id="chairperson" type="text" value={Chairperson} onChange={handleChairperson} />
          </div>

          {/* College Dean */}
          <div className='w-full'>
            <div className="mb-2 block">
              <Label htmlFor="dean" value="College Dean" />
            </div>
            <TextInput id="dean" type="text" value={Dean} onChange={handleDean} />
          </div>

          {/* Campus Executive Director */}
          <div className='w-full'>
            <div className="mb-2 block">
              <Label htmlFor="executive-director" value="Campus Executive Director" />
            </div>
            <TextInput id="executive-director" type="text" value={Director} onChange={handleDirector} />
          </div>
        </div>
        {/* <button className='bg-blue-950 hover:bg-blue-800 py-2 text-white rounded-lg'>Next</button> */}
        <Button type='submit' className='mx-auto mt-3'>Submit</Button>
        </form>
      </Card>
   
  </div>
);
}


export default TOSform;
