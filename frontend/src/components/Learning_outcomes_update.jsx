import React, { useEffect, useState } from 'react';
import {Button} from "@mui/material";
import { Textarea, TextInput,Card,Pagination,FileInput,Label,Spinner,Modal } from 'flowbite-react';
import api from '../api';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LoadingGenerate from './LoadingGenerate';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LearningOutcomeTabsUpdate from './tabs/LearningOutcomeTabsUpdate';
import  useAppSnackbar  from './ui/snackbar/Snackbar';
function Learning_outcomes_update({
  setRemembering,
  Remembering,
  Understanding,
  Analyzing,
  Applying,
  Evaluating,
  Creating,
  setUnderstanding,
  setAnalyzing,
  setApplying,
  setEvaluating,
  setCreating,
  setTotalTaxonomy,
  getTotalTaxonomy,
  addLesson,
  lessonsDataInitial,
  handleLessonDataChange,
  lessonsData,
  removeLesson,
  formData,
  setFormData,
  submit,
  allocations,
  setAllocations,

  handletaxlevelChange,
  setTosModal,totalItems,handleTotalItemsChange,handleInnerLessonDataChange,handleinnertaxlevelChange,
  taxonomyRange,overallItems
  
}) {
  // State to manage input data
 
  const { showSnackbar } = useAppSnackbar();
  const [percent, setPercent] = useState([]);
  const [loading,setLoading] = useState(false)
  const [openModals, setOpenModals] = useState([]);
  const [maximum,setMaximum] = useState([])


const [tax_alloc, setTax] = useState([]);


const removeFile = (index) => {
  // Use filter to create a new array excluding the file at the specified index
  const updatedFiles = files.filter((_, i) => i !== index);
  
  // Update the state with the new files array
  setFiles(updatedFiles);
};

function handleMaximum(index,values){

  const newData = [...maximum]

  newData[index] = Number(values)

  const newDataLesson = [...lessonsData]

  newDataLesson[index]['teachingHours'].map((data,idx)=>{
    newDataLesson[index]['teachingHours'][idx] = 0
    newDataLesson[index]['max'] = Number(values)
  })

    // Update the state with the new data
    setLessonsDataInitial(newDataLesson);

    // Save the updated lessonsData to localStorage
    localStorage.setItem('lessonsData', JSON.stringify(newDataLesson));

     

  setMaximum(newData)

}


function checkMaxMin(index,max){
  const newData =[...lessonsData]

  const totalHours = newData[index]['teachingHours'].reduce((acc, current) => acc + current, 0);
if(max<totalHours){
  showSnackbar(`Total allocation of teaching hours exceeds the maximum teaching hours for lesson ${index+1}`,{variant:"warning"})
}


}

  
 // Calculate the percentage of allocations
const calculatePercentages = (allocations) => {
  const total = Object.values(allocations).reduce((sum, value) => sum + value, 0);
  const percentages = {};

  
  // Step 1: Calculate initial percentages using Math.floor
  let sumOfPercentages = 0;


  for (const key in allocations) {
    percentages[key] = total > 0 ? Math.floor((allocations[key] / total) * 100) : 0;
    sumOfPercentages += percentages[key];
  }

  // Step 2: Calculate the difference and distribute it
  let difference = 100 - sumOfPercentages;
  if (difference > 0) {
    // Sort keys to ensure a consistent distribution
    const keys = Object.keys(percentages).sort((a, b) => allocations[b] - allocations[a]);
    
    // Distribute the difference using Math.ceil
    for (let i = 0; i < difference; i++) {
      percentages[keys[i % keys.length]] += 1;
    }
  }

  return percentages;
};


    useEffect(()=>{
      console.log(allocations)
    },[allocations])

useEffect(()=>{
  
 // Calculate the total allocations
 const tax_allocation = allocations.reduce((acc, data) => {
  acc.Remembering = (acc.Remembering || 0) + (data.Remembering || 0);
  acc.Understanding = (acc.Understanding || 0) + (data.Understanding || 0);
  acc.Analyzing = (acc.Analyzing || 0) + (data.Analyzing || 0);
  acc.Applying = (acc.Applying || 0) + (data.Applying || 0);
  acc.Evaluating = (acc.Evaluating || 0) + (data.Evaluating || 0);
  acc.Creating = (acc.Creating || 0) + (data.Creating || 0);
  return acc;
}, {});


  const percentages = calculatePercentages(tax_allocation);
  setTax(tax_allocation)
  const updatedPercents = percentages
  
  setPercent(updatedPercents);
},[allocations])

  useEffect(()=>{
    
    const remember = Remembering||0;
    const understand = Understanding||0;
    const apply = Applying||0;
    const analyze = Analyzing||0;
    const evaluate = Evaluating||0;
    const create = Creating||0;
    
   

    if(percent.Remembering || percent.Remembering==0){
      setRemembering(percent.Remembering);
    
    }else{
      setRemembering(remember);
     
    }
   

    if(percent.Understanding || percent.Understanding==0){
      setUnderstanding(percent.Understanding);
      
    }else{
      setUnderstanding(understand);
     
    }

    

    if(percent.Applying || percent.Applying==0){
     
      setApplying(percent.Applying);
    }else{
      setApplying(apply);
     
    }

  

    if(percent.Analyzing || percent.Analyzing==0){
      setAnalyzing(percent.Analyzing);
     
    }
    else{
      setAnalyzing(analyze);
   
    }
  

    if(percent.Evaluating || percent.Evaluating==0){
      setEvaluating(percent.Evaluating);
    
    }else{
      setEvaluating(evaluate);
     
    }
    

    if(percent.Creating || percent.Creating==0){
      setCreating(percent.Creating);

    }
    else{
      setCreating(create);

    }
  },[percent]
)


const [currentPage, setCurrentPage] = useState(1);
const lessonsPerPage = 3; // Number of lessons per page

// Calculate the index range for the current page
const indexOfLastLesson = currentPage * lessonsPerPage;
const indexOfFirstLesson = indexOfLastLesson - lessonsPerPage;
const currentLessons = lessonsData.slice(indexOfFirstLesson, indexOfLastLesson);

// Calculate total pages
const totalPages = Math.ceil(lessonsData.length / lessonsPerPage);

const handlePageChange = (pageNumber) => {
  setCurrentPage(pageNumber);
};


const toggleModal = (lessonIndex, modalIndex) => {
  setOpenModals((prev) => {
    const newModals = [...prev]; // Create a shallow copy of the top-level array

    // Ensure the nested array exists for the specified lesson
    if (!Array.isArray(newModals[lessonIndex])) {
      newModals[lessonIndex] = [];
    }

    // Ensure the specific modal state exists
    newModals[lessonIndex] = [...newModals[lessonIndex]]; // Clone the nested array
    newModals[lessonIndex][modalIndex] = !newModals[lessonIndex][modalIndex]; // Toggle the specific modal state

    return newModals;
  });
};



useEffect(()=>{

  

  

 // Calculate the total allocations
// Flatten the nested arrays into a single array
const flattenedAllocations = allocations.flat();

// Calculate the total sums using reduce
const tax_allocation = flattenedAllocations.reduce((acc, data) => {
  acc.Remembering = (acc.Remembering || 0) + (data.Remembering || 0);
  acc.Understanding = (acc.Understanding || 0) + (data.Understanding || 0);
  acc.Analyzing = (acc.Analyzing || 0) + (data.Analyzing || 0);
  acc.Applying = (acc.Applying || 0) + (data.Applying || 0);
  acc.Evaluating = (acc.Evaluating || 0) + (data.Evaluating || 0);
  acc.Creating = (acc.Creating || 0) + (data.Creating || 0);
  return acc;
}, {});



  const percentages = calculatePercentages(tax_allocation);
  setTax(tax_allocation)
  const updatedPercents = percentages
  
  setPercent(updatedPercents);
},[allocations])

  



  return (
    <Card className="mb-5">
    
    {/* Render only the current page of lessons */}



    {/* Add Lesson and Allocate buttons */}

    {loading && <LoadingGenerate />}

      
<LearningOutcomeTabsUpdate previewTos={    <div className='text-center mt-5 mb-5'>
 <Button color="primary" variant="contained" onClick={() => setTosModal(true)}><VisibilityIcon className="mr-2"/>Preview TOS</Button>
    </div>} handleinnertaxlevelChange={handleinnertaxlevelChange} checkMaxMin={checkMaxMin} handleMaximum={handleMaximum} handleInnerLessonDataChange={handleInnerLessonDataChange}  setMaximum={setMaximum} removeFile={removeFile} handleLessonDataChange={handleLessonDataChange} removeLesson={removeLesson} lessonsData = {lessonsData} 
taxonomyRange={taxonomyRange}

totalOfItems={<div className=" flex gap-5 mx-auto justify-between">
    
    <div className="mt-3" >
      <Label htmlFor="totalItems" className="font-bold" >Overall Total of Items<span className="text-red-600">*</span></Label> 
    </div>
    <TextInput id="totalItems" type="number" className="max-w-32 " required value={overallItems} min={'0'} onChange={handleTotalItemsChange} />
  </div>}

/>
  
     
    {/* Pagination controls */}
  
  </Card>
  );
}

export default Learning_outcomes_update;
