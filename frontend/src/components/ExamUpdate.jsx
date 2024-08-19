import React, { useState,useEffect } from 'react';
import { Breadcrumb,Progress, Card, Textarea, Button, TextInput, Label,Radio,Modal } from "flowbite-react";
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import api from "../api";

import ReactDOM from 'react-dom';
import { PDFViewer } from '@react-pdf/renderer';
import ExampdfUpdate from "./ExampdfUpdate";

function Examtest ({ items, lessonsData,handleStateChange,examStates,setExamStates,ExamTitle,handleExamTitleChange,handleRadioAnswer,TestPart,setTestPart,handleTestPartChange,exam}) {



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
        <div className='flex flex-wrap gap-10 mx-auto'>
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
      <div className='flex gap-5'>
      <Button>Generate {categories[catindex] ? categories[catindex] : ''} question</Button>
      <Button color={'failure'} onClick={() =>{handleRemoveLastItemIndex('mcq',index)}} ><DeleteIcon/></Button>
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
      <div className='flex gap-5'>
      <Button>Generate {categories[catindex] ? categories[catindex] : ''} question</Button>
      <Button color={'failure'} onClick={() =>{handleRemoveLastItemIndex('mcq',index)}} ><DeleteIcon/></Button>
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
      <div className='flex gap-5'>
      <Button>Generate {categories[catindex] ? categories[catindex] : ''} question</Button>
      <Button color={'failure'} onClick={() =>{handleRemoveLastItemIndex('mcq',index)}} ><DeleteIcon/></Button>
      </div>
        </div>
      </Card>
    );
  }

  const examItems = (categories) => {
    return examStates.map((item, index) => (
      <Card key={index}>
        <div>
          <div className='flex gap-3'>
            <span className='mt-2'>{index + 1}.</span>
            <Textarea
              value={item.question}
              onChange={(e) => handleStateChange(index, 'question', e.target.value)}
            />
          </div>
  
          {item.question_type === 'mcq' && mcq(item, index)}
          {item.question_type === 'identification' && identification(item, index)}
          {item.question_type === 'trueOrFalse' && trueOrFalse(item, index)}
  
          <Button>Generate {categories[index + 1] ? categories[index + 1] : ''} question</Button>
        </div>
      </Card>
    ));
  };


  const examPart = (categories) => {





    return TestPart.map((itemtest, index) => {

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
      <Card key={index}>
        <div>
          <div className='flex gap-3'>
            <span className='mt-2'> {type}  Test {index + 1}: Instruction</span>
            <Textarea
              value={itemtest.test_instruction}
              onChange={(e) => handleTestPartChange(index, 'test_instruction', e.target.value)}
            />
          </div>

          {examStates.map((item, idx) => (
          <div key={idx}>
            {item.question_type === 'mcq' && itemtest.test_type === 'mcq' && mcq(item,idx, examStates)}
            {item.question_type === 'identification' && itemtest.test_type === 'identification' && identification(item,idx, examStates)}
            {item.question_type === 'trueOrFalse' && itemtest.test_type === 'trueOrFalse' && trueOrFalse(item, idx, examStates)}
          </div>
        ))}


  <div className='flex gap-5 mt-5 justify-center'>

        <Button onClick={()=>{handleAddItem(itemtest.test_type,itemtest.test_part_num,itemtest.exam_id,itemtest.id)}} disabled={disableAdd}> Add Item </Button>

        </div>
        </div>
        <Button color={'failure'} onClick={() =>{handleRemoveLastItemTest(index)}} ><DeleteIcon/></Button>
      </Card>)
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



  const handleAddTest = (itemtype) => {
    setTestPart([...TestPart, 
      {
        test_type: itemtype,
        test_instruction: '',
        test_part_num: TestPart.length+1,
      }
    ]);

    console.log("TestPart: ",TestPart)
  };



  const handleRemoveLastItemIndex = (question_type, index) => {
    setExamStates((prevExamStates) => {
      // Validate the index to ensure it is within the array bounds
      if (index < 0 || index >= prevExamStates.length) {
        // If the index is out of bounds, return the array as is
        return prevExamStates;
      }

      console.log('deleteitem: ',prevExamStates[index].test_part_id)


      
    api
    .delete(`api/questions/delete/${prevExamStates[index].test_part_id}/${prevExamStates[index].question_id}/`)
    .then((res) => {
      if (res.status === 204) alert("Question deleted!");
      else alert("Failed to delete question.");
     
    })
    .catch((error) => alert(error));
  
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
   
   <Progress progress={100} size={'sm'} />
       
   

        <div className='w-full'>
          <div className="mb-2 block">
            <Label htmlFor="title" value="Title" />
          </div>
          <TextInput id="title" type="text" value={ExamTitle}  onChange={handleExamTitleChange}/>
        </div>
       
        <br />
        
      
        {examPart(categories)}
  
        
        <div className='flex gap-5'>
      
        <Button onClick={()=>{handleAddTest('mcq')}} disabled={disableAddTestMcq}>Add Multiple Choice Test</Button>
        <Button onClick={()=>{handleAddTest('identification')}} disabled={disableAddTestIdentification}>Add Identification Test</Button>
        <Button onClick={()=>{handleAddTest('trueOrFalse')}} disabled={disableAddTestTrueorFalse}>Add True or False Test</Button>
     

     
        </div>
        <Button color="blue" onClick={() => setPdfModal(true)}><VisibilityIcon className="mr-2"/>Preview</Button>
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
   
      </Card>
    </div>
  );
};



export default Examtest;
