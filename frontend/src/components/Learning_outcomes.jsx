import React, { useEffect, useState } from 'react';
import {Button} from "@mui/material";
import { Textarea, TextInput,Card,Pagination,FileInput,Label,Spinner,Modal } from 'flowbite-react';
import api from '../api';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LoadingGenerate from './LoadingGenerate';
import DeleteIcon from '@mui/icons-material/Delete';
import ToastError from './ToastError';
import { HiOutlineXCircle,HiCheckCircle,HiOutlineX } from 'react-icons/hi';
import Error from './Error';
import InvalidFileError from './InvalidFileError';
import CancelIcon from '@mui/icons-material/Cancel';
import ClearIcon from '@mui/icons-material/Clear';

function Learning_outcomes({
  setRemembering,
  Remembering,
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
  allocations,
  setAllocations,files,setLessonsDatainitial,lessonsDataInitial,setFiles,handletaxlevelChange,oneAllocation,addAllocation
  
}) {

 
 
  const [percent, setPercent] = useState([]);
  const [loading,setLoading] = useState(false)
  const [fileInfo,setFileInfo] = useState([])
  const [read,setRead] = useState(false)
  const [errorFile,setErrorFile] = useState(false)
  const [fileStatus, setFileStatus] = useState(Array(lessonsDataInitial.length).fill(false));
  const [levelModal,setLevelModal] = useState(false)

    // Add a new state to track which modals are open
    const [openModals, setOpenModals] = useState([]);

    // Function to toggle a specific modal
    const toggleModal = (index) => {
      setOpenModals((prev) => {
        const updatedModals = [...prev];
        updatedModals[index] = !updatedModals[index]; // Toggle the specific modal at index
        return updatedModals;
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
      console.log('Processed response:', dataques);

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
      console.log('Processed response:', dataques);

      // Add the lesson info object to the updated fileInfo array
      updatedFileInfo.push(dataques);

    } catch (error) {
      console.error('Error processing the file and data:', error);
    }
  

  // Update the state with the accumulated fileInfo as an array of objects
  setFileInfo(updatedFileInfo);

  // Update lessons data and save it to localStorage
 
  updatedFileInfo.forEach((data) => {
    const newData = [...lessonsDataInitial];

    // Update the specific fields in the corresponding lesson object
    newData[index]['topic'] = data[0].lesson_topic;
    newData[index]['learning_outcomes'] = data[0].learning_outcomes;
    
    
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

    console.log('Stats: ',response.data)
    const fileStats = response.data.file_status[0]
    // Process the response to get the lesson info
    console.log('Processed response file:',fileStats );
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
      return <div className='text-red-600 font-semibold '><div className='flex gap-1'>Invalid file     <InvalidFileError lessonsData={lessonsData} getTotalTaxonomy={getTotalTaxonomy} totalItems={totalItems} files={files} missing_keywords={fileStatus.missing_keywords}  /></div> 
   
      </div>;
     }
     
};

const removeFile = (index) => {
  // Use filter to create a new array excluding the file at the specified index
  const updatedFiles = files.filter((_, i) => i !== index);
  
  // Update the state with the new files array
  setFiles(updatedFiles);
};



  return (
    <Card className="mb-5">


    {/* Render only the current page of lessons */}
    {currentLessons.map((item, index) => (
     <Card key={indexOfFirstLesson + index} className="relative">
     {/* Delete button positioned in the top right */}
     <div className="absolute top-2 right-2">
       <Button
        
         size={'xs'}
         color={'error'}
      
        
       >
        <ClearIcon  className=" hover:scale-110 transition-transform duration-200"  onClick={() => {removeLesson(lessonsData, indexOfFirstLesson + index); removeFile(indexOfFirstLesson + index)}} />

       </Button>
     </div>
   
     <div className="mb-3">
       <div>
         <div className="mb-2 block">
           <Label htmlFor="file-upload">
             Upload file for Lesson {indexOfFirstLesson + index + 1} <span className="text-red-600">*</span>
           </Label>
         </div>
         <div className="flex gap-5">
           <FileInput
             id="file-upload"
             accept="application/pdf"
             className="flex-1"
             sizing="sm"
             onChange={(e) => {
               handleLessonDataChange(indexOfFirstLesson + index, 'study_guide', e.target.files[0]);
               handleValidateFile(e.target.files[0], indexOfFirstLesson + index);
               handleReadOneFile(e.target.files[0], indexOfFirstLesson + index);
             }}
           />
           <div>
             {fileStatus[indexOfFirstLesson + index] ? (
               <div><Spinner color="primary" /> Validating file...</div>
             ) : (
               <span>{getFileStatus(lessonsDataInitial[indexOfFirstLesson + index]?.file_status)}</span>
             )}
           </div>
         </div>
       </div>
     </div>
   
     <div className="flex flex-col gap-5 mb-4 md:flex-row">
       <div className="flex-1">
         <div className="ms-2 font-bold mb-2">Lesson {indexOfFirstLesson + index + 1}</div>
         <Textarea
           value={lessonsData[indexOfFirstLesson + index]['topic']}
           style={{ height: '100px' }}
           onChange={(e) => handleLessonDataChange(indexOfFirstLesson + index, 'topic', e.target.value)}
           placeholder="Enter the summary of the lesson"
         />
       </div>
       <div className="flex-1">
         <div className="ms-2 font-bold mb-2">Learning outcomes</div>
         <Textarea
           value={lessonsData[indexOfFirstLesson + index]['learning_outcomes']}
           style={{ height: '100px' }}
           onChange={(e) => handleLessonDataChange(indexOfFirstLesson + index, 'learning_outcomes', e.target.value)}
           placeholder="Enter the learning outcomes for the lesson"
         />
       </div>
     </div>
   
     <div className='flex justify-center'>
       <Button
         color="primary"
         variant='contained'

         disabled={item.file_status === ""}
         onClick={() => toggleModal(indexOfFirstLesson + index)}
       
       >
         Identify levels of taxonomy
       </Button>
     </div>
   
     <Modal size="md" show={openModals[index]} onClose={() => toggleModal(index)}>
       <Modal.Header>Identify taxonomy levels</Modal.Header>
       <Modal.Body>
         <div className="flex-1 mb-2">
           <div className="ms-2 font-bold mb-2">Learning outcomes</div>
           <Textarea
             value={lessonsData[indexOfFirstLesson + index]['learning_outcomes']}
             style={{ height: '130px' }}
             onChange={(e) => handleLessonDataChange(indexOfFirstLesson + index, 'learning_outcomes', e.target.value)}
             placeholder="Enter the learning outcomes for the lesson"
           />
         </div>
         {['Remembering', 'Understanding', 'Applying', 'Analyzing', 'Evaluating', 'Creating'].map((level) => (
           <div key={level} className="mb-2 flex gap-5 justify-between">
             <Label>{level}</Label>
             <TextInput
               type="number"
               className="w-24"
               onChange={(e) => handletaxlevelChange(indexOfFirstLesson + index, 'taxonomy_levels', level, e.target.value)}
               value={lessonsData[indexOfFirstLesson + index]?.taxonomy_levels?.[level]}
             />
           </div>
         ))}
       </Modal.Body>
       <Modal.Footer className='flex justify-center '>
       
         <Button onClick={() => toggleModal(index)} color="primary" variant='contained' >
           Done
         </Button>
         
       </Modal.Footer>
     </Modal>
   </Card>
   

      


    ))}


    {/* Add Lesson and Allocate buttons */}
    <div className="">
    <div className=" mb-3  flex">
      
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          showIcons // If supported by the component
          className='mx-auto '
        />

     
      </div>
    
      <div className="flex ">
        <div  className="mt-3 mx-auto flex gap-5" >
        <Button
          color={'primary'}
          variant='contained'
          className="mt-3"
          onClick={() =>{
            addLesson({
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
              totalItems: 0,
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
          }
          }
        >
          <AddCircleOutlineIcon className="mr-2 " /> Add Lesson
        </Button>
      
        </div>
       
      </div>

     
    </div>
    {loading && <LoadingGenerate />}
    {errorFile && <ToastError message="Please upload a file for every lesson" setToast={setErrorFile}/>}
    

    {/* Pagination controls */}
    {/* {JSON.stringify(percent)} */}

  </Card>
  );
}

export default Learning_outcomes;
