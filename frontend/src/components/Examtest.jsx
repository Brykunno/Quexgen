import React, { useState,useEffect } from 'react';
import {Button} from "@mui/material";
import { Tooltip,Breadcrumb,Progress, Card, Textarea, TextInput, Label,Radio,Modal,FileInput } from "flowbite-react";
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
import LoadingWithPercent from './LoadingWithPercent';
import AnswerKey from './AnswerKey';
import KeyIcon from '@mui/icons-material/Key';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import { HiOutlineExclamationCircle } from "react-icons/hi";

import Menu from './Menu'; // Adjust the path based on the file location
import LoadingGeneratePsu from './LoadingGeneratePsu';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useSnackbar } from 'notistack';
import CircularProgress, {
  circularProgressClasses,
} from '@mui/material/CircularProgress';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? 'primary' : '#308fe8',
  },
}));
function Examtest ({updateformData,setFormData,setLessonsDatainitial,handleLessonDataChange, saveDataToLocalStorageTestPart,files,items, tos_id, lessonsData,handleStateChange,examStates,setExamStates,ExamTitle,handleExamTitleChange,handleRadioAnswer,TestPart,setTestPart,handleTestPartChange,setSubmit,setLoading,context,setContext,formData,setTOSPdfModal,addToast}) {


  const { enqueueSnackbar } = useSnackbar();
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
  const [Test4,setTest4] = useState(0)
  const [PdfModal,setPdfModal] = useState(false)
  const [PdfModalAnswer,setPdfModalAnswer] = useState(false)
  const [showPart,setShowPart] = useState(1)
  const [disableShowPart1,setDisableShowPart1] = useState('false')
  const [disableShowPart2,setDisableShowPart2] = useState('false')
  const [disableShowPart3,setDisableShowPart3] = useState('false')
  const [disableShowPart4,setDisableShowPart4] = useState('false')
 

  const [modalGenMcq, setModalGenMcq] = useState({});
  const [modalGenIden, setModalGenIden] = useState({});
  const [modalGenTorF, setModalGenTorF] = useState({});

  const [loadingpercent,setLoadingPercent] = useState(false);
  const [percent,setPercent] = useState(0);

  const [test, setTest] = useState({
    mcq: 0,
    identification: 0,
    trueOrFalse: 0,
  });

  
  


    

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
let subtest = 0

  const categories = lessonsData.reduce((acc, cat,index) => {

    for(let k = 0; k<cat.learning_outcomes.length;k++){
      const start = stringToIntegerStart(String(cat.placement[k]));
    const end = stringToIntegerEnd(String(cat.placement[k]));
    const ind = index + 1

    let remembering = cat.remembering[k]
    let understanding = cat.understanding[k] 
    let applying = cat.applying[k]
    let evaluating = cat.evaluating[k] 
    let analyzing = cat.analyzing[k] 
    let creating = cat.creating[k] 

    for (let i = start; i <= end; i++) {


      if (remembering) {
        acc[i] = 'Remembering'
        
                 
        
        remembering--;
      } else if (understanding) {
        acc[i] = 'Understanding'
         

        understanding--;
      } else if (applying) {
        acc[i] =  'Applying'
         subtest++

        applying--;
      } else if (analyzing) {
        acc[i] =  'Analyzing'
         

        analyzing--;
      } else if (evaluating) {
        acc[i] =  'Evaluating'
         
        subtest++
        evaluating--;
      } else if (creating) {
        acc[i] =  'Creating'
        subtest++

        creating--;
      }
     
         
};



      
    
 
    }
    return acc;
    
  }, {});

  const [max,setMax] = useState(0)


  useEffect(()=>{
    setMax(Number(items-subtest)-test.mcq-test.identification-test.trueOrFalse)
  },[items,test])

  const handleTest = (type, value) => {
    setMax(Number(items-subtest)-Number(test.mcq))
    setTest((prevTest) => ({
      ...prevTest,
      [type]: value, 
    }));

  
  };

  
const lessons = lessonsData.reduce((acc, cat,index) => {

  let subnum=0
  for(let k=0;k<cat.learning_outcomes.length;k++){
    const start = stringToIntegerStart(String(cat.placement[k]));
    const end = stringToIntegerEnd(String(cat.placement[k]));
   

    if(isNaN(end)){
      subnum++;
    }else{
    for (let i = start; i <= end; i++) {
      subnum++;
   
      };
    }

  }
acc[index] = subnum;
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

  let num1 = 1

  const mcq = (item, index,examStates) => {

    let catindex = 0

    if(item.test_part_num === 1){
      catindex = getQuestionNumber(item, examStates)
    }
    else if(item.test_part_num === 2){
      catindex = getQuestionNumber(item, examStates)+Test1
    }
    else if(item.test_part_num === 3){
      catindex = getQuestionNumber(item, examStates)+Test1+Test2
    }
    else{
     catindex = getQuestionNumber(item, examStates)+Test1+Test2+Test3
    }

    return (
      <Card key={index} className='m-5'>




          
      <div>
        <div className='flex gap-3'>
        <span className='mt-2'>
          {num1++}. 
          
          
          </span>

          <Textarea
            value={item.question}
            onChange={(e) => handleStateChange(index, 'question', e.target.value)}
          />
        </div>

    <div className='mt-3'>
      <div className='flex flex-col md:flex-row  gap-3 mx-auto'>
        <div className='w-full'>
          <div className='flex gap-3 w-full mb-3'>
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
              style={{height:'100px'}}
              onChange={(e) => handleStateChange(index, 0, e.target.value)}
              
            />
          </div>

          <div className='flex gap-3 w-full mb-3'>
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
              style={{height:'100px'}}
              onChange={(e) => handleStateChange(index, 1, e.target.value)}
            />
          </div>
        </div>
        <div className='w-full'>
          <div className='flex gap-3 w-full mb-3'>
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
              style={{height:'100px'}}
              onChange={(e) => handleStateChange(index, 2, e.target.value)}
            />
          </div>

          <div className='flex gap-3 w-full mb-3'>
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
              style={{height:'100px'}}
              onChange={(e) => handleStateChange(index, 3, e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
    <div className='flex gap-5 justify-center mt-3'>
    <Tooltip content="Generate another question" style="dark">
    <Button color={'primary'} variant='contained' onClick={() => setModalGenMcq(prev => ({ ...prev, [index]: true }))} size={'sm'} ><AutoModeIcon sizing={'small'}/></Button>
    </Tooltip>
    <Tooltip content="Delete Question" style="dark">
    <Button color={'error'} variant='contained' onClick={() =>{handleRemoveLastItemIndex(index)}} size={'sm'}><DeleteIcon sizing={'small'}/></Button>
    </Tooltip>
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
              style={{height:'100px'}}
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
              style={{height:'100px'}}
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
              style={{height:'100px'}}
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
              style={{height:'100px'}}
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
        <Modal.Footer className='flex justify-center'>
          <Button color={'primary'} variant='contained' disabled={getContextValue(index)==''} onClick={()=>{generateQues(index,"mcq")}} className='mx-auto'>Generate</Button>
        
        </Modal.Footer>
      </Modal>





    </div>
      </div>
    </Card>
    );
  }
  
  // let num2 = Test1+1
  let num2 = 1

  const identification = (item, index,examStates) => {
    
    let catindex = 0

    if(item.test_part_num === 1){
      catindex = getQuestionNumber(item, examStates)
    }
    else if(item.test_part_num === 2){
      catindex = getQuestionNumber(item, examStates)+Test1
    }
    else if(item.test_part_num === 3){
      catindex = getQuestionNumber(item, examStates)+Test1+Test2
    }
    else{
     catindex = getQuestionNumber(item, examStates)+Test1+Test2+Test3
    }

    return (
        <Card key={index} className='m-5'>
        <div>
          <div className='flex gap-3'>
          <span className='mt-2'> {num2++}.</span>
            <Textarea
              value={item.question}
              
              onChange={(e) => handleStateChange(index, 'question', e.target.value)}
            />
          </div>
      <div className='mt-3'>
        <div className='flex flex-wrap gap-10 mx-auto'>
          <div className='w-3/4'>
            <div className='flex gap-3 w-full mb-3'>

              <span className='mt-2 font-bold'>Answer:</span>
              <Textarea
                value={item.choices[0]}
                style={{height:'100px'}}
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
      
      <Tooltip content="Generate another question" style="dark">
      <Button color={'primary'} variant='contained' onClick={() => setModalGenIden(prev => ({ ...prev, [index]: true }))} size={'sm'} ><AutoModeIcon sizing={'small'}/></Button>
      </Tooltip>

      <Tooltip content="Delete Question" style="dark">
      <Button color={'error'} variant='contained' onClick={() =>{handleRemoveLastItemIndex(index)}} size={'sm'}><DeleteIcon sizing={'small'}/></Button>
      </Tooltip>

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
                style={{height:'100px'}}
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
       <Modal.Footer className='flex justify-center'>
         <Button color={'primary'} variant='contained' disabled={getContextValue(index)==''} onClick={()=>{generateQues(index,"identification")}} className='mx-auto'>Generate</Button>
       
       </Modal.Footer>
     </Modal>


      </div>
        </div>
      </Card>
    );
  }

  // let num3 = Test1+Test2+1

  let num3 = 1

  const trueOrFalse = (item, index,examStates) => {
    
    let catindex = 0


    if(item.test_part_num === 1){
      catindex = getQuestionNumber(item, examStates)
    }
    else if(item.test_part_num === 2){
      catindex = getQuestionNumber(item, examStates)+Test1
    }
    else if(item.test_part_num === 3){
      catindex = getQuestionNumber(item, examStates)+Test1+Test2
    }
    else{
     catindex = getQuestionNumber(item, examStates)+Test1+Test2+Test3
    }

    return (
        <Card key={index} className='m-5'>
        <div>
          <div className='flex gap-3'>
          <span className='mt-2'> {num3++}.</span>
            <Textarea
              value={item.question}
              onChange={(e) => handleStateChange(index, 'question', e.target.value)}
            />
          </div>
      <div className='mt-3'>
        <div className='flex  flex-col  md:flex-row gap-5 mx-auto'>
         
            <div className='flex gap-3 w-full mb-3'>
              <Radio
                name={`answers-${index}`}
                value="True"
                className='mt-3'
                onChange={(e) => handleRadioAnswer(index, e.target.value)}
                checked={checkAnswer(item.answer, "True")}
              />
              <span className='mt-2'>True</span>
         
            </div>
            <div className='flex gap-3 w-full mb-3'>
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
      <Tooltip content="Generate another question" style="dark">
      <Button color={'primary'} variant='contained' onClick={() => setModalGenTorF(prev => ({ ...prev, [index]: true }))} size={'sm'} ><AutoModeIcon sizing={'small'}/></Button>
      </Tooltip>
      <Tooltip content="Delete Question" style="dark">
      <Button color={'error'} variant='contained' onClick={() =>{handleRemoveLastItemIndex(index)}} ><DeleteIcon/></Button>
      </Tooltip>

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
       <Modal.Footer className='flex justify-center'>
         <Button color={'primary'} variant='contained' disabled={getContextValue(index)==''} onClick={()=>{generateQues(index,"trueOrFalse")}} className='mx-auto'>Generate</Button>
       
       </Modal.Footer>
     </Modal>
    
      </div>
        </div>
      </Card>
    );
  }
// let num4 = Test1+Test2+Test3+1
let num4 = 1

  const subjective = (item, index,examStates) => {
    
    let catindex = 0


    if(item.test_part_num === 1){
      catindex = getQuestionNumber(item, examStates)
    }
    else if(item.test_part_num === 2){
      catindex = getQuestionNumber(item, examStates)+Test1
    }
    else if(item.test_part_num === 3){
      catindex = getQuestionNumber(item, examStates)+Test1+Test2
    }
    else{
     catindex = getQuestionNumber(item, examStates)+Test1+Test2+Test3
    }

    return (
        <Card key={index} className='m-5'>
        <div>
          <div className='flex gap-3'>
          <span className='mt-2'> {num4++}.</span>
            <Textarea
            style={{height:'100px'}}
              value={item.question}
              onChange={(e) => handleStateChange(index, 'question', e.target.value)}
            />
          </div>
      <div className='flex gap-5 justify-center mt-3'>
      
      {/* <Button color={'primary'} variant='contained' onClick={() => setModalGenTorF(prev => ({ ...prev, [index]: true }))} size={'sm'} >Generate {categories[catindex] ? categories[catindex] : ''} question</Button> */}

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
 
           </Card>
           </div>

         
           
         </div>
       </Modal.Body>
       <Modal.Footer className='flex justify-center'>
         <Button color={'primary'} variant='contained' disabled={getContextValue(index)==null} onClick={()=>{generateQues(index,"trueOrFalse")}} className='mx-auto'>Generate</Button>
       
       </Modal.Footer>
     </Modal>
      <Tooltip content="Delete Question" style="dark">
      <Button color={'error'} variant='contained' onClick={() =>{handleRemoveLastItemIndex(index)}} ><DeleteIcon/></Button>
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
      }else if(itemtest.test_type === 'trueOrFalse'){
        type = 'True or False'
      }
      else{
        type = 'Subjective Test'
      }

      return(
        <Card key={index} className={itemtest.test_part_num === showPart?'show relative mb-5':'hidden'} > {/* Make the Card a relative container */}
        {/* Delete Button at the Top Right Corner */}
        {/* <Button
        
          size={'xs'}
          color={'error'} variant='contained'
          onClick={() => { handleRemoveLastItemTest(index); }} 
          className="absolute top-2 right-2" // Position the button absolutely
        >
          <CloseIcon />
        </Button> */}

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
        
          {/* <div className='overflow-y-scroll py-5' style={{ height: '400px', direction: 'rtl', overflow: 'auto' }}>
          <div style={{ direction: 'ltr' }}> */}

<div className=' py-5' >
<div >
        
      
          {examStates.map((item, idx) => (
            <div key={idx}>
              {item.question_type === 'mcq' && itemtest.test_type === 'mcq' && mcq(item, idx, examStates)}
              {item.question_type === 'identification' && itemtest.test_type === 'identification' && identification(item, idx, examStates)}
              {item.question_type === 'trueOrFalse' && itemtest.test_type === 'trueOrFalse' && trueOrFalse(item, idx, examStates)}
              {item.question_type === 'subjective' && itemtest.test_type === 'subjective' && subjective(item, idx, examStates)}
           
            </div>
          ))}
      
          <div className='flex gap-5 mt-5 justify-center'>
            <Button 
            
            color={'primary'} variant='contained'
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
   
      disableBtn();
      disableBtnShowPart();
      const test1 = examStates.filter(test => test.question_type === 'mcq').length;

      
 
      // Count how many 'identification' test types are in examStates
      const test2 = examStates.filter(test => test.question_type === 'identification').length;
      
      // Count how many 'trueOrFalse' test types are in examStates
      const test3 = examStates.filter(test => test.question_type === 'trueOrFalse').length;
      const test4 = examStates.filter(test => test.question_type === 'subjective').length;

      setTest1(test1)
      setTest2(test2)
      setTest3(test3)
      setTest4(test4)

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
 const test4 = TestPart.filter(test => test.test_part_num === 4).length;
 
 
 // Set disable states based on counts
 setDisableShowPart1(test1 <= 0);
 setDisableShowPart2(test2 <= 0);
 setDisableShowPart3(test3 <= 0);
 setDisableShowPart4(test4 <= 0);
 
  
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

  useEffect(()=>{

    setPercent((examStates.length/items)*100)

    if(percent ===100){
      setLoadingPercent(false)
    }

  },[examStates,items,percent])


  const testTotal = Number(test.mcq)+Number(test.identification)+Number(test.trueOrFalse)+subtest
  
  const handleFileProcessing = async () => {

    if(testTotal!=items){
      enqueueSnackbar("The total number of exam items doesn't match the desired number of items.",{variant:'warning'})
      return
    }


    
    const newTestParts = [];
    let mcq= test.mcq
    let identification= test.identification
    let trueOrFalse= test.trueOrFalse
  
    const existingTestTypes = TestPart.map(part => part.test_type); // Get the list of existing test types
  
    // Check if ExaminationType contains 'Multiple Choice' and if it hasn't been added already
    if (formData.ExaminationType.includes('Multiple Choice') && !existingTestTypes.includes('mcq')) {
      newTestParts.push({
        test_type: 'mcq',
        test_instruction: 'Choose the correct answer.',
        test_part_num: TestPart.length + newTestParts.length + 1,
      });
    }
  
    // Check if ExaminationType contains 'Identification' and if it hasn't been added already
    if (formData.ExaminationType.includes('Identification') && !existingTestTypes.includes('identification')) {
      newTestParts.push({
        test_type: 'identification',
        test_instruction: 'Identify the correct answer',
        test_part_num: TestPart.length + newTestParts.length + 1,
      });
    }
  
    // Check if ExaminationType contains 'True or False' and if it hasn't been added already
    if (formData.ExaminationType.includes('True or False') && !existingTestTypes.includes('trueOrFalse')) {
      newTestParts.push({
        test_type: 'trueOrFalse',
        test_instruction: 'Answer True if the statement is true and False if the statement is false.',
        test_part_num: TestPart.length + newTestParts.length + 1,
      });
    }

        // Check if ExaminationType contains 'True or False' and if it hasn't been added already
        if (formData.ExaminationType.includes('Subjective') && !existingTestTypes.includes('subjective')) {
          newTestParts.push({
            test_type: 'subjective',
            test_instruction: 'Read each question carefully.',
            test_part_num: TestPart.length + newTestParts.length + 1,
          });
        }
  
 
  
    // If there are new test parts to add, update the state
    if (newTestParts.length > 0) {
      setTestPart((prevTestPart) =>{
        
        const updatedTestPart =   [...prevTestPart, ...newTestParts]
        localStorage.setItem('testpartData', JSON.stringify(updatedTestPart));
        return updatedTestPart;
      }
      );
      
    }
    if (files.length === 0){ return alert('Please select a file.')} else {setLoadingPercent(true)};

    
    let num = 0;



  
    for (let i = 0;i<files.length;i++) {
      if (!files[i]) return alert('Please select a file.');
      const formData = new FormData();

    
      
      formData.append('file', files[i]); // Append the selected file
  
      // Add other JSON data to the FormData
      formData.append('index', 0);
      
      formData.append('context', 'Your context');
      formData.append('taxonomy_level', 'Remembering');

     
        formData.append('test_type', 'Identification');

        const rememberingTotal= lessonsData[num].remembering.reduce((acc, data) => acc + data, 0)
        const understandingTotal= lessonsData[num].understanding.reduce((acc, data) => acc + data, 0)
        const applyingTotal= lessonsData[num].applying.reduce((acc, data) => acc + data, 0)
        const analyzingTotal= lessonsData[num].analyzing.reduce((acc, data) => acc + data, 0)
        const evaluatingTotal= lessonsData[num].evaluating.reduce((acc, data) => acc + data, 0)
        const creatingTotal= lessonsData[num].creating.reduce((acc, data) => acc + data, 0)

    


        formData.append('mcq', mcq);

     
        formData.append('identification', identification);
        
        formData.append('trueOrFalse', trueOrFalse);
        formData.append('subjective', subtest);
        formData.append('numques', lessons[num]);
   
        formData.append('Remembering', rememberingTotal);
        formData.append('Understanding', understandingTotal);
        formData.append('Applying', applyingTotal);
        formData.append('Analyzing', analyzingTotal);
        formData.append('Evaluating', evaluatingTotal);
        formData.append('Creating', creatingTotal);

        if(i === files.length-1){
          formData.append('last', 1);
        }
      

      
  
      try {
        // Make a request to Django to process the file and JSON data
        const response = await api.post('/api/generate-question-module/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
       
 
  // Process the response
const dataques = response.data.generated_questions;


const updatedFormData = {
  ...(updateformData || {}),
  total_tokens: (updateformData?.total_tokens || 0) +
    dataques.reduce(
      (acc, item) => acc + (parseInt(item.question?.total_tokens) || 0),
      0
    )
};
setFormData(updatedFormData);
localStorage.setItem('formData', JSON.stringify(updatedFormData));

  

        // Check if data is an array before using map
        if (Array.isArray(dataques)) {
          setExamStates((prevExamStates) => {
            const updatedStates = [
              ...prevExamStates,
              ...dataques.map((item) => ({
                question: item.question.question || '', // Default to an empty string if undefined
                choices:
                  item.question.test_type === 'trueOrFalse' || !item.question.choices
                    ? []
                    :  item.question.choices.slice(0, 4).map(choice => 
          choice.replace(/^\s*[-–•]\s*/, '') // Remove leading dash, bullet, etc.
        ), // Use slice to prevent accessing out of bounds
                question_type: item.question.test_type || '',
                answer: item.question.answer || '',
                test_part_num: 1,
              })),
            ];
        
            // Filter out invalid entries (empty questions or answers)
            const validUpdatedStates = updatedStates.filter(
              (state) => state.question !== ''
            );
        
            // Only update if there are valid states
            if (validUpdatedStates.length > 0) {
              localStorage.setItem('questionData', JSON.stringify(validUpdatedStates));
        
              // Return the modified array with valid data
              return validUpdatedStates;
            }
        
            // If no valid data, return the previous state without changes
            return prevExamStates;
          });
        }
         else {
          console.error('Expected an array but got:', dataques);
        }
        
      } catch (error) {
        console.error('Error processing the file and data:', error);
        enqueueSnackbar("Question Generation failed. Please try again.",{variant:"error"})
      }
  
      num++;
  
    }
  
    setLoadingPercent(false)
  
  };
  
  const handleClear = () =>{
localStorage.setItem('questionData',[])
localStorage.setItem('testpartData',[])
setExamStates([])
setTestPart([])
  }

  const [clearBtn,setClearBtn] =useState(false)
  
  useEffect(()=>{
   if(!formData.ExaminationType.includes('Multiple Choice')) {
    setTest((prevTest) => ({
      ...prevTest,
      ['mcq']: 0, 
    }));

   }
   if(!formData.ExaminationType.includes('Identification')) {
    setTest((prevTest) => ({
      ...prevTest,
      ['identification']: 0, 
    }));

   }

   if(!formData.ExaminationType.includes('True or False')) {
    setTest((prevTest) => ({
      ...prevTest,
      ['trueOrFalse']: 0, 
    }));

   }
  },[formData])
 




  return (
    <div >
    <Card>
      
    <Breadcrumb aria-label="Default breadcrumb example">
    <Breadcrumb.Item >
    TOS Information
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
 
 <Progress progress={100} size={'sm'} color={'primary'} variant='contained'/>



     
       <div className='flex gap-5 '>
     {/* <div style={{flex:0.4}}>

     <div className=' w-full h-full'  >
 

    <Card  className='w-full mt-5 position: sticky top-0'> 
    
    <Button color={'primary'} variant='contained' onClick={()=>{setShowPart(1)}} disabled={disableShowPart1}><VisibilityIcon className="mr-2"/> View Test 1</Button>
    <Button color={'primary'} variant='contained' onClick={()=>{setShowPart(2)}} disabled={disableShowPart2}><VisibilityIcon className="mr-2"/> View Test 2</Button>
    <Button color={'primary'} variant='contained' onClick={()=>{setShowPart(3)}} disabled={disableShowPart3}><VisibilityIcon className="mr-2"/> View Test 3</Button>
    <Button color={'primary'} variant='contained' onClick={()=>{setShowPart(4)}} disabled={disableShowPart4}><VisibilityIcon className="mr-2"/> View Test 4</Button>

    
    <Button  color="blue" onClick={() => setPdfModal(true)}><PreviewIcon className="mr-2"/> Exam Preview</Button>
    <Button  color="blue" onClick={() => setPdfModalAnswer(true)}><KeyIcon className="mr-2"/> Answer keys</Button>
   <Button  color="error" onClick={handleClear}><KeyIcon className="mr-2"/> Clear Exam</Button>
    <Button  type="submit" onClick={()=>{setSubmit(false)}} color="success"><SaveIcon className='mr-2'/>Save Exam</Button>
    <Button  type="submit" onClick={()=>{setSubmit(true)}} color="success"><SendIcon className='mr-2'/>Submit Exam</Button>
  
  
 
    </Card>

    

   


    </div>
    
     </div> */}
 
 <div className=' flex-1'>


 <div>
      <Menu
        setShowPart={setShowPart}
        disableShowPart1={disableShowPart1}
        disableShowPart2={disableShowPart2}
        disableShowPart3={disableShowPart3}
        disableShowPart4={disableShowPart4}
        setTOSPdfModal={setTOSPdfModal}
        setPdfModal={setPdfModal}
        setPdfModalAnswer={setPdfModalAnswer}
        setClearBtn={setClearBtn}
        setSubmit={setSubmit}
        showPart={showPart}

        examStates={examStates}
        
      />

     
    </div>

<div className='flex gap-5 mt-5 px-5'>
  <div className='flex-1 mt-2'>

<Stack spacing={2} sx={{ flexGrow: 1 }}>
   
        <BorderLinearProgress variant="determinate"  value={Math.round(percent)}  />
    </Stack>
</div>
<div className='flex font-bold text-lg'>
{Math.round(percent)}%
</div>

</div>


      <div className='w-full hidden' >
        <div className="mb-2 block">
          <Label htmlFor="title" value="Exam Title" />
        </div>
        <TextInput id="title" type="text" value={ExamTitle}  onChange={handleExamTitleChange}/>
      </div>
     
      <br />
      
    
      {examPart(categories)}

     

<div className={` ${examStates.length > 0?'hidden':'show '}`}>

      <Card className={`justify-center w-96 mx-auto  `}>
  {/* Multiple Choice */}
  <div className={`flex items-center justify-between mb-4 ${!formData.ExaminationType.includes('Multiple Choice')?'hidden':'show'}`} >
    <div className="block">
      <Label htmlFor="mcq" value="Items for Multiple Choice" />
    </div>
    <TextInput
      min={0}
      id="mcq"
      type="number"
      className="max-w-sm"
      value={test.mcq}
      onChange={(e) => handleTest('mcq', e.target.value)}
      max={max === 0 ? test.mcq : 100}
    />
  </div>

  {/* Identification */}
  <div className={`flex items-center justify-between mb-4 ${!formData.ExaminationType.includes('Identification')?'hidden':'show'}`} >
    <div className="block">
      <Label htmlFor="identification" value="Items for Identification" />
    </div>
    <TextInput
      min={0}
      id="identification"
      type="number"
      className="max-w-sm"
      value={test.identification}
      onChange={(e) => handleTest('identification', e.target.value)}
      max={max === 0 ? test.identification : 100}
    />
  </div>

  {/* True or False */}
  <div className={`flex items-center justify-between mb-4 ${!formData.ExaminationType.includes('True or False')?'hidden':'show'}`} >
    <div className="block">
      <Label htmlFor="trueOrFalse" value="Items for True or False" />
    </div>
    <TextInput
      min={0}
      id="trueOrFalse"
      type="number"
      className="max-w-sm"
      value={test.trueOrFalse}
      onChange={(e) => handleTest('trueOrFalse', e.target.value)}
      max={max === 0 ? test.trueOrFalse : 100}
    />
  </div>

  {/* Subjective Test */}
  <div className={`flex items-center justify-between mb-4 ${!formData.ExaminationType.includes('Subjective')?'hidden':'show'}`} >
    <div className="block">
      <Label htmlFor="subjective" value="Items for Subjective Test" />
    </div>
    <TextInput
      min={0}
      id="subjective"
      type="number"
      className="max-w-sm"
      value={subtest}
      max={max === 0 ? test.trueOrFalse : 100}
      disabled
    />
  </div>

  

  <hr className="my-4" />

  <div className="flex items-center justify-between mb-4">
    <div className="block">
      <Label htmlFor="subjective" value="Total Items" />
    </div>
   <div>{testTotal}/{items}</div>
  </div>

  {/* Button */}
  <div className="text-center">
    <Button
      className="mt-3 mx-auto"
      color="primary"
      variant='contained'
      onClick={handleFileProcessing}


    >
      Generate Exam
    </Button>
  </div>
</Card>
<div className='flex-1'>
  <Card  className='hidden'>
  {lessonsData.map((data,index)=>{

    return(
      <div key={index}>

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
      </div>
    )

  })}
 
  </Card>
</div>
</div>
      
      <Modal show={PdfModal} size={'7xl'}  onClose={() => setPdfModal(false)} className="h-screen">
      <Modal.Header>Exam</Modal.Header>
      <Modal.Body  className="p-0">
        <div className="min-h-96 "  style={{height:'575px'}}>
        <PDFViewer className="h-full w-full">
  <Exampdf TestPart={TestPart} examStates={examStates} faculty={formData.Faculty} formData={formData} />
</PDFViewer>
    
        </div>
      </Modal.Body>
    </Modal>


    <Modal show={PdfModalAnswer} size={'7xl'}  onClose={() => setPdfModalAnswer(false)} className="h-screen">
      <Modal.Header>Answer Key</Modal.Header>
      <Modal.Body  className="p-0">
        <div className="min-h-96 "  style={{height:'575px'}}>
        <PDFViewer className="h-full w-full">
  <AnswerKey TestPart={TestPart} examStates={examStates} faculty={formData.Faculty} formData={formData}/>
</PDFViewer>
    
        </div>
      </Modal.Body>
    </Modal>

    <Modal show={clearBtn} size="md" onClose={() => setClearBtn(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to clear all the items in the exam?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="error" variant='contained' onClick={() => {setClearBtn(false);handleClear()}}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="secondary" onClick={() => setClearBtn(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>



    </div>
    </div>
    </Card>
    {/* {examStates.length} 
    <br/>
    <div>test 1: {Test1}</div>
    <div>test 2: {Test2}</div>
    <div>test 3: {Test3}</div>
    <div>test 4: {Test4}</div>
    <div>test 4: {JSON.stringify(TestPart)}</div> */}
 {/* {JSON.stringify(categories)} */}

   
    {loadingpercent && <LoadingGeneratePsu percent={percent}/>}

  </div>
  
  );
};



export default Examtest;
