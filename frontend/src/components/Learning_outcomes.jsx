import React, { useEffect, useState } from 'react';
import { Textarea, Button, TextInput,Card,Pagination,FileInput,Label } from 'flowbite-react';
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
  handleLessonDataChange,
  lessonsData,
  removeLesson,
  formData,
  setFormData,
  submit,
  allocations,
  setAllocations,files,setLessonsDatainitial
  
}) {
  // State to manage input data
 
 
  const [percent, setPercent] = useState([]);
  const [loading,setLoading] = useState(false)
  const [fileInfo,setFileInfo] = useState([])
  const [read,setRead] = useState(false)



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
  const updatedFileInfo = []; // Initialize an array to store file information
  setRead(true)

  for (let i = 0; i < files.length; i++) {
    if (!files[i]) {
      alert('Please select a file.');
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
    const newData = [...lessonsData];

    // Update the specific fields in the corresponding lesson object
    newData[index]['topic'] = data[0].lesson_topic;
    newData[index]['learning_outcomes'] = data[0].learning_outcomes;

    setLessonsDatainitial(newData);

    // Save the updated lessonsData to localStorage
    localStorage.setItem('lessonsData', JSON.stringify(newData));
    setRead(false)
  });
};





  return (
    <Card className="mb-5">


    {/* Render only the current page of lessons */}
    {currentLessons.map((item, index) => (
      <Card key={indexOfFirstLesson + index}>
       
        <div className="flex gap-5 mb-4">
          <div className='flex-1'>
          <div className="ms-2 font-bold mb-2">Lesson {indexOfFirstLesson + index + 1} summary</div>
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
          <Textarea
            value={lessonsData[indexOfFirstLesson + index]['learning_outcomes']}
            style={{ height: '100px' }}
            onChange={(e) =>
              handleLessonDataChange(indexOfFirstLesson + index, 'learning_outcomes', e.target.value)
            }
            placeholder="Enter the learning outcomes for the lesson"
          />
          </div>
         
          <div style={{ flex: 0.1 }}>
            
            <Button
              color={'failure'}
              onClick={() => removeLesson(lessonsData, indexOfFirstLesson + index)}
              className='mt-12'
            >
              <DeleteIcon/>
            </Button>
          </div>
        </div>
        <div className="mb-3">
    <div>
      <div className="mb-2 block">
        <Label htmlFor="file-upload" > Upload file for Lesson {index+1} <span className='text-red-600'>*</span></Label>
      </div>
      <FileInput id="file-upload"
       accept="application/pdf"
      sizing={'sm'}
       onChange={(e) => handleLessonDataChange(index, 'study_guide', e.target.files[0])}
      />
      {/* {lessonsDataInitial[indexRow] && lessonsDataInitial[indexRow]['study_guide'] && (
    <p>Selected file: {String(lessonsDataInitial[indexRow]['study_guide'])}</p>  // Display the selected file name
  )} */}
    </div>
    </div>
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
        <Button color={'primary'}  className="mt-3"  onClick={handleReadFile} isProcessing={read}>{read == true?'Reading files':'Read files'}</Button>
        </div>
       
      </div>

     
    </div>
    {loading && <LoadingGenerate />}

    {/* Pagination controls */}

  
  </Card>
  );
}

export default Learning_outcomes;
