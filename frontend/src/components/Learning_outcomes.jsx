import React, { useEffect, useState } from 'react';
import {Button, CardContent, CardHeader} from "@mui/material";
import { Textarea, TextInput,Card,Pagination,FileInput,Label,Spinner,Modal } from 'flowbite-react';
import api from '../api';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LoadingGenerate from './LoadingGenerate';
import DeleteIcon from '@mui/icons-material/Delete';
import ToastError from './ToastError';
import { HiOutlineXCircle,HiCheckCircle,HiOutlineX } from 'react-icons/hi';
import Error from './Error';
import InvalidFileError from './InvalidFileError';
import LearningOutcomeTabs from './tabs/LearningOutcomeTabs';
import ClearIcon from '@mui/icons-material/Clear';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useSnackbar } from 'notistack';
import {RangeSlider} from "flowbite-react";
import { Progress } from 'flowbite-react';
import TaxonomyChart from './ui/snackbar/TaxonomyChart';


function Learning_outcomes({
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
  handleLessonDataChange,
  lessonsData,
  removeLesson,
  formData,
  setFormData,
  submit,
  allocations,setTosModal,
  setAllocations,files,setLessonsDatainitial,lessonsDataInitial,setFiles,handletaxlevelChange,oneAllocation,addAllocation,countOutcomes,handleInnerLessonDataChange,overallItems,handleTotalItemsChange,handleinnertaxlevelChange,addToast,specific,handleRememberingChange,handleUnderstandingChange,handleApplyingChange,handleAnalyzingChange,handleEvaluatingChange,handleCreatingChange,checkTaxonomy

}) {

 
 const { enqueueSnackbar } = useSnackbar();
  const [percent, setPercent] = useState([]);
  const [loading,setLoading] = useState(false)
  const [fileInfo,setFileInfo] = useState([])
  const [read,setRead] = useState(false)
  const [errorFile,setErrorFile] = useState(false)
  const [fileStatus, setFileStatus] = useState(Array(lessonsDataInitial.length).fill(false));
  const [levelModal,setLevelModal] = useState(false)
  const [fileLoading,setFileLoading] = useState(false);

  const [maximum,setMaximum] = useState([])

    // Add a new state to track which modals are open
    const [openModals, setOpenModals] = useState([]);


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
    


const [tax_alloc, setTax] = useState([]);

  
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

const calculateSums = (allocations) => {
  // Validate input
  if (!Array.isArray(allocations) || allocations.length === 0 || !Array.isArray(allocations[0])) {
    console.error("Invalid input structure: allocations must be a non-empty array of arrays.");
    return {};
  }

  // Initialize sum variables
  let sumRemembering = 0;
  let sumUnderstanding = 0;
  let sumApplying = 0;
  let sumAnalyzing = 0;
  let sumEvaluating = 0;
  let sumCreating = 0;

  // Iterate over the first array of objects and calculate sums
  allocations[0].forEach(item => {
    sumRemembering += item.Remembering || 0;
    sumUnderstanding += item.Understanding || 0;
    sumApplying += item.Applying || 0;
    sumAnalyzing += item.Analyzing || 0;
    sumEvaluating += item.Evaluating || 0;
    sumCreating += item.Creating || 0;
  });

  // Aggregate sums into an object
  return {
    "Remembering": sumRemembering,
    "Understanding": sumUnderstanding,
    "Applying": sumApplying,
    "Analyzing": sumAnalyzing,
    "Evaluating": sumEvaluating,
    "Creating": sumCreating,
  };
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

  useEffect(()=>{
    
    const remember = localStorage.getItem('Remembering')||0;
    const understand = localStorage.getItem('Understanding')||0;
    const apply = localStorage.getItem('Applying')||0;
    const analyze = localStorage.getItem('Analyzing')||0;
    const evaluate = localStorage.getItem('Evaluating')||0;
    const create = localStorage.getItem('Creating')||0;
    
   

    if(percent.Remembering || percent.Remembering==0){
      setRemembering(percent.Remembering);
      localStorage.setItem('Remembering',percent.Remembering);
    }else{
      setRemembering(remember);
      localStorage.setItem('Remembering',remember);
    }
   

    if(percent.Understanding || percent.Understanding==0){
      setUnderstanding(percent.Understanding);
      localStorage.setItem('Understanding',percent.Understanding);
    }else{
      setUnderstanding(understand);
      localStorage.setItem('Understanding',understand);
    }

    

    if(percent.Applying || percent.Applying==0){
      localStorage.setItem('Applying',percent.Applying);
      setApplying(percent.Applying);
    }else{
      setApplying(apply);
      localStorage.setItem('Applying',apply);
    }

  

    if(percent.Analyzing || percent.Analyzing==0){
      setAnalyzing(percent.Analyzing);
      localStorage.setItem('Analyzing',percent.Analyzing);
    }
    else{
      setAnalyzing(analyze);
      localStorage.setItem('Analyzing',analyze);
    }
  

    if(percent.Evaluating || percent.Evaluating==0){
      setEvaluating(percent.Evaluating);
      localStorage.setItem('Evaluating',percent.Evaluating);
    }else{
      setEvaluating(evaluate);
      localStorage.setItem('Evaluating',evaluate);
    }
    

    if(percent.Creating || percent.Creating==0){
      setCreating(percent.Creating);
      localStorage.setItem('Creating',percent.Creating);
    }
    else{
      setCreating(create);
      localStorage.setItem('Creating',create);
    }
  },[percent]
)    


useEffect(()=>{
setMaximum(Array(lessonsData?.length || 0).fill(0))
},[])

useEffect(() => {
  const updateExaminationType = () => {
    const creating = Number(localStorage.getItem('Creating'));
    const evaluating = Number(localStorage.getItem('Evaluating'));
    const applying = Number(localStorage.getItem('Applying'));
    
    // Determine the new examination type
    let updatedExaminationType = [...formData.ExaminationType];

    // Check if 'Subjective' should be added
    if (creating > 0 || evaluating > 0 || applying > 0) {
      if (!updatedExaminationType.includes('Subjective')) {
        updatedExaminationType.push('Subjective'); // Add 'Subjective'
      }
    } else {
      // Remove 'Subjective' if it exists
      updatedExaminationType = updatedExaminationType.filter(type => type !== 'Subjective');
    }

    // Update formData and localStorage
    setFormData((prev) => {
      const updatedFormData = {
        ...prev,
        ExaminationType: updatedExaminationType,
      };

      // Update localStorage with the new formData
      localStorage.setItem('formData', JSON.stringify(updatedFormData));

      return updatedFormData; // Return updated formData to set the state
    });
  };

  updateExaminationType();
},[setFormData]); // Add dependencies to run effect when formData changes

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

const handleReadFile = async () => {

  
  if (files.length == 0) {
  
    setErrorFile(true)
 
    return;
  }
  const updatedFileInfo = []; // Initialize an array to store file information
  setRead(true)


  for (let i = 0; i < files.length; i++) {
    if (!files[i]) {
      
      setErrorFile(true)
      setRead(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', files[i]); // Append the selected file

    try {
      // Make a request to Django to process the file and JSON data
      const response = await api.post('/api/lesson-info/', formData, {
        headers: {
          
          'Content-Type': 'multipart/form-data',
        },
      });

      // Process the response to get the lesson info
      const dataques = response.data.lesson_info;
  

      // Add the lesson info object to the updated fileInfo array
      updatedFileInfo.push(dataques);

    } catch (error) {
      console.error('Error processing the file and data:', error);
    }
  }

  // Update the state with the accumulated fileInfo as an array of objects
  setFileInfo(updatedFileInfo);

  // Update lessons data and save it to localStorage
  updatedFileInfo.forEach((data, index) => {
    const newData = [...lessonsDataInitial];

    // Update the specific fields in the corresponding lesson object
    newData[index]['topic'] = data[0].lesson_topic;
    newData[index]['learning_outcomes'] = data[0].learning_outcomes;

    // Save the updated lessonsData to localStorage
    localStorage.setItem('lessonsData', JSON.stringify(newData));
    setLessonsDatainitial(newData);
    setRead(false)
  });
};

const handleReadOneFile = async (value,index) => {
  setFileLoading(true)
  setRead(true)
  const updatedFileInfo = []; // Initialize an array to store file information
    const formData = new FormData();
    formData.append('file', value); // Append the selected file

    try {
      // Make a request to Django to process the file and JSON data
      const response = await api.post('/api/lesson-info/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Process the response to get the lesson info
      const dataques = response.data.lesson_info;


      // Add the lesson info object to the updated fileInfo array
      updatedFileInfo.push(dataques);
      setFileLoading(false)

    } catch (error) {
      console.error('Error processing the file and data:', error);
    }
  

  // Update the state with the accumulated fileInfo as an array of objects
  setFileInfo(updatedFileInfo);

  // Update lessons data and save it to localStorage

  
 
  updatedFileInfo.forEach( async (data) => {
    const newData = [...lessonsDataInitial];

    // Update the specific fields in the corresponding lesson object
    newData[index]['topic'] = data[0].lesson_topic;
    
  const response_out = await api.post('/api/count_outcomes/', {
    objectives: data[0].learning_outcomes,
  });

  let outArray = response_out.data.outcomes;


    newData[index]['learning_outcomes'] = outArray;
    newData[index]['teachingHours'] = Array(outArray?.length || 0).fill(0);
    newData[index]['allocation'] = Array(outArray?.length || 0).fill(0);
    newData[index]['items'] = Array(outArray?.length || 0).fill(0);
    newData[index]['remembering'] = Array(outArray?.length || 0).fill(0);
    newData[index]['understanding'] = Array(outArray?.length || 0).fill(0);
    newData[index]['applying'] = Array(outArray?.length || 0).fill(0);
    newData[index]['analyzing'] = Array(outArray?.length || 0).fill(0);
    newData[index]['evaluating'] = Array(outArray?.length || 0).fill(0);
    newData[index]['creating'] = Array(outArray?.length || 0).fill(0);
    newData[index]['total'] = Array(outArray?.length || 0).fill(0);
    newData[index]['placement'] = Array(outArray?.length || '').fill('');
    newData[index]['totalItems'] = Array(outArray?.length || 0).fill(0);
    newData[index]['taxonomy_levels']['Remembering'] = Array(outArray?.length || 0).fill(0);
    newData[index]['taxonomy_levels']['Understanding'] = Array(outArray?.length || 0).fill(0);
    newData[index]['taxonomy_levels']['Analyzing'] = Array(outArray?.length || 0).fill(0);
    newData[index]['taxonomy_levels']['Applying'] = Array(outArray?.length || 0).fill(0);
    newData[index]['taxonomy_levels']['Evaluating'] = Array(outArray?.length || 0).fill(0);
    newData[index]['taxonomy_levels']['Creating'] = Array(outArray?.length || 0).fill(0);
    
   oneAllocation(newData[index]['learning_outcomes'],index)

    // Save the updated lessonsData to localStorage
    localStorage.setItem('lessonsData', JSON.stringify(newData));
    setLessonsDatainitial(newData);
    setRead(false)
    
  });
 
};

useEffect(() => {
  if (files.length < 1) {
    // Create a new array with updated file_status
    const updatedLessons = lessonsData.map(lesson => ({
      ...lesson, // Spread the existing lesson data
      file_status: "", // Set file_status to an empty string
    }));
    
    // Update the state with the new lessons data
    setLessonsDatainitial(updatedLessons);
    localStorage.setItem('lessonsData', JSON.stringify(updatedLessons));
  }
}, [files.length]); // Dependency on files.length to rerun when it changes



const handleValidateFile = async (value,index) => {
  setFileStatus((prev) => {
    const newStatus = [...prev];
    newStatus[index] = true; // Set the specific index to true
    return newStatus;
  });

  const formData = new FormData();
  formData.append('file', value); // Append the selected file

  try {
    // Make an asynchronous request to Django to process the file and JSON data
    const response = await api.post('/api/validate-pdf/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });


    const fileStats = response.data.file_status[0]
    // Process the response to get the lesson info

    const newData = [...lessonsDataInitial]


      newData[index]['file_status'] = fileStats 
 
    
    setLessonsDatainitial(newData);
    setFileStatus((prev) => {
      const newStatus = [...prev];
      newStatus[index] = false; // Reset the specific index in case of error
      return newStatus;
    });
  
  } catch (error) {
    // Handle errors that may occur during the request
    console.error('Error processing the file and data:', error);
    setFileStatus((prev) => {
      const newStatus = [...prev];
      newStatus[index] = false; // Reset the specific index in case of error
      return newStatus;
    });
  }

  
  
};



const getFileStatus = (fileStatus) => {
  if (fileStatus === undefined || fileStatus.status === "") {
    return <div className='text-red-600 font-semibold flex gap-1'>No file uploaded!</div>;
  }

  
  if(fileStatus.status === "Valid"){
    
    return <div className='text-green-600 font-semibold flex gap-1'>Valid file <HiCheckCircle className='mt-1'/></div>
  } 
     else if(fileStatus.status === "Invalid"){
      return <div className='text-red-600 font-semibold '><div className='flex gap-1'>Invalid file    <InvalidFileError lessonsData={lessonsData} getTotalTaxonomy={getTotalTaxonomy} totalItems={totalItems} files={files} missing_keywords={fileStatus.missing_keywords}  /></div> 
   
      </div>;
     }
     
};

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
    setLessonsDatainitial(newDataLesson);

    // Save the updated lessonsData to localStorage
    localStorage.setItem('lessonsData', JSON.stringify(newDataLesson));

     

  setMaximum(newData)

}


function checkMaxMin(index,max){
  const newData =[...lessonsData]

  const totalHours = newData[index]['teachingHours'].reduce((acc, current) => acc + current, 0);
if(max<totalHours){
  enqueueSnackbar(`Total allocation of teaching hours exceeds the maximum teaching hours for lesson ${index+1}`,{variant:"warning"})
}


}

function checkBelow(index){
  if(index<0){
    return false
  }

  const newData =[...lessonsData]
  const length = newData.length
  const totalHours = newData[length-1]['teachingHours'].reduce((acc, current) => acc + current, 0);
  if(newData[index]['max']>totalHours){

    return true
  }
  else{
    return false
  }

}

function checkAbove(index){


  if(index<0){
    return false
  }
  const newData =[...lessonsData]
  const length = newData.length
  const totalHours = newData[length-1]['teachingHours'].reduce((acc, current) => acc + current, 0);
  if(newData[index]['max']<totalHours){

    return true
  }
  else{
    return false
  }

}



  return (
    <div className="mb-5">
       <div className="flex justify-end">
        <div  className="  flex gap-5" >
       
 
      
      
        </div>
  
      </div>
      
<LearningOutcomeTabs 

fileLoading = {fileLoading}
addLesson={       <Button
          color={'primary'}
          variant='contained'
          className="mt-3"
          onClick={() =>{
           
            if(checkBelow(lessonsData.length-1) == false && checkAbove(lessonsData.length-1) == false || lessonsData.length ==0  ){
              const lessonlength = lessonsData.length
               if(lessonsData[lessonlength-1]?.file_status == ""){
                    return enqueueSnackbar(`Plese upload a study guide for lesson ${ lessonsData.length}`,{variant:"warning"});
                }

                if(lessonlength>0 && maximum[lessonsData.length-1]==0 || lessonlength>0 && maximum[lessonsData.length-1]==null){
                    return enqueueSnackbar(`Plese enter the maximum teaching hours for lesson ${ lessonsData.length}`,{variant:"warning"});
                }
            addLesson({
              topic: '',
              learning_outcomes: [],
              teachingHours: [],
              allocation: 0,
              items: [],
              remembering: 0,
              understanding: 0,
              applying: 0,
              analyzing: 0,
              evaluating: 0,
              creating: 0,
              total: 0,
              placement: '',
              totalItems: 0,
              max:0,
              file_status:'',
              taxonomy_levels:{
                Remembering:0,
                Understanding:0,
                Applying:0,
                Analyzing:0,
                Evaluating:0,
                Creating:0
              }
            });

            addAllocation(
              {
                Remembering:0,
                Understanding:0,
                Applying:0,
                Analyzing:0,
                Evaluating:0,
                Creating:0
              }
            )

            setMaximum((prevMaximum) => [...prevMaximum, 0]);
          
          }
          else if(checkBelow(lessonsData.length-1)== true){
            enqueueSnackbar(`The total allocation of teaching hours is below the maximum teaching hours allowed for the lesson ${ lessonsData.length}`,{variant:"warning"})
          }
          else if(checkAbove(lessonsData.length-1)== true){
            enqueueSnackbar(`The total allocation of teaching hours is above the maximum teaching hours allowed for the lesson ${ lessonsData.length}`,{variant:"warning"})
          }
         
        }
          }
        >
          <AddCircleOutlineIcon className="mr-2 " /> Add Lesson
        </Button>
} previewTOS={ <Button color="primary" variant="contained" onClick={() => setTosModal(true)}><VisibilityIcon className="mr-2"/>Preview TOS</Button>} handleinnertaxlevelChange={handleinnertaxlevelChange} checkMaxMin={checkMaxMin} handleMaximum={handleMaximum} handleInnerLessonDataChange={handleInnerLessonDataChange} handleReadOneFile={handleReadOneFile} handleValidateFile={handleValidateFile} setMaximum={setMaximum} removeFile={removeFile} handleLessonDataChange={handleLessonDataChange} removeLesson={removeLesson} lessonsData = {lessonsData} fileStatus={fileStatus} getFileStatus={getFileStatus} lessonsDataInitial={lessonsDataInitial}
taxonomyRange={   <div className="flex gap-3"> 
      <Card className=" gap-4 mb-5  w-full px-3"> 
<Card className='bg-yellow-50'>
<div className=" flex gap-5 mx-auto justify-between w-full">
    
    <div className="mt-3" >
      <Label htmlFor="totalItems" className="font-bold text-blue-500" >OVERALL TOTAL ITEMS</Label> 
    </div>
    <TextInput id="totalItems" type="number" className="max-w-32 " required value={overallItems} min={'0'} onChange={handleTotalItemsChange} />
  </div>
  </Card>
           
        <div>
        <div className="mb-3">
        {/* <ToggleSwitch checked={specific} label={specific?'Locked':'Unlocked'} onChange={setSpecific} color={"primary"} className="mx-auto" /> */}
        </div>
       
 <h1 className='text-center font-bold'>Overall Bloom's Taxonomy Allocation</h1>
      {/* <div className="max-w-md flex gap-5">
    
        <div className="mt-3" >
          <Label htmlFor="totalItems" className="font-bold" > Total of Items<span className="text-red-600">*</span></Label> 
        </div>
        <TextInput id="totalItems" type="number" className="max-w-32 " required value={totalItems} min={'0'} onChange={handleTotalItemsChange} />
      </div> */}
      </div>

      {/* <div>
        <div className="flex gap-3">
        <div className="mt-2 block w-32">
          <Label htmlFor="md-range" value="Remembering" />
        </div>
        <RangeSlider id="md-range" sizing="md" className="mt-2 w-full hidden md:block" value={Remembering} onChange={handleRememberingChange} disabled={specific} />
        <div className="flex">
        <input type="number" disabled={specific}  className="border-0 border-b-2 border-black w-10 bg-transparent focus:outline-none p-0" value={Remembering}  onChange={handleRememberingChange} /><span className="mt-2">%</span>
        </div>
        </div>
      </div>


      <div>
        <div className="flex gap-3">
        <div className="mt-2 block w-32">
          <Label htmlFor="md-range" value="Understanding" />
        </div>
        <RangeSlider id="md-range" sizing="md" className="mt-2 w-full hidden md:block" value={Understanding} onChange={handleUnderstandingChange} disabled={specific} />
        <div className="flex">
        <input type="number" className="border-0 border-b-2 border-black w-10 bg-transparent focus:outline-none p-0" value={Understanding} disabled={specific}  onChange={handleUnderstandingChange} /><span className="mt-2">%</span>
        </div>
        </div>
      </div>


      <div>
        <div className="flex gap-3">
        <div className="mt-2 block w-32">
          <Label htmlFor="md-range" value="Applying" />
        </div>
        <RangeSlider id="md-range" sizing="md" className="mt-2 w-full hidden md:block" value={Applying} onChange={handleApplyingChange} disabled={specific} />
        <div className="flex">
        <input type="number" className="border-0 border-b-2 border-black w-10 bg-transparent focus:outline-none p-0" value={Applying} disabled={specific}  onChange={handleApplyingChange} /><span className="mt-2">%</span>
        </div>
        </div>
      </div>


      <div>
        <div className="flex gap-3">
        <div className="mt-2 block w-32">
          <Label htmlFor="md-range" value="Analyzing" />
        </div>
        <RangeSlider id="md-range" sizing="md" className="mt-2 w-full hidden md:block" value={Analyzing} onChange={handleAnalyzingChange} disabled={specific} />
        <div className="flex">
        <input type="number" className="border-0 border-b-2 border-black w-10 bg-transparent focus:outline-none p-0" value={Analyzing} disabled={specific}   onChange={handleAnalyzingChange} /><span className="mt-2">%</span>
        </div>
        </div>
      </div>



      <div>
        <div className="flex gap-3">
        <div className="mt-2 block w-32">
          <Label htmlFor="md-range" value="Evaluating" />
        </div>
        <RangeSlider id="md-range" sizing="md" className="mt-2 w-full hidden md:block" value={Evaluating} onChange={handleEvaluatingChange} disabled={specific} />
        <div className="flex">
        <input type="number" className="border-0 border-b-2 border-black w-10 bg-transparent focus:outline-none p-0" value={Evaluating} disabled={specific}  onChange={handleEvaluatingChange} /><span className="mt-2">%</span>
        </div>
        </div>
      </div>


      <div>
        <div className="flex gap-3">
        <div className="mt-2 block w-32">
          <Label htmlFor="md-range" value="Creating" />
        </div>
        <RangeSlider id="md-range" sizing="md" className="mt-2 w-full hidden md:block" value={Creating} onChange={handleCreatingChange} disabled={specific} />
        <div className="flex">
        <input type="number" className="border-0 border-b-2 border-black w-10 bg-transparent focus:outline-none p-0" value={Creating} disabled={specific}   onChange={handleCreatingChange} /><span className="mt-2">%</span>
        </div>
        </div>
      </div> */}
        <TaxonomyChart Remembering={Remembering} Understanding={Understanding} Applying={Applying} Analyzing={Analyzing} Evaluating={Evaluating} Creating={Creating} />

       
      {/* <hr  />
      <div className=" flex justify-between"> 
      <span className="max-w-96 mr-20">Total:</span>
      <span className="w-full text-center">
      <Progress
      
      progress={getTotalTaxonomy}
      progressLabelPosition="inside"
  
      color={'primary'}
      className=" hidden md:block"
    
      size="lg"
     
    />
   
      {checkTaxonomy(getTotalTaxonomy)} </span>
      <span className="max-w-96 ml-6 flex justify-end ">
        <div className="w-10 font-bold">
        {getTotalTaxonomy}%</div></span> 
      
      </div> */}
    



         <div className='text-center'>
          <Button color="primary" variant="contained" onClick={() => setTosModal(true)}><VisibilityIcon className="mr-2"/>Preview TOS</Button>
        </div>
    
      
      </Card>
    

      </div> }

totalOfItems={
<Card >
<div className=" flex gap-5 mx-auto justify-between w-full">
    
    <div className="mt-3" >
      <Label htmlFor="totalItems" className="font-bold text-blue-500" >OVERALL TOTAL ITEMS</Label> 
    </div>
    <TextInput id="totalItems" type="number" className="max-w-32 " required value={overallItems} min={'0'} onChange={handleTotalItemsChange} />
  </div>
  </Card>}

/>


    {loading && <LoadingGenerate />}
    {errorFile && <ToastError message="Please upload a file for every lesson" setToast={setErrorFile}/>}
  
    {/* Pagination controls */}
    {/* {JSON.stringify(lessonsData)} */}
     {/* {JSON.stringify(maximum)} */}
   

  </div>
  );
}

export default Learning_outcomes;
