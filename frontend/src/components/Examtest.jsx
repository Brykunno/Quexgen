import React, { useState,useEffect } from 'react';
import { Tooltip,Breadcrumb,Progress, Card, Textarea, Button, TextInput, Label,Radio,Modal } from "flowbite-react";
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import UpdateIcon from '@mui/icons-material/Update';
import PreviewIcon from '@mui/icons-material/Preview';
import PostAddIcon from '@mui/icons-material/PostAdd';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SendIcon from '@mui/icons-material/Send';
import api from "../api";
import ReactDOM from 'react-dom';
import { PDFViewer } from '@react-pdf/renderer';
import Exampdf from "./Exampdf";
import Multiple_exam from './Multiple_exam';



function Examtest ({ files,items, tos_id, lessonsData,handleStateChange,examStates,setExamStates,ExamTitle,handleExamTitleChange,handleRadioAnswer,TestPart,setTestPart,handleTestPartChange,setSubmit,setLoading,context,setContext,formData}) {



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

  const [modalGenMcq, setModalGenMcq] = useState({});
  const [modalGenIden, setModalGenIden] = useState({});
  const [modalGenTorF, setModalGenTorF] = useState({});

  const [test, setTest] = useState({
    mcq: 0,
    identification: 0,
    trueOrFalse: 0,
  });
  


  const handleTest = (type, value) => {
    
    setTest((prevTest) => ({
      ...prevTest,
      [type]: value, 
    }));
  };

  const [data, setData] = useState(null);
  const handleContextChange = (value, index, taxonomy_level,test_type) => {
    setContext(prev => {
      // Check if the context for the given index already exists
      const existingIndex = prev.findIndex(item => item.index === index);
  
      if (existingIndex !== -1) {
        // If it exists, update the existing context object
        const updatedContext = [...prev];
        updatedContext[existingIndex] = {
          ...updatedContext[existingIndex],
          context: value,
          taxonomy_level: taxonomy_level,
          test_type:test_type
        };
        return updatedContext;
      } else {
        // If it doesn't exist, add a new context object
        return [
          ...prev,
          {
            context: value,
            index: index,
            taxonomy_level: taxonomy_level,
            test_type:test_type
          }
        ];
      }
    });
  };
    const generateQues = (index,test_type) =>{

      

      setLoading(true)
      api.post('/api/generate-question/', {
        context: getContextValue(index),
        index: index,
        taxonomy_level: getTaxonomyValue(index),
        test_type:test_type
      }
    )
    .then(response => {
      setData(response.data)
      setLoading(false)
      handleStateChange(response.data.index,'question',response.data.question)
      handleRadioAnswer(response.data.index,response.data.answer)
      for(let i = 0; i<response.data.choices.length;i++){
        handleStateChange(response.data.index,i,response.data.choices[i])
      }
        console.log('Response data:', response.data.choices[0]);
    })
    .catch(error => {
        console.error('There was an error!', error);
    });
    }

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
        acc[i] = 'Remembering'
        
                 
        
        remembering--;
      } else if (understanding) {
        acc[i] = 'Understanding'
         

        understanding--;
      } else if (applying) {
        acc[i] =  'Applying'
         

        applying--;
      } else if (analyzing) {
        acc[i] =  'Analyzing'
         

        analyzing--;
      } else if (evaluating) {
        acc[i] =  'Evaluating'
         

        evaluating--;
      } else if (creating) {
        acc[i] =  'Creating'
         

        creating--;
      }
     
         
};
      
    
    return acc;
  }, {});

  const getContextValue = (index) => {
    const contextItem = context.find(item => item.index === index);
    return contextItem ? contextItem.context : ''; // Return the context value or an empty string if not found
  };

 

  const getTaxonomyValue = (index) => {
    const contextItem = context.find(item => item.index === index);
    return contextItem ? contextItem.taxonomy_level : ''; // Return the context value or an empty string if not found
  };


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
    
    <Button color={'primary'} onClick={() => setModalGenMcq(prev => ({ ...prev, [index]: true }))} size={'sm'} >Generate {categories[catindex] ? categories[catindex] : ''} question</Button>

