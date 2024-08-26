import React, { useState,useEffect } from 'react';
import { Tooltip,Breadcrumb,Progress, Card, Textarea, Button, TextInput, Label,Radio,Modal } from "flowbite-react";
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import UpdateIcon from '@mui/icons-material/Update';
import PreviewIcon from '@mui/icons-material/Preview';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { HiOutlineExclamationCircle } from "react-icons/hi";
import api from "../api";

import ReactDOM from 'react-dom';
import { PDFViewer } from '@react-pdf/renderer';
import ExampdfUpdate from "./ExampdfUpdate";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';






function Examtest ({ items, lessonsData,handleStateChange,examStates,setExamStates,ExamTitle,handleExamTitleChange,handleRadioAnswer,TestPart,setTestPart,handleTestPartChange,exam_id,updateTOSinfo,handleSubmitExam}) {



  const [disableAdd,setDisableAdd] = useState(false)
  const [disableAddTestMcq,setDisableAddTestMcq] = useState(false)
  const [disableAddTestIdentification,setDisableAddTestIdentification] = useState(false)
  const [disableAddTestTrueorFalse,setDisableAddTestTrueorFalse] = useState(false)

  const [disableRemove,setDisableRemove] = useState(false)
  const [disableRemoveTest,setDisableRemoveTest] = useState(false)
  const [uniqueTestPartNums,setuniqueTestPartNums] = useState([])
  const [Test1,setTest1] = useState(0)
  const [Test2,setTest2] = useState(0)
  const [Test3,setTest3] = useState(0)
  const [PdfModal,setPdfModal] = useState(false)
  const [showPart,setShowPart] = useState(1)
  const [disableShowPart1,setDisableShowPart1] = useState('false')
  const [disableShowPart2,setDisableShowPart2] = useState('false')
  const [disableShowPart3,setDisableShowPart3] = useState('false')
  const [openModalDelete,setOpenModalDelete] = useState(false)

  


 


function checkAnswer(localStore, answer){
  if (localStore == answer)
  {
    return true
  }
}

  const categories = lessonsData.reduce((acc, cat,index) => {
    const start = stringToIntegerStart(String(cat.placement));
    const end = stringToIntegerEnd(String(cat.placement));
    const ind = index + 1

    let remembering = cat.remembering
    let understanding = cat.understanding 
    let applying = cat.applying
    let evaluating = cat.evaluating 
    let analyzing = cat.analyzing 
    let creating = cat.creating 

    for (let i = start; i <= end; i++) {
      if (remembering) {
        acc[i] = 'remembering'
        
                 
        
        remembering--;
      } else if (understanding) {
        acc[i] = 'understanding'
         

        understanding--;
      } else if (applying) {
        acc[i] =  'applying'
         

        applying--;
      } else if (analyzing) {
        acc[i] =  'analyzing'
         

        analyzing--;
      } else if (evaluating) {
        acc[i] =  'evaluating'
         

        evaluating--;
      } else if (creating) {
        acc[i] =  'creating'
         

        creating--;
      }
     
         
};
      
    
    return acc;
  }, {});






  console.log('categories: ',categories[1])

  function stringToIntegerStart(placement) {
    const parts = placement.split(" - ");
    return parseInt(parts[0], 10);
  }

  function stringToIntegerEnd(placement) {
    const parts = placement.split(" - ");
    return parseInt(parts[1], 10);
  }


  const getQuestionNumber = (item, examStates) => {
    const filteredQuestions = examStates.filter(q => q.test_part_num === item.test_part_num);
    return filteredQuestions.indexOf(item) + 1;
  };

  const mcq = (item, index,examStates) => {

    let catindex = 0

    if(item.test_part_num === 1){
      catindex = getQuestionNumber(item, examStates)
    }
    else if(item.test_part_num === 2){
      catindex = getQuestionNumber(item, examStates)+Test1
    }
    else{
     catindex = getQuestionNumber(item, examStates)+Test1+Test2
    }


    return (
        <Card key={index} className='m-5'>




          
        <div>
          <div className='flex gap-3'>
          <span className='mt-2'>
            {catindex}.
            
            
            </span>
 
            <Textarea
              value={item.question}
              onChange={(e) => handleStateChange(index, 'question', e.target.value)}
            />
          </div>

      <div className='mt-3'>
        <div className='flex flex-wrap gap-3 mx-auto'>
          <div>
            <div className='flex gap-3 w-80 mb-3'>
              <Radio
                name={`answers-${index}`}
                value="A"
                className='mt-3'
                onChange={(e) => handleRadioAnswer(index, e.target.value)}
                checked={checkAnswer(item.answer, "A")}
              />
              <span className='mt-2'>A.</span>
              <Textarea
                value={item.choices[0]}
                onChange={(e) => handleStateChange(index, 0, e.target.value)}
              />
            </div>
  
            <div className='flex gap-3 w-80 mb-3'>
              <Radio
                name={`answers-${index}`}
                value="B"
                className='mt-3'
                onChange={(e) => handleRadioAnswer(index, e.target.value)}
                checked={checkAnswer(item.answer, "B")}
              />
              <span className='mt-2'>B.</span>
              <Textarea
                value={item.choices[1]}
                onChange={(e) => handleStateChange(index, 1, e.target.value)}
              />
            </div>
          </div>
          <div>
            <div className='flex gap-3 w-80 mb-3'>
              <Radio
                name={`answers-${index}`}
                value="C"
                className='mt-3'
                onChange={(e) => handleRadioAnswer(index, e.target.value)}
                checked={checkAnswer(item.answer, "C")}
              />
              <span className='mt-2'>C.</span>
              <Textarea
                value={item.choices[2]}
                onChange={(e) => handleStateChange(index, 2, e.target.value)}
              />
            </div>
  
            <div className='flex gap-3 w-80 mb-3'>
              <Radio
                name={`answers-${index}`}
                value="D"
                className='mt-3'
                onChange={(e) => handleRadioAnswer(index, e.target.value)}
                checked={checkAnswer(item.answer, "D")}
              />
              <span className='mt-2'>D.</span>
              <Textarea
                value={item.choices[3]}
                onChange={(e) => handleStateChange(index, 3, e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className='flex gap-5 justify-center mt-3'>
      
      <Button color={'primary'} size={'sm'} >Generate {categories[catindex] ? categories[catindex] : ''} question</Button>
      <Tooltip content="Delete Question" style="dark">
      <Button color={'failure'} onClick={() =>{handleRemoveLastItemIndex(index)}} ><DeleteIcon/></Button>
      </Tooltip>
      </div>
        </div>
      </Card>
    );
  }
  

  const identification = (item, index,examStates) => {
    
    let catindex = 0

    if(item.test_part_num === 1){
      catindex = getQuestionNumber(item, examStates)
    }
    else if(item.test_part_num === 2){
      catindex = getQuestionNumber(item, examStates)+Test1
    }
    else{
     catindex = getQuestionNumber(item, examStates)+Test1+Test2
    }

    return (
        <Card key={index} className='m-5'>
        <div>
          <div className='flex gap-3'>
          <span className='mt-2'> {catindex}.</span>
            <Textarea
              value={item.question}
              onChange={(e) => handleStateChange(index, 'question', e.target.value)}
            />
          </div>
      <div className='mt-3'>
        <div className='flex flex-wrap gap-10 mx-auto'>
          <div>
            <div className='flex gap-3 w-80 mb-3'>

              <span className='mt-2'>Answer</span>
              <Textarea
                value={item.choices[0]}
                onChange={(e) => 
                {
                  handleStateChange(index, 0, e.target.value)
                  handleRadioAnswer(index, e.target.value)
                
                }}
              />
            </div>
  
          </div>
        </div>
      </div>
      <div className='flex gap-5 justify-center mt-3'>
      <Button color={'primary'}>Generate {categories[catindex] ? categories[catindex] : ''} question</Button>
      <Tooltip content="Delete Question" style="dark">
      <Button color={'failure'} onClick={() =>{handleRemoveLastItemIndex(index)}} ><DeleteIcon/></Button>
      </Tooltip>
      </div>
        </div>
      </Card>
    );
  }

  const trueOrFalse = (item, index,examStates) => {
    
    let catindex = 0

    if(item.test_part_num === 1){
      catindex = getQuestionNumber(item, examStates)
    }
    else if(item.test_part_num === 2){
      catindex = getQuestionNumber(item, examStates)+Test1
    }
    else{
     catindex = getQuestionNumber(item, examStates)+Test1+Test2
    }

    return (
        <Card key={index} className='m-5'>
        <div>
          <div className='flex gap-3'>
          <span className='mt-2'> {catindex}.</span>
            <Textarea
              value={item.question}
              onChange={(e) => handleStateChange(index, 'question', e.target.value)}
            />
          </div>
      <div className='mt-3'>
        <div className='flex flex-wrap gap-5 mx-auto'>
         
            <div className='flex gap-3 w-80 mb-3'>
              <Radio
                name={`answers-${index}`}
                value="True"
                className='mt-3'
                onChange={(e) => handleRadioAnswer(index, e.target.value)}
                checked={checkAnswer(item.answer, "True")}
              />
              <span className='mt-2'>True</span>
         
            </div>
            <div className='flex gap-3 w-80 mb-3'>
              <Radio
                name={`answers-${index}`}
                value="False"
                className='mt-3'
                onChange={(e) => handleRadioAnswer(index, e.target.value)}
                checked={checkAnswer(item.answer, "False")}
              />
              <span className='mt-2'>False</span>
         
            </div>
  
        
        </div>
      </div>
      <div className='flex gap-5 justify-center mt-3'>
      <Button color={'primary'}>Generate {categories[catindex] ? categories[catindex] : ''} question</Button>
      <div className="flex gap-2">
      <Tooltip content="Delete Question" style="dark">
      <Button color={'failure'} onClick={() =>{handleRemoveLastItemIndex(index)}} ><DeleteIcon/></Button>
      </Tooltip>
      </div>
      </div>
        </div>
      </Card>
    );
  }




  const examPart = (categories) => {


    const sortedTestParts = TestPart.sort((a, b) => a.test_part_num - b.test_part_num);


    return sortedTestParts.map((itemtest, index) => {

      let type = ''
      if(itemtest.test_type === 'mcq'){
        type = 'Multiple Choice Question'
      }
      else if(itemtest.test_type === 'identification'){
        type = 'Identification'
      }else{
        type = 'True or False'
      }

      return(
        <Card key={index} className={itemtest.test_part_num === showPart?'show relative':'hidden'} > {/* Make the Card a relative container */}
        {/* Delete Button at the Top Right Corner */}
     
        <Button
        
          size={'xs'}
          color={'failure'}
          onClick={() => { setOpenModalDelete(true); }} 
          className="absolute top-2 right-2" // Position the button absolutely
        >
             <Tooltip content="Delete Test" style="dark">
          <CloseIcon />
          </Tooltip>
        </Button>
      

        <div >
            <div className='mb-5 text-center'><p className='font-bold text-lg'>Test {index + 1}  : {type} </p></div> 
            <Textarea
            placeholder={` Test ${index + 1} : ${type} Instruction`}
              value={itemtest.test_instruction}
              onChange={(e) => handleTestPartChange(index, 'test_instruction', e.target.value)}
              style={{width:'97%',height:'40px'}}
              className='mx-auto'
            />
          </div>
        
        <div className='overflow-y-scroll' style={{ height: '400px', direction: 'rtl', overflow: 'auto' }}>
          <div style={{ direction: 'ltr' }}>
         
      
          {examStates.map((item, idx) => (
            <div key={idx}>
              {item.question_type === 'mcq' && itemtest.test_type === 'mcq' && mcq(item, idx, examStates)}
              {item.question_type === 'identification' && itemtest.test_type === 'identification' && identification(item, idx, examStates)}
              {item.question_type === 'trueOrFalse' && itemtest.test_type === 'trueOrFalse' && trueOrFalse(item, idx, examStates)}
            </div>
          ))}
      
          <div className='flex gap-5 mt-5 justify-center'>
            <Button 
              onClick={() => { handleAddItem(itemtest.test_type, itemtest.test_part_num, itemtest.exam_id, itemtest.id); }} 
              outline
              color={'success'}
              disabled={disableAdd}
            >
             <AddCircleOutlineIcon className='mr-2'/>  Add Item
            </Button>
          </div>
          </div>
        </div>
        <Modal show={openModalDelete} size="md" onClose={() => setOpenModalDelete(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this test?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure"  onClick={() => { handleRemoveLastItemTest(index);
                setOpenModalDelete(false);
                setShowPart(showPart===1?1:showPart-1)
               }} >
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setOpenModalDelete(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
        </Modal>
      </Card>
      )
  });
  };

  
  useEffect(() =>{
    if(examStates.length == items){
      setDisableAdd(true)
    
    } else{
      setDisableAdd(false)
    }

    if(examStates.length == 0){
      setDisableRemove(true)
    
    } else{
      setDisableRemove(false)
    }

    if(TestPart.length == 0){
        setDisableRemoveTest(true)
      
      } else{
        setDisableRemoveTest(false)
      }
      setuniqueTestPartNums(examStates.reduce((acc, item) => {
        acc[item.test_part_num] = (acc[item.test_part_num] || 0) + 1;
        return acc;
      }, {}));
    console.log(`Unique test_part_num values: ${uniqueTestPartNums}`);


      setTest1(examStates.filter(item => item.test_part_num === 1).length);
      setTest2(examStates.filter(item => item.test_part_num === 2).length);
      setTest3(examStates.filter(item => item.test_part_num === 3).length);


   
      disableBtn();
      disableBtnShowPart()

  },[examStates,items,TestPart])

  const disableBtn = () =>{
   // Count how many 'mcq' test types are in TestPart
const mcqCount = TestPart.filter(test => test.test_type === 'mcq').length;

// Count how many 'identification' test types are in TestPart
const identificationCount = TestPart.filter(test => test.test_type === 'identification').length;

// Count how many 'trueOrFalse' test types are in TestPart
const trueOrFalseCount = TestPart.filter(test => test.test_type === 'trueOrFalse').length;


// Set disable states based on counts
setDisableAddTestMcq(mcqCount > 0);
setDisableAddTestIdentification(identificationCount > 0);
setDisableAddTestTrueorFalse(trueOrFalseCount > 0);

 
  }

  const disableBtnShowPart = () =>{
    // Count how many 'mcq' test types are in TestPart
 const test1 = TestPart.filter(test => test.test_part_num === 1).length;
 
 // Count how many 'identification' test types are in TestPart
 const test2 = TestPart.filter(test => test.test_part_num === 2).length;
 
 // Count how many 'trueOrFalse' test types are in TestPart
 const test3 = TestPart.filter(test => test.test_part_num === 3).length;
 
 
 // Set disable states based on counts
 setDisableShowPart1(test1 <= 0);
 setDisableShowPart2(test2 <= 0);
 setDisableShowPart3(test3 <= 0);
 
  
   }



  const handleAddItem = (itemtype, test_part_num,exam_id,test_part_id) => {

    
    setExamStates([...examStates, 
      {
        question: '',
        choices: ['', '', '', ''],
        question_type: itemtype,
        answer: '',
        test_part_num: test_part_num,
        exam_id: exam_id,
        test_part_id : test_part_id
        
      }
    ]);


  };



  const handleAddTest = (itemtype,exam_id) => {
    setTestPart([...TestPart, 
      {
        test_type: itemtype,
        test_instruction: '',
        test_part_num: TestPart.length+1,
        exam_id:exam_id
      }
    ]);

    console.log("TestPart: ",TestPart)
  };



  const handleRemoveLastItemIndex = ( index) => {
    setExamStates((prevExamStates) => {
      // Validate the index to ensure it is within the array bounds
      if (index < 0 || index >= prevExamStates.length) {
        // If the index is out of bounds, return the array as is
        return prevExamStates;
      }

      console.log('deleteitem: ',prevExamStates[index].test_part_id)


      if(prevExamStates[index].question_id !== undefined){

     
    api
    .delete(`api/questions/delete/${prevExamStates[index].test_part_id}/${prevExamStates[index].question_id}/`)
    .then((res) => {
      if (res.status === 204) alert("Question deleted!");
      else alert("Failed to delete question.");
     
    })
    .catch((error) => alert(error));
  }
  
      // Update localStorage with the modified array
      const updatedStates = [
        ...prevExamStates.slice(0, index),
        ...prevExamStates.slice(index + 1),
      ];

  
      // Return the modified array, removing the item at the specified index
      return updatedStates;
    });
  };


  const handleRemoveLastItemTest = (index, test_type) => {
    setTestPart((prevTestPart) => {
      if (index < 0 || index >= prevTestPart.length) {
        return prevTestPart;
      }

      if(prevTestPart[index].id !== undefined){

   
      api
      .delete(`api/test-part/delete/${prevTestPart[index].exam_id}/${prevTestPart[index].id}/`)
      .then((res) => {
        if (res.status === 204) alert("part deleted!");
        else alert("Failed to delete part.");
       
      })
      .catch((error) => alert(error));
    }
  
      // Remove the item at the specified index and update the array
      const updatedTestPart = [
        ...prevTestPart.slice(0, index),
        ...prevTestPart.slice(index + 1),
      ];
  
      // Reassign test_part_num sequentially
      updatedTestPart.forEach((item, i) => {
        item.test_part_num = i + 1;
      });
  
     
      return updatedTestPart;
    });
  
    setExamStates((prevExamStates) => {
      if (index < 0 || index >= prevExamStates.length) {
        return prevExamStates;
      }
  
      // Remove the exam state that matches the test_part_num being deleted
      const deletedPartNum = index + 1; // because `index` starts at 0, but `test_part_num` starts at 1
      const filteredExamStates = prevExamStates.filter(
        (state) => state.test_part_num !== deletedPartNum
      );
  
      // Reassign test_part_num sequentially for remaining items
      const updatedExamStates = filteredExamStates.map((item, i) => ({
        ...item,
        test_part_num: i + 1, // reorder sequentially
      }));
  
    
  
      return updatedExamStates;
    });
  };
 
 
  


  return (
    <div >
      <Card>
        
      <Breadcrumb aria-label="Default breadcrumb example">
      <Breadcrumb.Item >
      Course Information
      </Breadcrumb.Item>
      <Breadcrumb.Item >
      Taxonomy Allocation
      </Breadcrumb.Item>
      <Breadcrumb.Item >
      Table of Specification
      </Breadcrumb.Item>
      <Breadcrumb.Item >
      Create Exam
      </Breadcrumb.Item>
      
    </Breadcrumb>
   
   {/* <Progress progress={100} size={'sm'} /> */}
       
       <div className='flex gap-5'>
       <div style={{flex:0.4}}>

       <div className=' w-full'>
        <Card  className='w-full'> 
      
      <Button color={'primary'} onClick={()=>{handleAddTest('mcq',exam_id)}} disabled={disableAddTestMcq}><PostAddIcon className="mr-2"/> Add Multiple Choice Test</Button>
      <Button color={'primary'} onClick={()=>{handleAddTest('identification',exam_id)}} disabled={disableAddTestIdentification}><PostAddIcon className="mr-2"/> Add Identification Test</Button>
      <Button color={'primary'} onClick={()=>{handleAddTest('trueOrFalse',exam_id)}} disabled={disableAddTestTrueorFalse}><PostAddIcon className="mr-2"/> Add True or False Test</Button>
     
   
      </Card>

      <Card  className='w-full mt-5'> 
      
      <Button  onClick={()=>{setShowPart(1)}} disabled={disableShowPart1}><VisibilityIcon className="mr-2"/> View Test 1</Button>
      <Button  onClick={()=>{setShowPart(2)}} disabled={disableShowPart2}><VisibilityIcon className="mr-2"/> View Test 2</Button>
      <Button  onClick={()=>{setShowPart(3)}} disabled={disableShowPart3}><VisibilityIcon className="mr-2"/> View Test 3</Button>
      <Button  color="blue" onClick={() => setPdfModal(true)}><PreviewIcon className="mr-2"/> Exam Preview</Button>
      <Button color={'success'} onClick={updateTOSinfo} ><UpdateIcon className='mr-2'/>Update Exam</Button>
      <Button  onClick={handleSubmitExam} color="success"><UpdateIcon className='mr-2'/>Submit Exam</Button>
    
    
   
      </Card>
   
      </div>
      
       </div>
   
   <div className='flex-1'>

        <div className='w-full'>
          <div className="mb-2 block">
            <Label htmlFor="title" value="Title" />
          </div>
          <TextInput id="title" type="text" value={ExamTitle}  onChange={handleExamTitleChange}/>
        </div>
       
        <br />
        
      
        {examPart(categories)}
  
        
        
        <Modal show={PdfModal} size={'7xl'}  onClose={() => setPdfModal(false)} className="h-screen">
        <Modal.Header>Table of Specification</Modal.Header>
        <Modal.Body  className="p-0">
          <div className="min-h-96 "  style={{height:'575px'}}>
          <PDFViewer className="h-full w-full">
    <ExampdfUpdate TestPart={TestPart} examStates={examStates} />
  </PDFViewer>
      
          </div>
        </Modal.Body>
      </Modal>

      </div>
      </div>
      </Card>

    </div>
  );
};



export default Examtest;
