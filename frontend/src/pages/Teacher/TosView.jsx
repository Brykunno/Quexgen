import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card,Progress,Label, Textarea, TextInput,Button,RangeSlider,Modal,Select,Breadcrumb } from "flowbite-react";
import api from "../../api";
import { HiHome } from "react-icons/hi";
import TaxonomyAllocation from '../../components/TaxonomyAllocation';

function TosView() {
  const [TOSContent, setTOSContent] = useState([]);
  const [TOSInfo, setTOSInfo] = useState([]);
  const [TotalItems, setTotalItems] = useState(0);
  const [formData, setFormData] = useState({
    Title: '',
    Semester: '1st Semester',
    AcademicYear: '',
    Campus: 'San Carlos Campus',
    CourseCode: '',
    Department: 'Business and Office Administration',
    ExaminationType: 'Multiple choices',
    CourseType: '',
    ExaminationDate: '',
    Faculty: '',
    Chairperson: '',
    Dean: '',
    Director: ''
  });

  const [lessonData,setLessonData] = useState([{  
    topic: '',
  learning_outcomes: '',
  teachingHours: 0,
  allocation: 0,
  items: 0,
  remembering: 0,
  understanding: 0,
  applying: 0,
  analyzing: 0,
  evaluating: 0,
  creating: 0,
  total: 0,
  placement: '',
  totalItems:0,
  tos_teacher: 0,
  }])

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getTOSContent();
      getTOSInfo();
    }
  }, [id]);

  useEffect(() => {
    if (TOSInfo.length) {
      setFormData({
        Title: TOSInfo[0].Title,
        Semester: TOSInfo[0].Semester,
        AcademicYear: TOSInfo[0].AcademicYear,
        Campus: TOSInfo[0].Campus,
        CourseCode: TOSInfo[0].CourseCode,
        Department: TOSInfo[0].Department,
        ExaminationType: TOSInfo[0].ExaminationType,
        CourseType: TOSInfo[0].CourseType,
        ExaminationDate: TOSInfo[0].ExaminationDate,
        Faculty: TOSInfo[0].Faculty,
        Chairperson: TOSInfo[0].Chairperson,
        Dean: TOSInfo[0].Dean,
        Director: TOSInfo[0].Director
      });
    }
  
    if (TOSContent.length) {
      // Map over TOSContent to update lessonData
      const updatedLessonData = TOSContent.map((content) => ({
        topic: content.topic,
        learning_outcomes: content.learning_outcomes || '',
        teachingHours: content.teachingHours || 0,
        allocation: content.allocation || 0,
        items: content.items || 0,
        remembering: content.remembering || 0,
        understanding: content.understanding || 0,
        applying: content.applying || 0,
        analyzing: content.analyzing || 0,
        evaluating: content.evaluating || 0,
        creating: content.creating || 0,
        total: content.total || 0,
        placement: content.placement || '',
        totalItems: content.totalItems || 0,
        tos_teacher: content.tos_teacher || 0,
       
      }));

      const updateTotalItems = TOSContent.reduce((total, content) => total + content.items, 0);

      const calculatePercentage = (totalValue, totalItems) => (totalValue / totalItems) * 100;


// Sum for each category
const totalRemembering = TOSContent.reduce((total, content) => total + content.remembering, 0);
const totalUnderstanding = TOSContent.reduce((total, content) => total + content.understanding, 0);
const totalApplying = TOSContent.reduce((total, content) => total + content.applying, 0);
const totalAnalyzing = TOSContent.reduce((total, content) => total + content.analyzing, 0);
const totalEvaluating = TOSContent.reduce((total, content) => total + content.evaluating, 0);
const totalCreating = TOSContent.reduce((total, content) => total + content.creating, 0);

// Calculate percentages
const updateRemembering = calculatePercentage(totalRemembering, updateTotalItems);
const updateUnderstanding = calculatePercentage(totalUnderstanding, updateTotalItems);
const updateApplying = calculatePercentage(totalApplying, updateTotalItems);
const updateAnalyzing = calculatePercentage(totalAnalyzing, updateTotalItems);
const updateEvaluating = calculatePercentage(totalEvaluating, updateTotalItems);
const updateCreating = calculatePercentage(totalCreating, updateTotalItems);

// Set state for each percentage
setRemembering(updateRemembering);
setUnderstanding(updateUnderstanding);
setApplying(updateApplying);
setAnalyzing(updateAnalyzing);
setEvaluating(updateEvaluating);
setCreating(updateCreating);
      setTotalItems(updateTotalItems);
      setLessonData(updatedLessonData);  // Replace the entire lessonData with the mapped content
    }
  }, [TOSInfo, TOSContent]);
  

  const getTOSContent = () => {
    api
      .get(`/api/tos-content/${id}/detail/`)
      .then((res) => res.data)
      .then((data) => {setTOSContent(data)
        console.log('toscontent: ', data);
      })
      .catch((err) => alert(err));
  };

  const getTOSInfo = () => {
    api
      .get(`/api/tos-info/${id}/detail/`)
      .then((res) => res.data)
      .then((data) => {
        setTOSInfo(data);
        console.log('tosinfo: ', data);
      })
      .catch((err) => alert(err));
  };

  const updateTOSinfo = async () => {
    try {
      const response = await api.put(`/api/tos-info/${id}/update/`, formData);
      setTOSInfo(response.data);
     alert('Updated TOSInfo: ', response.data);
    } catch (error) {
      console.error('Error updating TOSInfo:', error);
      // Optional: Show a more user-friendly message or use a toast notification
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const updatedFormData = {
      ...formData,
      [name]: value
    };
    setFormData(updatedFormData);
   
  };

  const [step, setStep] = useState(1);

const [disableNext, setDisableNext] = useState(false);

const [disableBack, setDisableBack] = useState(false);

const handleNext = () => {
  setStep(step + 1);
};

const handleBack = () => {
  setStep(step - 1);
};

const [Remembering, setRemembering] = React.useState(0);
  const [Understanding, setUnderstanding] = React.useState(0);
  const [Applying, setApplying] = React.useState(0);
  const [Analyzing, setAnalyzing] = React.useState(0);
  const [Evaluating, setEvaluating] = React.useState(0);
  const [Creating, setCreating] = React.useState(0);


  function hundred(value){
    if(value < 0 || value > 100){
      return 0

    }
    else{
      return value
    }
   }

const handleTotalItemsChange = (event) => {
  setTotalItems(event.target.value);
};

const handleRememberingChange = (event) => {

  setRemembering(hundred(event.target.value));
 

};



const handleUnderstandingChange = (event) => {
  setUnderstanding(hundred(event.target.value));
 
  
};

const handleApplyingChange = (event) => {
  setApplying(hundred(event.target.value));
 
 
};

const handleAnalyzingChange = (event) => {
  setAnalyzing(hundred(event.target.value));
 

};

const handleEvaluatingChange = (event) => {
  setEvaluating(hundred(event.target.value));
 
  
};

const handleCreatingChange = (event) => {
  setCreating(hundred(event.target.value));
 

};
let getTotalTaxonomy = Number(Remembering) + Number(Understanding) + Number(Applying) + Number(Analyzing) + Number(Evaluating) + Number(Creating)

function checkTaxonomy(getTotalTaxonomy){
  let check = 100-getTotalTaxonomy

  if(check >= 0){
    return <span className="w-full">{check}% remaining</span>
  }
  else{
    return <span className="w-full text-red-700">Taxonomy allocation exceeds 100%</span>
  }

 }
  return (
    <div className='content'>
   <Card className={`mb-5 ${step == 1? 'show':'hidden'}`}>
  <Breadcrumb aria-label="Default breadcrumb example">
      <Breadcrumb.Item href="/exam_bank" icon={HiHome}>
       Exam Bank
      </Breadcrumb.Item>
      <Breadcrumb.Item >TOS view</Breadcrumb.Item>

    </Breadcrumb>


    

      <Card className='max-w-3xl mx-auto ' >
    
     <div className='w-full gap-4'>


       {/* Title and Semester */}
       <div className='w-full gap-4 flex flex-col sm:flex-row'>
         <div className='w-full'>
           <div className="mb-2 block">
             <Label htmlFor="title" value="Title" />
           </div>
           <TextInput id="title" type="text" name="Title" value={formData.Title} onChange={handleChange} />
           
         </div>
         <div className="w-full">
           <div className="mb-2 block">
             <Label htmlFor="semester" value="Semester" />
           </div>
           <Select id="semester" name="Semester" value={formData.Semester} onChange={handleChange} required>
         
             <option value="1st Semester">1st Semester</option>
             <option value="2nd Semester">2nd Semester</option>
         
           </Select>
         </div>
       </div>
   

       {/* Academic Year and Campus */}
       <div className='w-full gap-4 flex flex-col sm:flex-row'>
         <div className="w-full">
           <div className="mb-2 block">
             <Label htmlFor="Academic-year" value="Academic Year" />
           </div>
           <TextInput id="title" type="text" name="AcademicYear" value={formData.AcademicYear} onChange={handleChange} />
         </div>
     
         <div className="w-full">
           <div className="mb-2 block">
             <Label htmlFor="campus" value="Campus" />
           </div>
           <Select id="campus" name="Campus" value={formData.Campus} onChange={handleChange} required>
             <option value="San Carlos Campus">San Carlos Campus</option>
             <option value="Lingayen Campus">Lingayen Campus</option>
           </Select>
         </div>
       </div>

       {/* Course Code and Department */}
       <div className='w-full gap-4 flex flex-col sm:flex-row'>
         <div className='w-full'>
           <div className="mb-2 block">
             <Label htmlFor="course-code" value="Course Code" />
           </div>
           <TextInput id="course-code" type="text" name="CourseCode" value={formData.CourseCode} onChange={handleChange} />
         </div>
         <div className="w-full">
           <div className="mb-2 block">
             <Label htmlFor="department" value="Department" />
           </div>
           <Select id="department" name="Department" value={formData.Department} onChange={handleChange} required>
             <option value=" Business and Office Administration"> Business and Office Administration</option>
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
           <Select id="exam-type" name="ExaminationType" value={formData.ExaminationType} onChange={handleChange} required>
             <option value="Multiple choices">Multiple choices</option>
             <option value="Identification">Identification</option>
             <option value="True or false">True or false</option>
           </Select>
         </div>
         <div className='w-full'>
           <div className="mb-2 block">
             <Label htmlFor="course-type" value="Course Type" />
           </div>
           <TextInput id="course-type" type="text" name="CourseType" value={formData.CourseType} onChange={handleChange} />
         </div>
       </div>

       <div className='w-full gap-4 flex flex-col sm:flex-row'>
       {/* Date of Examination */}
       <div className='w-full'>
         <div className="mb-2 block">
           <Label htmlFor="exam-date" value="Date of Examination" />
         </div>
         <TextInput id="exam-date" type="date" name="ExaminationDate" value={formData.ExaminationDate} onChange={handleChange} />
       </div>

       {/* Faculty */}
       <div className='w-full'>
         <div className="mb-2 block">
           <Label htmlFor="faculty" value="Faculty" />
         </div>
         <TextInput id="faculty" type="text" name="Faculty" value={formData.Faculty} onChange={handleChange} />
       </div>
       </div>

       <div className='w-full gap-4 flex flex-col sm:flex-row'>
       {/* Department Chairperson */}
       <div className='w-full'>
         <div className="mb-2 block">
           <Label htmlFor="chairperson" value="Department Chairperson" />
         </div>
         <TextInput id="chairperson" type="text" name="Chairperson" value={formData.Chairperson} onChange={handleChange} />
       </div>

       {/* College Dean */}
       <div className='w-full'>
         <div className="mb-2 block">
           <Label htmlFor="dean" value="College Dean" />
         </div>
         <TextInput id="dean" type="text" name="Dean" value={formData.Dean} onChange={handleChange} />
       </div>
       </div>

       {/* Campus Executive Director */}
       <div className='w-2/4'>
         <div className="mb-2 block">
           <Label htmlFor="executive-director" value="Campus Executive Director" />
         </div>
         <TextInput id="executive-director" type="text" name="Director" value={formData.Director} onChange={handleChange} />
       </div>
     </div>
     {/* <button className='bg-blue-950 hover:bg-blue-800 py-2 text-white rounded-lg'>Next</button> */}

  
   </Card>


   </Card>

   <div className={`mb-5 ${step == 2? 'show':'hidden'}`}>

  

  <TaxonomyAllocation totalItems={TotalItems} handleTotalItemsChange={handleTotalItemsChange} handleRememberingChange={handleRememberingChange} handleUnderstandingChange={handleUnderstandingChange} handleApplyingChange={handleApplyingChange} handleAnalyzingChange={handleAnalyzingChange} handleEvaluatingChange={handleEvaluatingChange} handleCreatingChange={handleCreatingChange} Remembering={Remembering} Understanding={Understanding} Applying={Applying} Analyzing={Analyzing} Evaluating={Evaluating} Creating={Creating} getTotalTaxonomy={getTotalTaxonomy} checkTaxonomy={checkTaxonomy} />

 
   </div>

   <div className="w-full justify-center mx-auto flex gap-14">
<Button onClick={handleBack} disabled={disableBack} >Back</Button>
      <Button onClick={handleNext} disabled={disableNext}>Next</Button>
     
      </div>

   {/* <Button onClick={updateTOSinfo}> Update</Button> */}

      {/* <Button href='/exam_bank'> Back to list</Button> */}
    </div>
  );
}

export default TosView;