<Modal key={index} size={'4xl'} show={modalGenMcq[index]} onClose={() => setModalGenMcq(prev => ({ ...prev, [index]: false }))}>
        <Modal.Header>Generate {categories[catindex] ? categories[catindex] : ''} question</Modal.Header>
        <Modal.Body>
          <div className="  gap-3">
            <div className='mb-4'>
              Context:
              <Textarea style={{height:'150px'}} value={getContextValue(index)}  
            onChange={(e)=>{handleContextChange(e.target.value,index,categories[catindex],"mcq");
              handleStateChange(index, 'context', e.target.value)
            }
            } />
            </div>
            <div className=''>
            <Card>

          
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
            </Card>
            </div>

          
            
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color={'primary'} onClick={()=>{generateQues(index,"mcq")}} className='mx-auto'>Generate</Button>
        
        </Modal.Footer>
      </Modal>




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

              <span className='mt-2 font-bold'>Answer:</span>
              <Textarea
                value={item.choices[0]}
                onChange={(e) => 
                {
                  handleStateChange(index, 0, e.target.value)
                  handleRadioAnswer(index, e.target.value)
                
                }}
                className='h-10'
              />
            </div>
  
          </div>
        </div>
      </div>
      <div className='flex gap-5 justify-center mt-3'>
      
      
      <Button color={'primary'} onClick={() => setModalGenIden(prev => ({ ...prev, [index]: true }))} size={'sm'} >Generate {categories[catindex] ? categories[catindex] : ''} question</Button>

