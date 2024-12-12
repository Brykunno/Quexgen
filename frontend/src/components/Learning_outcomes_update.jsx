import React, { useEffect, useState } from 'react';
import {Button} from "@mui/material";
import { Textarea, TextInput,Card,Pagination,FileInput,Label,Spinner,Modal } from 'flowbite-react';
import api from '../api';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LoadingGenerate from './LoadingGenerate';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import VisibilityIcon from '@mui/icons-material/Visibility';

function Learning_outcomes_update({
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
  lessonsDataInitial,
  handleLessonDataChange,
  lessonsData,
  removeLesson,
  formData,
  setFormData,
  submit,
  allocations,
  setAllocations,
  Understanding,
  Applying,
  Analyzing,
  Evaluating,
  Creating,
  handletaxlevelChange,
  setTosModal,totalItems,handleTotalItemsChange,handleInnerLessonDataChange
  
}) {
  // State to manage input data
 
 
  const [percent, setPercent] = useState([]);
  const [loading,setLoading] = useState(false)
  const [openModals, setOpenModals] = useState([]);



const [tax_alloc, setTax] = useState([]);

  
 // Calculate the percentage of allocations
 const calculatePercentages = (allocations) => {
  const total = Object.values(allocations).reduce((sum, value) => sum + value, 0);
  const percentages = {};

  for (const key in allocations) {
    percentages[key] = total > 0 ? Math.round((allocations[key] / total) * 100) : 0;
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

const toggleModal = (index) => {
  setOpenModals((prev) => {
    const updatedModals = [...prev];
    updatedModals[index] = !updatedModals[index]; // Toggle the specific modal at index
    return updatedModals;
  });
};


  return (
    <Card className="mb-5">
       <div className="max-w-md flex gap-5 mx-auto">
      <div className="mt-3" >
          <Label htmlFor="totalItems" className="font-bold" > Total of Items<span className="text-red-600">*</span></Label> 
        </div>  
        <TextInput id="totalItems" type="number" required value={totalItems} onChange={handleTotalItemsChange} />
      </div>
    {/* Render only the current page of lessons */}
    {currentLessons.map((item, index) => (
      <Card key={indexOfFirstLesson + index} className="relative">

<div className="absolute top-2 right-2">
       <Button
        
         size={'xs'}
         color={'error'}
      
        
       >
        <ClearIcon  className=" hover:scale-110 transition-transform duration-200"  onClick={() => {removeLesson(lessonsData, indexOfFirstLesson + index); removeFile(indexOfFirstLesson + index)}} />

       </Button>
     </div>

     
     {/* <div className="mb-3">
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
             
           />
           <div>
             
           </div>
         </div>
       </div>
     </div> */}
   
        <div className="flex gap-5 mb-4">
          <div className='flex-1'>
          <div className="ms-2 font-bold mb-2">Lesson {indexOfFirstLesson + index + 1}</div>
          <Textarea
            value={lessonsData[indexOfFirstLesson + index]['topic']}
            style={{ height: '100px' }}
            onChange={(e) =>
              handleLessonDataChange(indexOfFirstLesson + index, 'topic', e.target.value)
            }
            placeholder="Enter the summary of the lesson"
          />
          </div>
          <div className='flex-1'>
          <div className="ms-2 font-bold mb-2">Learning outcomes</div>
          {lessonsData[indexOfFirstLesson + index]['learning_outcomes'].map((line, lineIndex) => (
    <div key={lineIndex} style={{ marginBottom: '20px' }}>
      <Textarea
        key={lineIndex}
        value={line}
        onChange={(e)=>handleInnerLessonDataChange(indexOfFirstLesson + index,lineIndex,'learning_outcomes',e.target.value)}
        style={{ height: '100px', width: '300px', marginBottom: '10px' }}
        placeholder={`Enter value for line ${lineIndex}`}
      />
    </div>
  ))}
          </div>

          <div className="flex-1">
         <div className="ms-2 font-bold mb-2">Number of teaching hours</div>


         {lessonsData[indexOfFirstLesson + index]['teachingHours']
  .map((line, lineIndex) => (
    <div key={lineIndex} style={{ marginBottom: '20px' }}>
      <TextInput
        key={lineIndex}
        name={`teachingHours-${indexOfFirstLesson + index}-${lineIndex}`}
        onChange={(e)=>handleInnerLessonDataChange(indexOfFirstLesson + index,lineIndex,'teachingHours',Number(e.target.value))}
        value={line}
        type='number'
        style={{ height: '100px', width: '300px', marginBottom: '10px' }}
        placeholder={`Enter value for line ${lineIndex}`}
      />
      
    </div>
  ))}

       </div>
          <div style={{ flex: 0.1 }}>
            
            {/* <Button
              color={'failure'}
              onClick={() => removeLesson(lessonsData, indexOfFirstLesson + index)}
              className='mt-12'
            >
              <DeleteIcon/>
            </Button> */}
          </div>
        </div>
        {/* <div className='flex justify-center'>
       <Button
         color="primary"
         variant='contained'

         disabled={item.file_status === ""}
         onClick={() => toggleModal(indexOfFirstLesson + index)}
       
       >
         Identify levels of taxonomy
       </Button>
     </div> */}

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
    
      <div className="flex justify-center gap-5">
        {/* <Button
          color={'primary'}
          variant='contained'
          className="mt-3 mx-auto"
          onClick={() =>
            addLesson({
              topic: '',
              learning_outcomes: [],
              teachingHours: [],
              allocation: [],
              items: [],
              remembering: [],
              understanding: [],
              applying: [],
              analyzing: [],
              evaluating: [],
              creating: [],
              total: [],
              placement: [],
              totalItems: 0,
            })
          }
        >
          <AddCircleOutlineIcon className="mr-2 " /> Add Lesson
        </Button> */}
        <Button color="primary" variant='contained' onClick={() => setTosModal(true)}><VisibilityIcon className="mr-2"/>Preview TOS</Button>
       
      </div>

     
    </div>
    {loading && <LoadingGenerate />}

    {/* Pagination controls */}
  
  </Card>
  );
}

export default Learning_outcomes_update;
