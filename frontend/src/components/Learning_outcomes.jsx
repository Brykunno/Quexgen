import React, { useEffect, useState } from 'react';
import { Textarea, Button, TextInput,Card,Pagination } from 'flowbite-react';
import api from '../api';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LoadingGenerate from './LoadingGenerate';
import DeleteIcon from '@mui/icons-material/Delete';


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
  lessonsDataInitial,
  handleLessonDataChange,
  lessonsData,
  removeLesson
}) {
  // State to manage input data
 
  const [allocations, setAllocations] = useState([]);
  const [percent, setPercent] = useState([]);
  const [loading,setLoading] = useState(false)



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

  // Handle the form submission
  const handleSubmit = async () => {
    try {
      const promises = lessonsData.map(async (l) => {
        const response = await api.post('/api/taxonomy-allocation/', {
          objectives: l.learning_outcomes,
        });
        return response.data.allocation; // Return the allocation data
      });

      const allocationsArray = await Promise.all(promises);
      console.log('Processed responses:', allocationsArray);

      // Flatten the array if you have nested arrays in allocations
      setAllocations((previous) => [...previous, ...allocationsArray.flat()]);

     
    
     
    
    } catch (error) {
      console.error('Error processing the file and data:', error);
    }


    setLoading(false)
  };

  const submit = () =>{

    setLoading(true)
    setAllocations([]);
    handleSubmit();

   
  }
    

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



  return (
    <Card className="mb-5">
    {/* Render only the current page of lessons */}
    {currentLessons.map((item, index) => (
      <div key={indexOfFirstLesson + index}>
        <div className="ms-2 font-bold">Lesson {indexOfFirstLesson + index + 1}</div>
        <div className="flex gap-5 mb-4">
          <Textarea
            value={lessonsData[indexOfFirstLesson + index]['topic']}
            style={{ height: '100px' }}
            onChange={(e) =>
              handleLessonDataChange(indexOfFirstLesson + index, 'topic', e.target.value)
            }
            placeholder="Enter the summary of the lesson"
          />
          <Textarea
            value={lessonsData[indexOfFirstLesson + index]['learning_outcomes']}
            style={{ height: '100px' }}
            onChange={(e) =>
              handleLessonDataChange(indexOfFirstLesson + index, 'learning_outcomes', e.target.value)
            }
            placeholder="Enter the learning outcomes for the lesson"
          />
          <div style={{ flex: 0.5 }}>
            <Button
              color={'failure'}
              onClick={() => removeLesson(lessonsData, indexOfFirstLesson + index)}
            >
              <DeleteIcon/>
            </Button>
          </div>
        </div>
      </div>
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
    
      <div className="flex gap-5 max-w-72 mx-auto ">
        <Button
          color={'primary'}
          className="mt-3"
          onClick={() =>
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
            })
          }
        >
          <AddCircleOutlineIcon className="mr-2 " /> Add Lesson
        </Button>
        <Button color={'primary'} className="mt-3" onClick={submit}>
          Allocate
        </Button>
      </div>

     
    </div>
    {loading && <LoadingGenerate />}

    {/* Pagination controls */}
  
  </Card>
  );
}

export default Learning_outcomes;