<Modal key={index} size={'4xl'} show={modalGenIden[index]} onClose={() => setModalGenIden(prev => ({ ...prev, [index]: false }))}>
       <Modal.Header>Generate {categories[catindex] ? categories[catindex] : ''} question</Modal.Header>
       <Modal.Body>
         <div className="  gap-3">
           <div className='mb-4'>
             Context:
             <Textarea style={{height:'150px'}} value={getContextValue(index)}  
            onChange={(e)=>{handleContextChange(e.target.value,index,categories[catindex],"identification");
              handleStateChange(index, 'context', e.target.value)
            }
            } />
           </div>
           <div className=''>
           <Card>

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

              <span className='mt-2 font-bold'>Answer:</span>
              <Textarea
                value={item.choices[0]}
                onChange={(e) => 
                {
                  handleStateChange(index, 0, e.target.value)
                  handleRadioAnswer(index, e.target.value)
                
                }}
                className='h-10'
              />
            </div>
  
          </div>
        </div>
      </div>
         

       
           </Card>
           </div>

         
           
         </div>
       </Modal.Body>
       <Modal.Footer>
         <Button color={'primary'} onClick={()=>{generateQues(index,"identification")}} className='mx-auto'>Generate</Button>
       
       </Modal.Footer>
     </Modal>



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
      
      <Button color={'primary'} onClick={() => setModalGenTorF(prev => ({ ...prev, [index]: true }))} size={'sm'} >Generate {categories[catindex] ? categories[catindex] : ''} question</Button>

            <Modal key={index} size={'4xl'} show={modalGenTorF[index]} onClose={() => setModalGenTorF(prev => ({ ...prev, [index]: false }))}>
       <Modal.Header>Generate {categories[catindex] ? categories[catindex] : ''} question</Modal.Header>
       <Modal.Body>
         <div className="  gap-3">
           <div className='mb-4'>
             Context:
             <Textarea style={{height:'150px'}} value={getContextValue(index)}  
            onChange={(e)=>{handleContextChange(e.target.value,index,categories[catindex],"trueOrFalse");
              handleStateChange(index, 'context', e.target.value)
            }
            } />
           </div>
           <div className=''>
           <Card>

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
         

       
           </Card>
           </div>

         
           
         </div>
       </Modal.Body>
       <Modal.Footer>
         <Button color={'primary'} onClick={()=>{generateQues(index,"trueOrFalse")}} className='mx-auto'>Generate</Button>
       
       </Modal.Footer>
     </Modal>
      <Tooltip content="Delete Question" style="dark">
      <Button color={'failure'} onClick={() =>{handleRemoveLastItemIndex(index)}} ><DeleteIcon/></Button>
      </Tooltip>
      </div>
        </div>
      </Card>
    );
  }


  const essay = (item, index,examStates) => {
    
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
      
      <Button color={'primary'} onClick={() => setModalGenTorF(prev => ({ ...prev, [index]: true }))} size={'sm'} >Generate {categories[catindex] ? categories[catindex] : ''} question</Button>

            <Modal key={index} size={'4xl'} show={modalGenTorF[index]} onClose={() => setModalGenTorF(prev => ({ ...prev, [index]: false }))}>
       <Modal.Header>Generate {categories[catindex] ? categories[catindex] : ''} question</Modal.Header>
       <Modal.Body>
         <div className="  gap-3">
           <div className='mb-4'>
             Context:
             <Textarea style={{height:'150px'}} value={getContextValue(index)}  
            onChange={(e)=>{handleContextChange(e.target.value,index,categories[catindex],"trueOrFalse");
              handleStateChange(index, 'context', e.target.value)
            }
            } />
           </div>
           <div className=''>
           <Card>

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
         

       
           </Card>
           </div>

         
           
         </div>
       </Modal.Body>
       <Modal.Footer>
         <Button color={'primary'} onClick={()=>{generateQues(index,"trueOrFalse")}} className='mx-auto'>Generate</Button>
       
       </Modal.Footer>
     </Modal>
      <Tooltip content="Delete Question" style="dark">
      <Button color={'failure'} onClick={() =>{handleRemoveLastItemIndex(index)}} ><DeleteIcon/></Button>
      </Tooltip>
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
        <Card key={index} className={itemtest.test_part_num === showPart?'show relative mb-5':'show relative mb-5'} > {/* Make the Card a relative container */}
        {/* Delete Button at the Top Right Corner */}
        <Button
        
          size={'xs'}
          color={'failure'}
          onClick={() => { handleRemoveLastItemTest(index); }} 
          className="absolute top-2 right-2" // Position the button absolutely
        >
          <CloseIcon />
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
        
        <div className=' py-5' style={{ height: 'auto', direction: 'rtl',  }}>
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
            
            color={'primary'}
              onClick={() => { handleAddItem(itemtest.test_type, itemtest.test_part_num, itemtest.exam_id, itemtest.id); }} 
              disabled={disableAdd}
            >
            <AddCircleOutlineIcon className='mr-2'/>  Add Item
            </Button>
          </div>
          </div>
        </div>
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

      disableBtn();
      disableBtnShowPart();

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



  const handleRemoveLastItemIndex = (index) => {
    setExamStates((prevExamStates) => {
      // Validate the index to ensure it is within the array bounds
      if (index < 0 || index >= prevExamStates.length) {
        // If the index is out of bounds, return the array as is
        return prevExamStates;
      }
  
      // Update localStorage with the modified array
      const updatedStates = [
        ...prevExamStates.slice(0, index),
        ...prevExamStates.slice(index + 1),
      ];
      localStorage.setItem('questionData', JSON.stringify(updatedStates));
  
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
  
      localStorage.setItem('testpartData', JSON.stringify(updatedTestPart));
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
  
      localStorage.setItem('questionData', JSON.stringify(updatedExamStates));
  
      return updatedExamStates;
    });
  };

  let arr = [2,2]
  
  const handleFileProcessing = async () => {

    
    const newTestParts = [];
  
    const existingTestTypes = TestPart.map(part => part.test_type); // Get the list of existing test types
  
    // Check if ExaminationType contains 'Multiple Choice' and if it hasn't been added already
    if (formData.ExaminationType.includes('Multiple Choice') && !existingTestTypes.includes('mcq')) {
      newTestParts.push({
        test_type: 'mcq',
        test_instruction: '',
        test_part_num: TestPart.length + newTestParts.length + 1,
      });
    }
  
    // Check if ExaminationType contains 'Identification' and if it hasn't been added already
    if (formData.ExaminationType.includes('Identification') && !existingTestTypes.includes('identification')) {
      newTestParts.push({
        test_type: 'identification',
        test_instruction: '',
        test_part_num: TestPart.length + newTestParts.length + 1,
      });
    }
  
    // Check if ExaminationType contains 'True or False' and if it hasn't been added already
    if (formData.ExaminationType.includes('True or False') && !existingTestTypes.includes('trueOrFalse')) {
      newTestParts.push({
        test_type: 'trueOrFalse',
        test_instruction: '',
        test_part_num: TestPart.length + newTestParts.length + 1,
      });
    }
  
    // If there are new test parts to add, update the state
    if (newTestParts.length > 0) {
      setTestPart((prevTestPart) => [...prevTestPart, ...newTestParts]);
    }
    if (files.length === 0) return alert('Please select a file.');
    let num = 0;
    let mcq= test.mcq
    let identification= test.identification
    let trueOrFalse= test.trueOrFalse
  
    for (const file of files) {
      if (!file) return alert('Please select a file.');
  
      const formData = new FormData();
      formData.append('file', file); // Append the selected file
  
      // Add other JSON data to the FormData
      formData.append('index', 0);
      
      formData.append('context', 'Your context');
      formData.append('taxonomy_level', 'Remembering');

     
        formData.append('test_type', 'Identification');
        formData.append('mcq', mcq);
        formData.append('identification', identification);
        formData.append('trueOrFalse', trueOrFalse);
      

      
  
      try {
        // Make a request to Django to process the file and JSON data
        const response = await api.post('/api/generate-question-module/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
       
 
        // Process the response
        const dataques = response.data.generated_questions;
        console.log('Processed response:', dataques);
  
        // Check if data is an array before using map
        if (Array.isArray(dataques)) {
          setExamStates((prevExamStates) => [
            ...prevExamStates,
            ...dataques.map((item) => ({
              question: item.question.question, // Ensure it's a string
              choices: [item.question.choices[0],item.question.choices[1],item.question.choices[2],item.question.choices[3]], // Convert choices to strings
              question_type: 'mcq', // Ensure it's a string
              answer: item.question.answer,
              test_part_num: 1,
            })),
          ]);
        } else {
          console.error('Expected an array but got:', dataques);
        }
  
      } catch (error) {
        console.error('Error processing the file and data:', error);
      }
  
      num++;
    }
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
   
   <Progress progress={100} size={'sm'} color={'primary'}/>


       
         <div className='flex gap-5 '>

          
  
   
   <div className='flex-1'>

        <div className='w-full hidden' >
          <div className="mb-2 block">
            <Label htmlFor="title" value="Exam Title" />
          </div>
          <TextInput id="title" type="text" value={formData.Title}  onChange={handleExamTitleChange}/>
        </div>
       
        <br />
        
      
        {examPart(categories)}
        {JSON.stringify(examStates)}
        <div className='w-full ' >
          <div className="mb-2 block">
            <Label htmlFor="title" value="For Multiple choice" />
          </div>
          <TextInput id="title" type="number"  className='max-w-sm' value={test.mcq} onChange={(e)=>{handleTest('mcq',e.target.value)}}/>
        </div>

        <div className='w-full ' >
          <div className="mb-2 block">
            <Label htmlFor="title" value="For Idnetification" />
          </div>
          <TextInput id="title" type="number"  className='max-w-sm' value={test.identification} onChange={(e)=>{handleTest('identification',e.target.value)}}/>
        </div>
        
        <div className='w-full ' >
          <div className="mb-2 block">
            <Label htmlFor="title" value="For True or false" />
          </div>
          <TextInput id="title" type="number"  className='max-w-sm' value={test.trueOrFalse} onChange={(e)=>{handleTest('trueOrFalse',e.target.value)}}/>
        </div>
  <div >
 
  <Button className='mx-auto' color={'primary'}  onClick={handleFileProcessing}>Create Exam</Button>
  </div>
        {JSON.stringify(test)}
        {String(formData.ExaminationType.includes('Identification'))}
        
        <Modal show={PdfModal} size={'7xl'}  onClose={() => setPdfModal(false)} className="h-screen">
        <Modal.Header>Exam</Modal.Header>
        <Modal.Body  className="p-0">
          <div className="min-h-96 "  style={{height:'575px'}}>
          <PDFViewer className="h-full w-full">
    <Exampdf TestPart={TestPart} examStates={examStates} />
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
