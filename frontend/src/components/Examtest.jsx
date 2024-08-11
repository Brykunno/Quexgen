import React, { useState,useEffect } from 'react';
import { Progress, Card, Textarea, Button, TextInput, Label,Radio,Modal } from "flowbite-react";


function Examtest ({ items, tos_id, lessonsData,handleStateChange,examStates,setExamStates,ExamTitle,handleExamTitleChange,Instruction,handleInstructionChange,handleRadioAnswer,TestPart,setTestPart,handleTestPartChange }) {



  const [disableAdd,setDisableAdd] = useState(false)
  const [disableRemove,setDisableRemove] = useState(false)
  const [disableRemoveTest,setDisableRemoveTest] = useState(false)
  const [uniqueTestPartNums,setuniqueTestPartNums] = useState([])
  const [Test1,setTest1] = useState(0)
  const [Test2,setTest2] = useState(0)
  const [Test3,setTest3] = useState(0)
 


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

  const mcq = (item, index) => {
    return (
        <Card key={index} className='m-5'>
        <div>
          <div className='flex gap-3'>
          <span className='mt-2'>
            {item.test_part_num === 1 && getQuestionNumber(item, examStates)}
            {item.test_part_num === 2 && getQuestionNumber(item, examStates)+Test1}
            {item.test_part_num === 3 && getQuestionNumber(item, examStates)+Test1+Test2}.
            
            
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
      <Button>Generate {categories[index + 1] ? categories[index + 1] : ''} question</Button>
        </div>
      </Card>
    );
  }
  

  const identification = (item, index) => {
    return (
        <Card key={index} className='m-5'>
        <div>
          <div className='flex gap-3'>
          <span className='mt-2'> {item.test_part_num === 1 && getQuestionNumber(item, examStates)}
            {item.test_part_num === 2 && getQuestionNumber(item, examStates)+Test1}
            {item.test_part_num === 3 && getQuestionNumber(item, examStates)+Test1+Test2}.</span>
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
      <Button>Generate {categories[index + 1] ? categories[index + 1] : ''} question</Button>
        </div>
      </Card>
    );
  }

  const trueOrFalse = (item, index) => {
    return (
        <Card key={index} className='m-5'>
        <div>
          <div className='flex gap-3'>
          <span className='mt-2'> {item.test_part_num === 1 && getQuestionNumber(item, examStates)}
            {item.test_part_num === 2 && getQuestionNumber(item, examStates)+Test1}
            {item.test_part_num === 3 && getQuestionNumber(item, examStates)+Test1+Test2}.</span>
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
      <Button>Generate {categories[index + 1] ? categories[index + 1] : ''} question</Button>
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





    return TestPart.map((itemtest, index) => (
      <Card key={index}>
        <div>
          <div className='flex gap-3'>
            <span className='mt-2'>Test {index + 1}: Instruction</span>
            <Textarea
              value={itemtest.test_instruction}
              onChange={(e) => handleTestPartChange(index, 'test_instruction', e.target.value)}
            />
          </div>

          {examStates.map((item, idx) => (
          <div key={idx}>
            {item.question_type === 'mcq' && itemtest.test_type === 'mcq' && mcq(item, examStates)}
            {item.question_type === 'identification' && itemtest.test_type === 'identification' && identification(item, examStates)}
            {item.question_type === 'trueOrFalse' && itemtest.test_type === 'trueOrFalse' && trueOrFalse(item, examStates)}
          </div>
        ))}


  <div className='flex gap-5 mt-5 justify-center'>

        <Button onClick={()=>{handleAddItem(itemtest.test_type,itemtest.test_part_num)}} disabled={disableAdd}> Add Item </Button>
        <Button onClick={() => {handleRemoveLastItem(itemtest.test_type)}} disabled={disableRemove}>Remove Item</Button>
        </div>
        </div>
      </Card>
    ));
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

  


  },[examStates,items])

  const handleAddItem = (itemtype, test_part_num) => {
    
    setExamStates([...examStates, 
      {
        question: '',
        choices: ['', '', '', ''],
        question_type: itemtype,
        answer: '',
        test_part_num: test_part_num
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

  const handleRemoveLastItem = (question_type) => {
    setExamStates((prevExamStates) => {
      // Find the index of the last item with the given question_type
      const lastIndex = prevExamStates.slice().reverse().findIndex(item => item.question_type === question_type);
  
      if (lastIndex === -1) {
        // If no item with the given question_type is found, return the array as is
        return prevExamStates;
      }
  
      // Calculate the actual index from the original array
      const indexToRemove = prevExamStates.length - 1 - lastIndex;
  
      // Remove the item at the calculated index
      return [...prevExamStates.slice(0, indexToRemove), ...prevExamStates.slice(indexToRemove + 1)];
    });
  };

  const handleRemoveLastTest = () => {
    setTestPart(examStates.slice(0, -1));
  };

  const [openModal, setOpenModal] = useState(false);
  return (
    <div className='mt-3'>
      <Card>
        <h1 className='text-3xl'>Exam</h1>
        <hr />
        <br />
        <div className='w-full'>
          <div className="mb-2 block">
            <Label htmlFor="title" value="Title" />
          </div>
          <TextInput id="title" type="text" value={ExamTitle}  onChange={handleExamTitleChange}/>
        </div>
        <div className='w-full'>
          <div className="mb-2 block">
            <Label htmlFor="instructions" value="Instruction" />
          </div>
          <Textarea id="instructions" type="text" value={Instruction} onChange={handleInstructionChange}/>
        </div>
        <br />
        
      
        {examPart(categories)}
        {String(TestPart)}
        
        <div className='flex gap-5'>
      
        <Button onClick={()=>{handleAddTest('mcq')}} disabled={disableAdd}>Add Multiple Choice Test</Button>
        <Button onClick={()=>{handleAddTest('identification')}} disabled={disableAdd}>Add Identification Test</Button>
        <Button onClick={()=>{handleAddTest('trueOrFalse')}} disabled={disableAdd}>Add True or False Test</Button>
        <Button onClick={handleRemoveLastTest} disabled={disableRemoveTest}>Remove Test</Button>


        {Test1}
        {Test2}
        {Test3}
        </div>
      </Card>
    </div>
  );
};

export default Examtest;
