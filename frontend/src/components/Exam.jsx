import React, { useState,useEffect } from 'react';
import { Progress, Card, Textarea, Button, TextInput, Label,Radio } from "flowbite-react";

function Exam ({ items, tos_id, lessonsData,handleStateChange,examStates,ExamTitle,handleExamTitleChange,Instruction,handleInstructionChange,handleRadioAnswer }) {


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

 
  const examItems = (categories) => {
    return examStates.map((item, index) => (
      <div key={index}>
        <div>
          <div className='flex gap-3'>
            <span className='mt-2'>
              {index + 1}.
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
                <Radio   name={`answers-${index}`} value="A" className='mt-3' onChange={(e) => handleRadioAnswer(index, e.target.value) }
                
                checked={checkAnswer(item.answer,"A")}
                />
                  <span className='mt-2'>A.</span>
                  <Textarea
                    value={item.choices[0]}
                    onChange={(e) => handleStateChange(index, 0, e.target.value)}
                  />
                </div>

                <div className='flex gap-3 w-80 mb-3'>
                <Radio  name={`answers-${index}`} value="B" className='mt-3' onChange={(e) => handleRadioAnswer(index, e.target.value)} checked={checkAnswer(item.answer,"B")}/>
                  <span className='mt-2'>B.</span>
                  <Textarea
                    value={item.choices[1]}
                    onChange={(e) => handleStateChange(index, 1, e.target.value)}
                  />
                </div>
              </div>
              <div>
                <div className='flex gap-3 w-80 mb-3'>
                <Radio  name={`answers-${index}`} value="C" className='mt-3' onChange={(e) => handleRadioAnswer(index, e.target.value)} checked={checkAnswer(item.answer,"C")}/>
                  <span className='mt-2'>C.</span>
                  <Textarea
                    value={item.choices[2]}
                    onChange={(e) => handleStateChange(index, 2, e.target.value)}
                  />
                </div>

                <div className='flex gap-3 w-80 mb-3'>
                <Radio  name={`answers-${index}`} value="D" className='mt-3' onChange={(e) => handleRadioAnswer(index, e.target.value)} checked={checkAnswer(item.answer,"D")}/>
                  <span className='mt-2'>D.</span>
                  <Textarea
                    value={item.choices[3]}
                    onChange={(e) => handleStateChange(index, 3, e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <Button>Generate {String(categories[index+1])} question</Button>
        </div>
      </div>
    ));
  };



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
        
        {examItems(categories)}
      </Card>
    </div>
  );
};

export default Exam;
