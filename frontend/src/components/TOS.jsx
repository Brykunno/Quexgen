import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TableRow from "@mui/material/TableRow";
import { Breadcrumb,Card,Progress,Label, Textarea, TextInput,Button,RangeSlider,Modal,Select,FileInput } from "flowbite-react";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import TOSmodal from "./TOSmodal";
import api from "../api";
import { useNavigate } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import LoadingSubmit from "./LoadingSubmit";
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { Autocomplete, TextField, Chip } from '@mui/material';
import Learning_outcomes from "./Learning_outcomes";

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { useState,useEffect } from "react";
import ToastMessage from "./Toast";
import Exam from "./Exam";

import ReactDOM from 'react-dom';
import { PDFViewer } from '@react-pdf/renderer';
import PdfFile from "./PdfFile";
import Examtest from "./Examtest";
import LoadingGenerate from "./LoadingGenerate";


function createData(
  topic,
  learning_outcomes,
  teaching_hours,
  allocation,
  numofitems,
  remembering,
  understanding,
  applying,
  analyzing,
  evaluating,
  creating,
  total,
  placement,
  study_guide,
  action

  
) {
  return {
    topic,
    learning_outcomes,
    teaching_hours,
    allocation,
    numofitems,
    remembering,
    understanding,
    applying,
    analyzing,
    evaluating,
    creating,
    total,
    placement,
    study_guide,
    action
   
  };
}




 function TOS() {

  if (localStorage.getItem('lessonsData') === null) {
    
localStorage.setItem('lessonsData',JSON.stringify([{  
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
totalItems:0,
study_guide:null,
tos_teacher: 0,
}]));
  } 

  let tos_id = 0
  let exam_id = 0
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [lesson, setLesson] = React.useState(0);
  const [totalItems, setTotalItems] = React.useState(0);
  const [lessonsDataInitial, setLessonsDatainitial] = React.useState([]);

  const [Remembering, setRemembering] = React.useState(0);
  const [Understanding, setUnderstanding] = React.useState(0);
  const [Applying, setApplying] = React.useState(0);
  const [Analyzing, setAnalyzing] = React.useState(0);
  const [Evaluating, setEvaluating] = React.useState(0);
  const [Creating, setCreating] = React.useState(0);
  const [TotalTaxonomy, setTotalTaxonomy] = React.useState(0);
  const [PdfModal, setPdfModal] = useState(false);

  const [indexRow, setIndexRow] = React.useState(0);
  
  const [loading, setLoading] = useState(false);
  const [Toast, setToast] = useState(false);

  const [files, setFiles] = useState([]); 
  const [context,setContext] = useState([])

  const [openModal, setOpenModal] = useState(false);

  const [submitToast,setSubmitToast] = useState(false);
  const[loadingGenerate,setLoadingGenerate] = useState(false)

  const [selectedOptions, setSelectedOptions] = useState([]);

  function roundNum(num) {
    if (num % 1 >= 0.4 && num % 1 <= 0.6) {
      return num; // Return original value if it's .4, .5, or .6
    }
    // return Math.round(num); 
    return num;
  }
  

  React.useEffect(() => {
    // Retrieve lessons data from local storage on component mount
    const storedLessonsString = localStorage.getItem('lessonsData');
    const remember = localStorage.getItem('Remembering');
    const understand = localStorage.getItem('Understanding');
    const apply = localStorage.getItem('Applying');
    const analyze = localStorage.getItem('Analyzing');
    const evaluate = localStorage.getItem('Evaluating');
    const create = localStorage.getItem('Creating');
    const totalitems = localStorage.getItem('totalItems');
    
    if(remember){
      setRemembering(remember)
    }
    if(understand){
      setUnderstanding(understand)
    }
    if(apply){
      setApplying(apply)
    }
    if(analyze){
      setAnalyzing(analyze)
    }
    if(evaluate){
      setEvaluating(evaluate)
    }
    if(create){
      setCreating(create)
    }
    if(totalitems){
      setTotalItems(totalitems)
    }
    if (storedLessonsString) {
      setLessonsDatainitial(JSON.parse(storedLessonsString));
    }
  }, []);

  const addLesson = (newLesson) => {
    const updatedLessons = [...lessonsDataInitial, newLesson];
    setLessonsDatainitial(updatedLessons);

    // Store the updated lessons array in local storage
    localStorage.setItem('lessonsData', JSON.stringify(updatedLessons));
   
  };

  const lessonsDataStorage = localStorage.getItem('lessonsData');

  // Parse the JSON string back to a JavaScript object
  const lessonsData = JSON.parse(lessonsDataStorage);
  
  // Now you can use the `storedLessons` array as needed
  console.log(lessonsData);

  
const columns = [
  { id: "topic", label: "Lesson/\nChapter", minWidth: 100  },
  // { id: "learning_outcomes", label: "Learning Outcomes", minWidth: 170 },
  {
    id: "teaching_hours",
    label: "No. of teaching hours",
    minWidth: 100,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "allocation",
    label: "% of allocation",
    minWidth: 100,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "numofitems",
    label: "No. of items",
    minWidth: 100,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "remembering",
    label: (
      <span>
        Knowledge/<br />Remembering <br />
        {Remembering}%
      </span>
    ),
    minWidth: 100,
    align: "center", 
    type: "number",
  },
  {
    id: "understanding",
    label: (
    <span>
      Comprehension/<br />Understanding <br />
      {Understanding}%
    </span>
  ),
    minWidth: 100,
    align: "center",
    type: "number",
  },
  {
    id: "applying",
    label: (
      <span>
        Application/<br />Applying <br />
        {Applying}%
      </span>
    ),
    minWidth: 100,
    align: "center",
    type: "number",
  },
  {
    id: "analyzing",
    label: (
    <span>
      Analysis/<br />Analyzing <br />
      {Analyzing}%
    </span>
  ),
    minWidth: 100,
    align: "center",
    type: "number",
  },
  {
    id: "evaluating",
    label: (
      <span>
        Synthesis/<br />Evaluating <br />
        {Evaluating}%
      </span>
    ),
    minWidth: 100,
    align: "center",
    type: "number",
  },
  {
    id: "creating",
    label: (
      <span>
        Evaluation/<br />Creating <br />
        {Creating}%
      </span>
    ),
    minWidth: 100,
    align: "center",
    type: "number",
  },
  {
    id: "total",
    label: "Total",
    minWidth: 100,
    align: "center",
    type: "number",
  },
  {
    id: "placement",
    label: "Item Placement",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "action",
    label: "Action",
    minWidth: 170,
    align: "right"
  },
];


  
  const handleLessonChange = (event) => {
    setLesson(event.target.value);
  };

  const handleTotalItemsChange = (event) => {
    setTotalItems(event.target.value);
    localStorage.setItem('totalItems', event.target.value);
  };

  let getTotalTaxonomy = Number(Remembering) + Number(Understanding) + Number(Applying) + Number(Analyzing) + Number(Evaluating) + Number(Creating)
  const handleRememberingChange = (event) => {

    setRemembering(hundred(event.target.value));
    setTotalTaxonomy(getTotalTaxonomy)
    localStorage.setItem('Remembering', event.target.value);
  };



  const handleUnderstandingChange = (event) => {
    setUnderstanding(hundred(event.target.value));
    setTotalTaxonomy(getTotalTaxonomy)
    localStorage.setItem('Understanding', event.target.value);
  };

  const handleApplyingChange = (event) => {
    setApplying(hundred(event.target.value));
    setTotalTaxonomy(getTotalTaxonomy)
    localStorage.setItem('Applying',event.target.value);
  };

  const handleAnalyzingChange = (event) => {
    setAnalyzing(hundred(event.target.value));
    setTotalTaxonomy(getTotalTaxonomy)
    localStorage.setItem('Analyzing', event.target.value);
  };

  const handleEvaluatingChange = (event) => {
    setEvaluating(hundred(event.target.value));
    setTotalTaxonomy(getTotalTaxonomy)
    localStorage.setItem('Evaluating', event.target.value);
  };

  const handleCreatingChange = (event) => {
    setCreating(hundred(event.target.value));
    setTotalTaxonomy(getTotalTaxonomy)
    localStorage.setItem('Creating', event.target.value);
  };

  const handleLessconClick = (event) => {
    setLesson(lesson+1)
  }

   function checkTaxonomy(getTotalTaxonomy){
    let check = 100-getTotalTaxonomy

    if(check >= 0){
      return <span className="w-full">{check}% remaining</span>
    }
    else{
      return <span className="w-full text-red-700">Taxonomy allocation exceeds 100%</span>
    }

   }

   function hundred(value){
    if(value < 0 || value > 100){
      return 0

    }
    else{
      return value
    }
   }
  
  

  function getAllocation(hours,totalHours){

    return Math.round((hours / totalHours) * 100);
  }




function getTotalHours(){
 let hours= lessonsData.reduce((acc, data) => {
    return acc + Number(data.teachingHours);
  }, 0);



  return hours
}


function getNumItems(totalItems,allocation){
  const allocationDecimal = allocation / 100;
  return roundNum(totalItems * allocationDecimal)
 

}

function getRemembering(remembering,items){

  return roundNum((remembering/100)*items)
}

function getUnderstanding(Understanding,items){

  return roundNum((Understanding/100)*items)
}

function getApplying(Applying,items){

  return roundNum((Applying/100)*items)
}
function getAnalyzing(Analyzing,items){

  return roundNum((Analyzing/100)*items)
}
function getEvaluating(Evaluating,items){

  return roundNum((Evaluating/100)*items)
}
function getCreating(Creating,items){

  return roundNum((Creating/100)*items)
}

function getTotal(remembering,understanding,applying,analyzing,evaluating,creating){

  return remembering+understanding+applying+analyzing+evaluating+creating
}

let placements = [];

for(let i = 1; i<=totalItems; i++){
  placements.push(i);
}



function getPlacement(total,placements){

  let start=0;
  let end =0;

  start = placements.splice(0,total-1)[0];
  end = placements.splice(0,1);
  if(start === undefined || end === undefined){
    return "0 - 0"
  }
  else{
    return `${start} - ${end}`;
  }
    
  

}

const handleLessonDataChange = (index, field, value) => {
  // Clone the lessonsData array to avoid direct mutation
  const newData = [...lessonsData];

  // Update the specific field in the corresponding lesson object
  newData[index][field] = value;

  // Log the updated lessonsData for debugging
  console.log('Lessons Data:', newData);

  if(field === 'study_guide'){
    newData[index][field] = value.name;
    const newFiles = [...files];
    newFiles[index] = value;  
    setFiles(newFiles);
    localStorage.setItem('filesData', JSON.stringify(newFiles));
  }


  if (field === 'teachingHours') {
    for (let i = 0; i < newData.length; i++) {
      // Recalculate fields based on the updated teachingHours
      newData[i]['allocation'] = getAllocation(Number(newData[i][field]), getTotalHours());
      newData[i]['items'] = getNumItems(totalItems, newData[i]['allocation']);
      newData[i]['remembering'] = getRemembering(Remembering, newData[i]['items']);
      newData[i]['understanding'] = getUnderstanding(Understanding, newData[i]['items']);
      newData[i]['applying'] = getApplying(Applying, newData[i]['items']);
      newData[i]['analyzing'] = getAnalyzing(Analyzing, newData[i]['items']);
      newData[i]['evaluating'] = getEvaluating(Evaluating, newData[i]['items']);
      newData[i]['creating'] = getCreating(Creating, newData[i]['items']);
      newData[i]['total'] = getTotal(
        newData[i]['remembering'],
        newData[i]['understanding'],
        newData[i]['applying'],
        newData[i]['analyzing'],
        newData[i]['evaluating'],
        newData[i]['creating']
      );

      newData[i]['placement'] = getPlacement(newData[i]['total'], placements);
      newData[i]['totalItems'] = totalItems;
    }
  }

  // Update the state with the new data
  setLessonsDatainitial(newData);

  // Save the updated lessonsData to localStorage
  localStorage.setItem('lessonsData', JSON.stringify(newData));
};




const handleReset = (i, field) => {
  // Clone the lessonsData array to avoid direct mutation
  const newData = [...lessonsData];


      // Recalculate fields based on the updated teachingHours
      newData[i]['allocation'] = getAllocation(Number(newData[i]['teachingHours']), getTotalHours());
      newData[i]['items'] = getNumItems(totalItems, newData[i]['allocation']);
      newData[i]['remembering'] = getRemembering(Remembering, newData[i]['items']);
      newData[i]['understanding'] = getUnderstanding(Understanding, newData[i]['items']);
      newData[i]['applying'] = getApplying(Applying, newData[i]['items']);
      newData[i]['analyzing'] = getAnalyzing(Analyzing, newData[i]['items']);
      newData[i]['evaluating'] = getEvaluating(Evaluating, newData[i]['items']);
      newData[i]['creating'] = getCreating(Creating, newData[i]['items']);
      newData[i]['total'] = getTotal(
        newData[i]['remembering'],
        newData[i]['understanding'],
        newData[i]['applying'],
        newData[i]['analyzing'],
        newData[i]['evaluating'],
        newData[i]['creating']
      );

   
      newData[i]['totalItems'] = totalItems;
  
  // Update the state with the new data
  setLessonsDatainitial(newData);

  // Save the updated lessonsData to localStorage
  localStorage.setItem('lessonsData', JSON.stringify(newData));
};



const configTotal = lessonsData.reduce((acc, data) => {
  return acc + data.total;
}, 0); // Initial value of acc is set to 0





  const rows = lessonsData.map((data, index) =>
    createData(
    <div className="max-w-36  max-h-10  overflow-hidden" style={{maxHeight:'100'}} key={index}><b> {index+1}</b></div>,
    <div className="max-w-36  overflow-hidden" style={{maxHeight:'100'}} key={index}> {data.learning_outcomes}</div>,
    <TextInput type="number" min={'0'} value={data.teachingHours }  onChange={(e) => handleLessonDataChange(indexRow, 'teachingHours', e.target.value)}/>,
     
     data.allocation,
     data.items,
     data.remembering,
     data.understanding,
     data.applying,
     data.analyzing,
     data.evaluating,
     data.creating,
     data.total,
     data.placement,
     <div key={index}>
     <Button color={'red'} >{data.placement}</Button>

     </div>,


    
    )
  );

  const handleModalRow = (event,index) => {
    setOpenModal(true)
    setIndexRow(index)
   
  }

 
  

  const removeLesson = (lessonsData, index) => {
    let myArray = lessonsData.slice(); // Create a shallow copy of the array
  
    // Check if the index is valid and the array is not empty
    if (myArray && myArray.length > 0 && index >= 0 && index < myArray.length) {
      // Remove the item at the specified index
      myArray.splice(index, 1);
  
      // Update the state with the modified array
      setLessonsDatainitial(myArray);
  
      // Save the updated array back to local storage
      localStorage.setItem('lessonsData', JSON.stringify(myArray));
    } else {
      console.log('Invalid index or array is empty.');
    }
  };
  



const handleFloor = (index, field, value) => {
  // Clone the lessonsData array to avoid direct mutation
  const newData = [...lessonsData];

  // Update the specific field in the corresponding lesson object
  newData[index][field] = value;



  if (field === 'items' ) {
    for (let i = 0; i < newData.length; i++) {
      // Recalculate fields based on the updated teachingHours
      newData[i]['allocation'] = getAllocation(Number(newData[i]['teachingHours']), getTotalHours());
      if(i == index){
        newData[i]['items'] = Math.floor(getNumItems(totalItems, newData[i]['allocation']));
      }
      else{
        if(newData[i]['items']%1 != 0){
        newData[i]['items'] = getNumItems(totalItems, newData[i]['allocation']);
      }
      if (newData[i]['remembering'] % 1 !== 0) {
        newData[i]['remembering'] = getRemembering(Remembering, newData[i]['items']);
      }
      
      if (newData[i]['understanding'] % 1 !== 0) {
        newData[i]['understanding'] = getUnderstanding(Understanding, newData[i]['items']);
      }
      
      if (newData[i]['applying'] % 1 !== 0) {
        newData[i]['applying'] = getApplying(Applying, newData[i]['items']);
      }
      
      if (newData[i]['analyzing'] % 1 !== 0) {
        newData[i]['analyzing'] = getAnalyzing(Analyzing, newData[i]['items']);
      }
      
      if (newData[i]['evaluating'] % 1 !== 0) {
        newData[i]['evaluating'] = getEvaluating(Evaluating, newData[i]['items']);
      }
      
      if (newData[i]['creating'] % 1 !== 0) {
        newData[i]['creating'] = getCreating(Creating, newData[i]['items']);
      }
      newData[i]['total'] = getTotal(
        newData[i]['remembering'],
        newData[i]['understanding'],
        newData[i]['applying'],
        newData[i]['analyzing'],
        newData[i]['evaluating'],
        newData[i]['creating']
      );

      newData[i]['placement'] = getPlacement(newData[i]['total'], placements);
      newData[i]['totalItems'] = totalItems;
    }
  }
}

  if (field === 'remembering' ) {
    for (let i = 0; i < newData.length; i++) {
      // Recalculate fields based on the updated teachingHours
      if(i == index){
        newData[i]['remembering'] = Math.floor(getRemembering(Remembering, newData[i]['items']));
     
      }
      else{
        if (newData[i]['remembering'] % 1 !== 0) {
          newData[i]['remembering'] = getRemembering(Remembering, newData[i]['items']);
        }
        
      }
     
      if (newData[i]['understanding'] % 1 !== 0) {
        newData[i]['understanding'] = getUnderstanding(Understanding, newData[i]['items']);
      }
      
      if (newData[i]['applying'] % 1 !== 0) {
        newData[i]['applying'] = getApplying(Applying, newData[i]['items']);
      }
      
      if (newData[i]['analyzing'] % 1 !== 0) {
        newData[i]['analyzing'] = getAnalyzing(Analyzing, newData[i]['items']);
      }
      
      if (newData[i]['evaluating'] % 1 !== 0) {
        newData[i]['evaluating'] = getEvaluating(Evaluating, newData[i]['items']);
      }
      
      if (newData[i]['creating'] % 1 !== 0) {
        newData[i]['creating'] = getCreating(Creating, newData[i]['items']);
      }
      newData[i]['total'] = getTotal(
        newData[i]['remembering'],
        newData[i]['understanding'],
        newData[i]['applying'],
        newData[i]['analyzing'],
        newData[i]['evaluating'],
        newData[i]['creating']
      );

      newData[i]['placement'] = getPlacement(newData[i]['total'], placements);
      newData[i]['totalItems'] = totalItems;
    }
  }

  
  if (field === 'understanding' ) {
    for (let i = 0; i < newData.length; i++) {
      // Recalculate fields based on the updated teachingHours
      if(i == index){
        newData[i]['understanding'] = Math.floor(getUnderstanding(Understanding, newData[i]['items']));
     
      }
      else{
        if (newData[i]['understanding'] % 1 !== 0) {
          newData[i]['understanding'] = getUnderstanding(Understanding, newData[i]['items']);
        }
      }
      
    
     
      
      if (newData[i]['applying'] % 1 !== 0) {
        newData[i]['applying'] = getApplying(Applying, newData[i]['items']);
      }
      
      if (newData[i]['analyzing'] % 1 !== 0) {
        newData[i]['analyzing'] = getAnalyzing(Analyzing, newData[i]['items']);
      }
      
      if (newData[i]['evaluating'] % 1 !== 0) {
        newData[i]['evaluating'] = getEvaluating(Evaluating, newData[i]['items']);
      }
      
      if (newData[i]['creating'] % 1 !== 0) {
        newData[i]['creating'] = getCreating(Creating, newData[i]['items']);
      }
      newData[i]['total'] = getTotal(
        newData[i]['remembering'],
        newData[i]['understanding'],
        newData[i]['applying'],
        newData[i]['analyzing'],
        newData[i]['evaluating'],
        newData[i]['creating']
      );

      newData[i]['placement'] = getPlacement(newData[i]['total'], placements);
      newData[i]['totalItems'] = totalItems;
    }
  }

  if (field === 'applying' ) {
    for (let i = 0; i < newData.length; i++) {
      // Recalculate fields based on the updated teachingHours
      if(i == index){
        newData[i]['applying'] = Math.floor(getApplying(Applying, newData[i]['items']));
     
      }
      else{
        if (newData[i]['applying'] % 1 !== 0) {
          newData[i]['applying'] = getApplying(Applying, newData[i]['items']);
        }
      }
      
   
      
      if (newData[i]['analyzing'] % 1 !== 0) {
        newData[i]['analyzing'] = getAnalyzing(Analyzing, newData[i]['items']);
      }
      
      if (newData[i]['evaluating'] % 1 !== 0) {
        newData[i]['evaluating'] = getEvaluating(Evaluating, newData[i]['items']);
      }
      
      if (newData[i]['creating'] % 1 !== 0) {
        newData[i]['creating'] = getCreating(Creating, newData[i]['items']);
      }
      newData[i]['total'] = getTotal(
        newData[i]['remembering'],
        newData[i]['understanding'],
        newData[i]['applying'],
        newData[i]['analyzing'],
        newData[i]['evaluating'],
        newData[i]['creating']
      );

      newData[i]['placement'] = getPlacement(newData[i]['total'], placements);
      newData[i]['totalItems'] = totalItems;
    }
  }

  if (field === 'analyzing' ) {
    for (let i = 0; i < newData.length; i++) {
      // Recalculate fields based on the updated teachingHours
      if(i == index){
        newData[i]['analyzing'] = Math.floor(getAnalyzing(Analyzing, newData[i]['items']));
     
      }
      else{
        if (newData[i]['analyzing'] % 1 !== 0) {
          newData[i]['analyzing'] = getAnalyzing(Analyzing, newData[i]['items']);
        }
      }
         
     
      
      if (newData[i]['evaluating'] % 1 !== 0) {
        newData[i]['evaluating'] = getEvaluating(Evaluating, newData[i]['items']);
      }
      
      if (newData[i]['creating'] % 1 !== 0) {
        newData[i]['creating'] = getCreating(Creating, newData[i]['items']);
      }
      newData[i]['total'] = getTotal(
        newData[i]['remembering'],
        newData[i]['understanding'],
        newData[i]['applying'],
        newData[i]['analyzing'],
        newData[i]['evaluating'],
        newData[i]['creating']
      );

      newData[i]['placement'] = getPlacement(newData[i]['total'], placements);
      newData[i]['totalItems'] = totalItems;
    }
  }


  if (field === 'evaluating' ) {
    for (let i = 0; i < newData.length; i++) {
      // Recalculate fields based on the updated teachingHours
      if(i == index){
        newData[i]['evaluating'] = Math.floor(getEvaluating(Evaluating, newData[i]['items']));
     
      }
      else{
        if (newData[i]['evaluating'] % 1 !== 0) {
          newData[i]['evaluating'] = getEvaluating(Evaluating, newData[i]['items']);
        }
      }
       
    
      
      if (newData[i]['creating'] % 1 !== 0) {
        newData[i]['creating'] = getCreating(Creating, newData[i]['items']);
      }
      newData[i]['total'] = getTotal(
        newData[i]['remembering'],
        newData[i]['understanding'],
        newData[i]['applying'],
        newData[i]['analyzing'],
        newData[i]['evaluating'],
        newData[i]['creating']
      );

      newData[i]['placement'] = getPlacement(newData[i]['total'], placements);
      newData[i]['totalItems'] = totalItems;
    }
  }

  if (field === 'creating' ) {
    for (let i = 0; i < newData.length; i++) {
      // Recalculate fields based on the updated teachingHours
      if(i == index){
        newData[i]['creating'] = Math.floor(getCreating(Creating, newData[i]['items']));
     
      }
      else{
        if (newData[i]['creating'] % 1 !== 0) {
          newData[i]['creating'] = getCreating(Creating, newData[i]['items']);
        }
      }
 
      newData[i]['total'] = getTotal(
        newData[i]['remembering'],
        newData[i]['understanding'],
        newData[i]['applying'],
        newData[i]['analyzing'],
        newData[i]['evaluating'],
        newData[i]['creating']
      );

      newData[i]['placement'] = getPlacement(newData[i]['total'], placements);
      newData[i]['totalItems'] = totalItems;
    }
  }


  // Update the state with the new data
  setLessonsDatainitial(newData);

  // Save the updated lessonsData to localStorage
  localStorage.setItem('lessonsData', JSON.stringify(newData));
};
const handleCeil = (index, field, value) => {
  // Clone the lessonsData array to avoid direct mutation
  const newData = [...lessonsData];

  // Update the specific field in the corresponding lesson object
  newData[index][field] = value;



  if (field === 'items' ) {
    for (let i = 0; i < newData.length; i++) {
      // Recalculate fields based on the updated teachingHours
      newData[i]['allocation'] = getAllocation(Number(newData[i]['teachingHours']), getTotalHours());
      if(i == index){
        newData[i]['items'] = Math.ceil(getNumItems(totalItems, newData[i]['allocation']));
      }
      else{
        if(newData[i]['items']%1 != 0){
        newData[i]['items'] = getNumItems(totalItems, newData[i]['allocation']);
      }
      if (newData[i]['remembering'] % 1 !== 0) {
        newData[i]['remembering'] = getRemembering(Remembering, newData[i]['items']);
      }
      
      if (newData[i]['understanding'] % 1 !== 0) {
        newData[i]['understanding'] = getUnderstanding(Understanding, newData[i]['items']);
      }
      
      if (newData[i]['applying'] % 1 !== 0) {
        newData[i]['applying'] = getApplying(Applying, newData[i]['items']);
      }
      
      if (newData[i]['analyzing'] % 1 !== 0) {
        newData[i]['analyzing'] = getAnalyzing(Analyzing, newData[i]['items']);
      }
      
      if (newData[i]['evaluating'] % 1 !== 0) {
        newData[i]['evaluating'] = getEvaluating(Evaluating, newData[i]['items']);
      }
      
      if (newData[i]['creating'] % 1 !== 0) {
        newData[i]['creating'] = getCreating(Creating, newData[i]['items']);
      }
      newData[i]['total'] = getTotal(
        newData[i]['remembering'],
        newData[i]['understanding'],
        newData[i]['applying'],
        newData[i]['analyzing'],
        newData[i]['evaluating'],
        newData[i]['creating']
      );

      newData[i]['placement'] = getPlacement(newData[i]['total'], placements);
      newData[i]['totalItems'] = totalItems;
    }
  }
}

  if (field === 'remembering' ) {
    for (let i = 0; i < newData.length; i++) {
      // Recalculate fields based on the updated teachingHours
      if(i == index){
        newData[i]['remembering'] = Math.ceil(getRemembering(Remembering, newData[i]['items']));
        console.log('indexremember: ',index)
     
      }
      else{
        if (newData[i]['remembering'] % 1 !== 0) {
          newData[i]['remembering'] = getRemembering(Remembering, newData[i]['items']);
        }
        
      }
     
      if (newData[i]['understanding'] % 1 !== 0) {
        newData[i]['understanding'] = getUnderstanding(Understanding, newData[i]['items']);
      }
      
      if (newData[i]['applying'] % 1 !== 0) {
        newData[i]['applying'] = getApplying(Applying, newData[i]['items']);
      }
      
      if (newData[i]['analyzing'] % 1 !== 0) {
        newData[i]['analyzing'] = getAnalyzing(Analyzing, newData[i]['items']);
      }
      
      if (newData[i]['evaluating'] % 1 !== 0) {
        newData[i]['evaluating'] = getEvaluating(Evaluating, newData[i]['items']);
      }
      
      if (newData[i]['creating'] % 1 !== 0) {
        newData[i]['creating'] = getCreating(Creating, newData[i]['items']);
      }
      newData[i]['total'] = getTotal(
        newData[i]['remembering'],
        newData[i]['understanding'],
        newData[i]['applying'],
        newData[i]['analyzing'],
        newData[i]['evaluating'],
        newData[i]['creating']
      );

      newData[i]['placement'] = getPlacement(newData[i]['total'], placements);
      newData[i]['totalItems'] = totalItems;
    }
  }

  
  if (field === 'understanding' ) {
    for (let i = 0; i < newData.length; i++) {
      // Recalculate fields based on the updated teachingHours
      if(i == index){
        newData[i]['understanding'] = Math.ceil(getUnderstanding(Understanding, newData[i]['items']));
     
      }
      else{
        if (newData[i]['understanding'] % 1 !== 0) {
          newData[i]['understanding'] = getUnderstanding(Understanding, newData[i]['items']);
        }
      }
      
    
     
      
      if (newData[i]['applying'] % 1 !== 0) {
        newData[i]['applying'] = getApplying(Applying, newData[i]['items']);
      }
      
      if (newData[i]['analyzing'] % 1 !== 0) {
        newData[i]['analyzing'] = getAnalyzing(Analyzing, newData[i]['items']);
      }
      
      if (newData[i]['evaluating'] % 1 !== 0) {
        newData[i]['evaluating'] = getEvaluating(Evaluating, newData[i]['items']);
      }
      
      if (newData[i]['creating'] % 1 !== 0) {
        newData[i]['creating'] = getCreating(Creating, newData[i]['items']);
      }
      newData[i]['total'] = getTotal(
        newData[i]['remembering'],
        newData[i]['understanding'],
        newData[i]['applying'],
        newData[i]['analyzing'],
        newData[i]['evaluating'],
        newData[i]['creating']
      );

      newData[i]['placement'] = getPlacement(newData[i]['total'], placements);
      newData[i]['totalItems'] = totalItems;
    }
  }

  if (field === 'applying' ) {
    for (let i = 0; i < newData.length; i++) {
      // Recalculate fields based on the updated teachingHours
      if(i == index){
        newData[i]['applying'] = Math.ceil(getApplying(Applying, newData[i]['items']));
     
      }
      else{
        if (newData[i]['applying'] % 1 !== 0) {
          newData[i]['applying'] = getApplying(Applying, newData[i]['items']);
        }
      }
      
   
      
      if (newData[i]['analyzing'] % 1 !== 0) {
        newData[i]['analyzing'] = getAnalyzing(Analyzing, newData[i]['items']);
      }
      
      if (newData[i]['evaluating'] % 1 !== 0) {
        newData[i]['evaluating'] = getEvaluating(Evaluating, newData[i]['items']);
      }
      
      if (newData[i]['creating'] % 1 !== 0) {
        newData[i]['creating'] = getCreating(Creating, newData[i]['items']);
      }
      newData[i]['total'] = getTotal(
        newData[i]['remembering'],
        newData[i]['understanding'],
        newData[i]['applying'],
        newData[i]['analyzing'],
        newData[i]['evaluating'],
        newData[i]['creating']
      );

      newData[i]['placement'] = getPlacement(newData[i]['total'], placements);
      newData[i]['totalItems'] = totalItems;
    }
  }

  if (field === 'analyzing' ) {
    for (let i = 0; i < newData.length; i++) {
      // Recalculate fields based on the updated teachingHours
      if(i == index){
        newData[i]['analyzing'] = Math.ceil(getAnalyzing(Analyzing, newData[i]['items']));
     
      }
      else{
        if (newData[i]['analyzing'] % 1 !== 0) {
          newData[i]['analyzing'] = getAnalyzing(Analyzing, newData[i]['items']);
        }
      }
         
     
      
      if (newData[i]['evaluating'] % 1 !== 0) {
        newData[i]['evaluating'] = getEvaluating(Evaluating, newData[i]['items']);
      }
      
      if (newData[i]['creating'] % 1 !== 0) {
        newData[i]['creating'] = getCreating(Creating, newData[i]['items']);
      }
      newData[i]['total'] = getTotal(
        newData[i]['remembering'],
        newData[i]['understanding'],
        newData[i]['applying'],
        newData[i]['analyzing'],
        newData[i]['evaluating'],
        newData[i]['creating']
      );

      newData[i]['placement'] = getPlacement(newData[i]['total'], placements);
      newData[i]['totalItems'] = totalItems;
    }
  }


  if (field === 'evaluating' ) {
    for (let i = 0; i < newData.length; i++) {
      // Recalculate fields based on the updated teachingHours
      if(i == index){
        newData[i]['evaluating'] = Math.ceil(getEvaluating(Evaluating, newData[i]['items']));
     
      }
      else{
        if (newData[i]['evaluating'] % 1 !== 0) {
          newData[i]['evaluating'] = getEvaluating(Evaluating, newData[i]['items']);
        }
      }
       
    
      
      if (newData[i]['creating'] % 1 !== 0) {
        newData[i]['creating'] = getCreating(Creating, newData[i]['items']);
      }
      
      newData[i]['total'] = getTotal(
        newData[i]['remembering'],
        newData[i]['understanding'],
        newData[i]['applying'],
        newData[i]['analyzing'],
        newData[i]['evaluating'],
        newData[i]['creating']
      );

      newData[i]['placement'] = getPlacement(newData[i]['total'], placements);
      newData[i]['totalItems'] = totalItems;
    }
  }

  if (field === 'creating' ) {
    for (let i = 0; i < newData.length; i++) {
      // Recalculate fields based on the updated teachingHours
      if(i == index){
        newData[i]['creating'] = Math.ceil(getCreating(Creating, newData[i]['items']));
        console.log('indexcreate: ',index,' : ', Math.ceil(getCreating(Creating, newData[i]['items'])),' : ', newData[i]['creating'])
     
      }
      else{
        if (newData[i]['creating'] % 1 !== 0) {
          console.log('olddatacreate: ',newData[i]['creating']);
          newData[i]['creating'] = getCreating(Creating, newData[i]['items']);
        }
      }
  
      newData[i]['total'] = getTotal(
        newData[i]['remembering'],
        newData[i]['understanding'],
        newData[i]['applying'],
        newData[i]['analyzing'],
        newData[i]['evaluating'],
        newData[i]['creating']
      );

      newData[i]['placement'] = getPlacement(newData[i]['total'], placements);
      newData[i]['totalItems'] = totalItems;
    }
  }


  // Update the state with the new data
  setLessonsDatainitial(newData);

  // Save the updated lessonsData to localStorage
  localStorage.setItem('lessonsData', JSON.stringify(newData));
};

  function inputModal(indexRow,lessonsData){
    if(lessonsData[indexRow] === undefined){
      return ''
    }
    else{
      return(
      <Modal size={'7xl'} show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Lesson {indexRow+1} {configTotal}</Modal.Header>
      <Modal.Body>
        <div className="space-y-6 " >
          <div className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
           

      <div className="flex gap-5">  
         <div style={{flex:1}} className="flex flex-col">
          <Card className="h-full">
        <div className="mb-5 flex-1">
       
      <div className="mb-2 block">
        <Label htmlFor={`topic-${indexRow}`} value="Lesson/Topic Summary" />
      </div>
      <Textarea
        id={`topic-${indexRow}`}
        value={lessonsData[indexRow]['topic']}
       style={{height:'100%'}}
        onChange={(e) => handleLessonDataChange(indexRow, 'topic', e.target.value)}
        required
      />
    </div>
    <div className="mb-3 flex-1">
      <div className="mb-2 block">
        <Label htmlFor={`learning_outcomes-${indexRow}`} value="Learning Outcomes" />
      </div>
      <Textarea
        id={`learning_outcomes-${indexRow}`}
        value={lessonsData[indexRow]['learning_outcomes']}
        style={{height:'100%'}}
        onChange={(e) => handleLessonDataChange(indexRow, 'learning_outcomes', e.target.value)}
        required
      />
      
    </div>
    
    <div className="flex-1">
    <div>
      <div className="mb-2 block">
        <Label htmlFor="file-upload" value="Upload file" />
      </div>
      <FileInput id="file-upload"
       accept="application/pdf"
      
       onChange={(e) => handleLessonDataChange(indexRow, 'study_guide', e.target.files[0])}
      />
      {/* {lessonsDataInitial[indexRow] && lessonsDataInitial[indexRow]['study_guide'] && (
    <p>Selected file: {String(lessonsDataInitial[indexRow]['study_guide'])}</p>  // Display the selected file name
  )} */}
    </div>
    </div>
    </Card>
    </div>
    <div style={{flex:1}}>
      <Card>
    <div className="mb-4">
      <div className="mb-2 block">
        <Label htmlFor={`teaching_hours-${indexRow}`} value="No. of Teaching Hours" />
      </div>
      <TextInput
      min={0}
        id={`teaching_hours-${indexRow}`}
        type="number"
        style={{maxWidth:'200px'}}
        value={lessonsData[indexRow]['teachingHours']}
        onChange={(e) => handleLessonDataChange(indexRow, 'teachingHours', e.target.value)}
        required
      />
    </div>

    <div className="mb-3 flex" style={{borderBottomStyle:'solid',borderBottomWidth:1}}>
  <div className="mb-2 block flex-1">
    <Label htmlFor={`teaching_hours-${indexRow}`} value="% of Allocation" />
  </div>
  <span className=" flex-1 text-right text-black">
    {lessonsData[indexRow]['allocation']}%
  </span>
  <span className="text-right text-black font-bold" style={{flex: 0.2}}>
    {/* Additional data if needed */}
  </span>
</div>

<div className="mb-3 flex" style={{borderBottomStyle:'solid',borderBottomWidth:1}}>
  <div className="mb-2 block flex-1">
    <Label htmlFor={`teaching_hours-${indexRow}`} value="Number of Items" />
    <div className="flex gap-3 px-3">
      <Button color={'failure'} size={'xs'} onClick={(e) => handleFloor(indexRow, 'items', lessonsData[indexRow]['items'])}><ArrowDownwardIcon /> <span className="mt-1">floor</span></Button>
      <Button color={'primary'} size={'xs'} onClick={(e) => handleCeil(indexRow, 'items', lessonsData[indexRow]['items'])}><ArrowUpwardIcon/> <span className="mt-1">ceil</span></Button>

    </div>
  </div>
  <span className=" flex-1 text-right text-black">
    {/* Additional percentage or related info if needed */}
  </span>
  <span className="text-right text-black font-bold" style={{flex: 0.2}}>
    {lessonsData[indexRow]['items']}
  </span>
</div>


    <div className="mb-3 flex" style={{borderBottomStyle:'solid',borderBottomWidth:1}}>
      <div className="mb-2 block flex-1">
        <Label htmlFor={`teaching_hours-${indexRow}`} value={`Knowledge/Remembering `} />
        <div className="flex gap-3 px-3">
        <Button color={'failure'} size={'xs'} onClick={(e) => handleFloor(indexRow, 'remembering', lessonsData[indexRow]['remembering'])}><ArrowDownwardIcon /> <span className="mt-1">floor</span></Button>
        <Button color={'primary'} size={'xs'} onClick={(e) => handleCeil(indexRow, 'remembering', lessonsData[indexRow]['remembering'])}><ArrowUpwardIcon/> <span className="mt-1">ceil</span></Button>

    </div>
        
      </div>
      <span className=" flex-1 text-right text-black">
        {Remembering}%
      </span>
      <span className=" text-right text-black font-bold" style={{flex:0.2}}>
    {lessonsData[indexRow]['remembering']}
    </span>
   
    </div>

    <div className="mb-3 flex" style={{borderBottomStyle:'solid',borderBottomWidth:1}}>
  <div className="mb-2 block flex-1">
    <Label htmlFor={`teaching_hours-${indexRow}`} value={`Comprehension/Understanding`} />
    <div className="flex gap-3 px-3">
        <Button color={'failure'} size={'xs'} onClick={(e) => handleFloor(indexRow, 'understanding', lessonsData[indexRow]['understanding'])}><ArrowDownwardIcon /> <span className="mt-1">floor</span></Button>
        <Button color={'primary'} size={'xs'} onClick={(e) => handleCeil(indexRow, 'understanding', lessonsData[indexRow]['understanding'])}><ArrowUpwardIcon/> <span className="mt-1">ceil</span></Button>

    </div>
  </div>
  <span className=" flex-1 text-right text-black">
    {Understanding}%
  </span>
  <span className="text-right text-black font-bold" style={{flex: 0.2}}>
    {lessonsData[indexRow]['understanding']}
  </span>
</div>

<div className="mb-3 flex" style={{borderBottomStyle:'solid',borderBottomWidth:1}}>
  <div className="mb-2 block flex-1">
    <Label htmlFor={`teaching_hours-${indexRow}`} value={`Application/Applying`} />
    <div className="flex gap-3 px-3">
        <Button color={'failure'} size={'xs'} onClick={(e) => handleFloor(indexRow, 'applying', lessonsData[indexRow]['applying'])}><ArrowDownwardIcon /> <span className="mt-1">floor</span></Button>
        <Button color={'primary'} size={'xs'} onClick={(e) => handleCeil(indexRow, 'applying', lessonsData[indexRow]['applying'])}><ArrowUpwardIcon/> <span className="mt-1">ceil</span></Button>

    </div>
  </div>
  <span className=" flex-1 text-right text-black">
    {Applying}%
  </span>
  <span className="text-right text-black font-bold" style={{flex: 0.2}}>
    {lessonsData[indexRow]['applying']}
  </span>
</div>

<div className="mb-3 flex" style={{borderBottomStyle:'solid',borderBottomWidth:1}}>
  <div className="mb-2 block flex-1">
    <Label htmlFor={`teaching_hours-${indexRow}`} value={`Analysis/Analyzing`} />
    <div className="flex gap-3 px-3">
        <Button color={'failure'} size={'xs'} onClick={(e) => handleFloor(indexRow, 'analyzing', lessonsData[indexRow]['analyzing'])}><ArrowDownwardIcon /> <span className="mt-1">floor</span></Button>
        <Button  color={'primary'} size={'xs'} onClick={(e) => handleCeil(indexRow, 'analyzing', lessonsData[indexRow]['analyzing'])}><ArrowUpwardIcon/> <span className="mt-1">ceil</span></Button>

    </div>
  </div>
  <span className=" flex-1 text-right text-black">
    {Analyzing}%
  </span>
  <span className="text-right text-black font-bold" style={{flex: 0.2}}>
    {lessonsData[indexRow]['analyzing']}
  </span>
</div>

<div className="mb-3 flex" style={{borderBottomStyle:'solid',borderBottomWidth:1}}>
  <div className="mb-2 block flex-1">
    <Label htmlFor={`teaching_hours-${indexRow}`} value={`Synthesis/Evaluating`} />
    <div className="flex gap-3 px-3">
        <Button color={'failure'} size={'xs'} onClick={(e) => handleFloor(indexRow, 'evaluating', lessonsData[indexRow]['evaluating'])}><ArrowDownwardIcon /> <span className="mt-1">floor</span></Button>
        <Button color={'primary'} size={'xs'} onClick={(e) => handleCeil(indexRow, 'evaluating', lessonsData[indexRow]['evaluating'])}><ArrowUpwardIcon/> <span className="mt-1">ceil</span></Button>

    </div>
  </div>
  <span className=" flex-1 text-right text-black">
    {Evaluating}%
  </span>
  <span className="text-right text-black font-bold" style={{flex: 0.2}}>
    {lessonsData[indexRow]['evaluating']}
  </span>
</div>

<div className="mb-3 flex" style={{borderBottomStyle:'solid',borderBottomWidth:1}}>
  <div className="mb-2 block flex-1">
    <Label htmlFor={`teaching_hours-${indexRow}`} value={`Evaluation/Creating`} />
    <div className="flex gap-3 px-3">
        <Button color={'failure'} size={'xs'} onClick={(e) => handleFloor(indexRow, 'creating', lessonsData[indexRow]['creating'])}><ArrowDownwardIcon /> <span className="mt-1">floor</span></Button>
        <Button color={'primary'} size={'xs'} onClick={(e) => handleCeil(indexRow, 'creating', lessonsData[indexRow]['creating'])}><ArrowUpwardIcon/> <span className="mt-1">ceil</span></Button>

    </div>
  </div>
  <span className=" flex-1 text-right text-black">
    {Creating}%
  </span>
  <span className="text-right text-black font-bold" style={{flex: 0.2}}>
    {lessonsData[indexRow]['creating']}
  </span>
</div>


<div className="mb-3 flex" style={{borderBottomStyle:'solid',borderBottomWidth:1}}>
  <div className="mb-2 block flex-1">
    <Label htmlFor={`teaching_hours-${indexRow}`} value="Total" />
  </div>
  <span className=" flex-1 text-right text-black">
    {/* If there's a percentage or similar value, you can place it here */}
  </span>
  <span className="text-right text-black font-bold" style={{flex: 0.2}}>
    {lessonsData[indexRow]['total']}
  </span>
</div>

<div className="mb-3 flex" style={{borderBottomStyle:'solid',borderBottomWidth:1}}>
  <div className="mb-2 block flex-1">
    <Label htmlFor={`teaching_hours-${indexRow}`} value="Placement" />
  </div>
  <span className=" flex-1 text-right text-black">
    {/* If there's a percentage or similar value, you can place it here */}
  </span>
  <span className="text-right text-black font-bold" style={{flex: 0.3}}>
    {lessonsData[indexRow]['placement']}
  </span>
</div>
<Button color={'failure'} size={'xs'} onClick={(e) => handleReset(indexRow, 'reset')}><ArrowUpwardIcon/> <span className="mt-1">Reset</span></Button>
</Card>
    </div>

  
    
    </div>
    
    </div>
           
           </div>
         </Modal.Body>
         <Modal.Footer>
          <div className=" w-full ">
            <div className="mx-auto flex gap-5 justify-center">
            <Button color="failure" onClick={() => removeLesson(lessonsData,indexRow)}><RemoveCircleOutlineIcon className="mr-2"/>Remove Lesson</Button>
           <Button onClick={() => setOpenModal(false)}  color={'success'}>Done</Button>
           
           </div>
           </div>
         </Modal.Footer>
       </Modal>)
       
    }
  }





// Event handlers for each field
const handleTitle = (event) => {
 
  setTitle(event.target.value);
 

  const data = {
    Title: event.target.value,
    Semester,
    AcademicYear,
    Campus,
    CourseCode,
    Department,
    ExaminationType,
    CourseType,
    ExaminationDate,
    Faculty,
    Chairperson,
    Dean,
    Director,
  };

  localStorage.setItem('formData', JSON.stringify(data));
  
  
};

const options = ['Multiple Choice','Identification','True or False','Subjective','Any'];


  const [formData, setFormData] = useState({
    Title: '',
    Semester: '1st Semester',
    AcademicYear: '',
    Campus: 'San Carlos Campus',
    CourseCode: '',
    Department: 'Business and Office Administration',
    ExaminationType: [],
    CourseType: '',
    ExaminationDate: '',
    Faculty: '',
    Chairperson: '',
    Dean: '',
    Director: ''
  });


  const handleChange = (event) => {
    const { name, value } = event.target;
    const updatedFormData = {
      ...formData,
      [name]: value
    };
    setFormData(updatedFormData);
    localStorage.setItem('formData', JSON.stringify(updatedFormData));
  };


// Function to save all data to local storage

// Call this function to load data from local storage when the component mounts
const loadDataFromLocalStorage = () => {
  const storedData = localStorage.getItem('formData');
  if (storedData) {
    const data = JSON.parse(storedData);
    setFormData(data);
  }
};




// Use the effect hook to load data when the component mounts
useEffect(() => {
  loadDataFromLocalStorage();

 
}, []);



const [TestPart, setTestPart] = useState([]);
const [examStates, setExamStates] = useState([]);
const [ExamTitle, setExamTitle] = useState('');




// Function to save all data to local storage
const saveDataToLocalStorageExam = () => {
  const data = {
    ExamTitle,

    tos_id:0
  };

  localStorage.setItem('examData', JSON.stringify(data));
};

// Call this function to load data from local storage when the component mounts
const loadDataFromLocalStorageExam = () => {
  const storedData = localStorage.getItem('examData');
  if (storedData) {
    const data = JSON.parse(storedData);
    setExamTitle(data.ExamTitle || '');

  
  }
};

// Use the effect hook to load data when the component mounts
useEffect(() => {
  loadDataFromLocalStorageExam();
 
}, []);


for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);
  console.log(`${key}: ${value}`);
}




const handleExamTitleChange = (event) => {
  setExamTitle(event.target.value)
  const data = {
    ExamTitle: event.target.value,
    tos_id:0
  };

  localStorage.setItem('examData', JSON.stringify(data));
}


console.log('examData: ',localStorage.getItem('examData'))



const handleStateChange = (index, type, value) => {
  const newStates = [...examStates];
  if (type === 'question') {
    newStates[index]['question'] = value;
  }
  else if (type === 'context') {
    newStates[index]['context'] = value;
  }
  else {
    
    newStates[index]['choices'][type] = value;
  }
  setExamStates(newStates);
  saveDataToLocalStorageQuestion()

};






const handleTestPartChange = (index,type, value) => {
  const newStates = [...TestPart];
  if (type === 'test_type') {
    newStates[index]['test_type'] = value;
  } else {
    
    newStates[index]['test_instruction'] = value;
  }
  setTestPart(newStates);
  saveDataToLocalStorageTestPart()

};

const handleRadioAnswer = (index, value) => {
  const newStates = [...examStates];
 
    newStates[index]['answer'] = value;

  setExamStates(newStates);
  saveDataToLocalStorageQuestion()

};




useEffect(() => {
 
  setExamStates(
    Array.from({ length:examStates.length }, () => ({
      question: '',
      choices: ['', '', '', ''],
      question_type:'',
      answer: '',
      context: ''
    }))
  );


  setTestPart(
    Array.from({ length:TestPart.length }, () => ({
      test_type: '',
      test_instruction: '',
      test_part_num:'',
    }))
  );

    loadDataFromLocalStorageQuestion()
    loadDataFromLocalStorageTestPart()
  
 

}, [totalItems, exam_id]);






const saveDataToLocalStorageQuestion = () => {
  const data = examStates

  localStorage.setItem('questionData', JSON.stringify(data));
};


const saveDataToLocalStorageTestPart = () => {
  const data = TestPart

  localStorage.setItem('testpartData', JSON.stringify(data));
};

// Call this function to load data from local storage when the component mounts
const loadDataFromLocalStorageQuestion = () => {
  const storedData = localStorage.getItem('questionData');
 
  if (storedData) {
    const data = JSON.parse(storedData);
   
    setExamStates(data || []);
    
  
  }
};

const loadDataFromLocalStorageTestPart = () => {
  const storedData = localStorage.getItem('testpartData');
 
  if (storedData) {
    const data = JSON.parse(storedData);
   
    setTestPart(data || []);
    
  
  }
};

console.log('examState:',localStorage.getItem('questionData'))
console.log('Examsss2:',examStates)


console.log('TestPart:',localStorage.getItem('testpartData'))
console.log('Partsss:',TestPart)




const uploadFiles = async (data) => {


  const uploadPromises = files.map(async (lesson,index) => {
    const formDatapdf = new FormData();

    // Check if the study_guide is a valid file
    if (lesson) {
      console.log('studyguideeee: ', lesson);
      formDatapdf.append('study_guide', lesson); // Ensure this is a valid file object
      formDatapdf.append('tos_content', data[index]); 
      console.log('FormData for upload:', data[index]);

      try {
        const response = await api.post('/api/upload/', formDatapdf, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Upload successful:', response.data);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    } else {
      console.warn('No valid file to upload for lesson:', lesson);
    }
  });

  // Wait for all uploads to complete
  await Promise.all(uploadPromises);
  console.log('All uploads completed.');
};




const formDataStorage = localStorage.getItem('formData');
const formData1 = formDataStorage ? JSON.parse(formDataStorage) : null;

const examDataStorage = localStorage.getItem('examData');
const examData = examDataStorage ? JSON.parse(examDataStorage) : null;


const [Submit,setSubmit] = useState(false);
const handleSubmit = (e) => {
  formData1.ExaminationType = formData1.ExaminationType.join('/');
  setLoading(true);
  formData1.Status = Submit===true?1:0
  const formDataJson = JSON.stringify(formData1);


  console.log('formSubmit: ',formDataJson)

  let id_tos = 0
 
  e.preventDefault();

  api.post("/api/tos-info/", { formDataJson })
    .then((firstRes) => {
      console.log(firstRes);  // Log the entire response to see its structure
      if (firstRes.status === 201) {
        const id = firstRes.data[0].id;  // Assuming the ID is in the data of the response
        id_tos = id
        
        console.log("ID of the first request: " + id);
        
        const updatedLessonsData = lessonsData.map((lesson) => {
          // Update the lesson object as needed, for example:
          lesson.teacher_tos = id; // or any other modification
          
          return lesson;
        });
        const lessonsDataJson = JSON.stringify(updatedLessonsData);

        

        



return api.post("/api/tos-content/", { lessonsDataJson })
  .then((secondRes) => {
    console.log('secondres: ',secondRes.data)
    if (secondRes.status === 201) {
      const ids = secondRes.data.reduce((acc, item) => {
        // Assuming each item in secondRes.data has an `id` property
        acc.push(item.id); // Add each ID to the accumulator (array)
        return acc;
      }, []); // Initialize the accumulator as an empty array
      
      console.log('All IDs:', ids);
      
     
      uploadFiles(ids);

 
      console.log("Second request data:", secondRes.data);

      // Third request example
      const examData =  {
        exam_title: ExamTitle,
        tos_id: id_tos
      };

      const examDataJson = JSON.stringify(examData)
      console.log('examrequest:', examDataJson)
      return api.post("/api/create-exams/", {examDataJson})
      .then((TestPartRes) => { //third
        console.log(TestPartRes);
        if (TestPartRes.status === 201) {
          
     
         
          console.log("testpart request data:", TestPartRes.data);
          const exam_id = TestPartRes.data[0].id
          console.log("exam_id: ",exam_id)
    
          // Third request example
          const itemTestPart = TestPart.reduce((acc,data,index) =>{

            if(data.question != '' && data.answer != ''){
              acc.push( {
                'test_type': data.test_type,
                'test_instruction': data.test_instruction,
                'test_part_num': data.test_part_num,
                'exam_id': exam_id
              })
            }
          
            return acc
          }, [])
    
          const itemTestPartJson = JSON.stringify(itemTestPart)
          console.log('examrequest:', itemTestPartJson)
          return api.post("/api/create-testpart/", {itemTestPartJson})
          
      .then((thirdRes) => { //third
        console.log(thirdRes);
        if (thirdRes.status === 201) {
          
     
         
          console.log("third request data:", thirdRes.data);
          const exam_id = thirdRes.data[0].exam_id
         

          console.log('testpartid: ', thirdRes)
          console.log("exam_id: ",exam_id)
    
          let test_part_id = 0
          // Third request example
          const itemQuestion = examStates.reduce((acc,data,index) =>{


           
            console.log("partnum: ",data.test_part_num)
            console.log("partnum2: ",thirdRes.data[0].test_part_num)
            for(let i = 0; i<thirdRes.data.length;i++){
              if(thirdRes.data[i].test_part_num === data.test_part_num){
                test_part_id = thirdRes.data[i].id
                console.log("testpartidd: ",test_part_id,' : ' ,thirdRes.data[i].id)
                
              }
              
            }

            

            if(data.question != ''){
              acc.push( {
                'question': data.question,
                'answer': data.answer||'subjective',
                'question_type': data.question_type,
                'exam_id': exam_id,
                'test_part_id': test_part_id,
                'context': data.context
              })
            }
          
            return acc
          }, [])
    
          const itemQuestionJson = JSON.stringify(itemQuestion)
          console.log('examrequest:', itemQuestionJson)
          return api.post("/api/create-questions/", {itemQuestionJson})
          .then((fourthRes) => {
            console.log(fourthRes);
            if (fourthRes.status === 201) {


        
          
              console.log("fourth request data:", fourthRes.data);
              const question_data = fourthRes.data
              console.log("question_id: ",question_data)

              const ques_len = question_data.length;
              console.log('lengthques', ques_len);

                let ques_ids = question_data.reduce((accu, data) => {
                  accu.push(data.id);
                  return accu;
                }, []);
              console.log('quesids',ques_ids)

              let itemAnswers =  examStates.reduce((acc,data,index) =>{

                 
                  const answers = ['A','B','C','D']
                  
                  for(let i = 0; i< 4; i++){
                    if(data.choices[i] != '' && data.answer != ''){
                      acc.push({
                        'answer_text': data.choices[i]||'none',
                        'choices': answers[i],
                        'question_id': ques_ids[index]
                      });
                    }
                  }
             
                  return acc
                }, [])

              

               
          

              console.log('itemAnswers: ',itemAnswers)
        
              // fourth request example
         
        
              const itemAnswersJson = JSON.stringify(itemAnswers)
      
              return api.post("/api/create-answers/", {itemAnswersJson}).then(()=>{

                localStorage.setItem('lessonsData',JSON.stringify([{  
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
                totalItems:0,
                tos_teacher: 0,
                }]));
                  
                
                setTotalItems(0)
                localStorage.setItem('totalItems', 0);
                setRemembering(0)
                setUnderstanding(0)
                setAnalyzing(0)
                setApplying(0)
                setEvaluating(0)
                setCreating(0)
                setExamTitle('')
             
                setExamStates([])
                setContext([])
                setTestPart([])
                localStorage.removeItem('Remembering')
                localStorage.removeItem('Understanding')
                localStorage.removeItem('Analyzing')
                localStorage.removeItem('Applying')
                localStorage.removeItem('Evaluating')
                localStorage.removeItem('Creating')
                localStorage.removeItem('formData')
                localStorage.removeItem('testpartData')
                loadDataFromLocalStorage()
                setFormData({
                  Title: '',
                  Semester: '1st Semester',
                  AcademicYear: '',
                  Campus: 'San Carlos Campus',
                  CourseCode: '',
                  Department: 'Business and Office Administration',
                  ExaminationType: [],
                  CourseType: '',
                  ExaminationDate: '',
                  Faculty: '',
                  Chairperson: '',
                  Dean: '',
                  Director: ''
                })
                localStorage.removeItem('examData')
                loadDataFromLocalStorageExam()
                localStorage.removeItem('questionData')
                loadDataFromLocalStorageQuestion()

        

           
                Submit===true?setSubmitToast(true):setToast(true)
                
                setStep(1)

            
              })
              
            } else {
              throw new Error("fourth request failed.");
            }
          });
    
          
        } else {
          throw new Error("Third request failed.");
        }
      });//third

    } else {
      throw new Error("Third request failed.");
    }
  });//third

    } else {
      throw new Error("Second request failed.");
    }
  });
} else {
throw new Error("First request failed.");
}
}).catch((err) => alert(err))
    .finally(() => setLoading(false));
};
const [step, setStep] = useState(1);

const [disableNext, setDisableNext] = useState(false);

const [disableBack, setDisableBack] = useState(false);

const handleNext = () => {
  setStep(step + 1);
};

const handleBack = () => {
  setStep(step - 1);
};


 useEffect (() =>{
  if(step === 1){
    setDisableBack(true)
  } 
  else{
    setDisableBack(false)
  }

  if(step === 4){
    setDisableNext(true)
  } 
  else{
    setDisableNext(false)
  }

  switch(step){
    case 1:
      if(formData.Title == '' || formData.AcademicYear == '' || formData.CourseCode == '' || formData.Faculty == ''|| formData.Chairperson == ''|| formData.Dean == ''|| formData.Director == ''){
        setDisableNext(true)
      }
      break
    case 2:
      if(getTotalTaxonomy!=100 || totalItems<10){
        setDisableNext(true)
      }
    
      break
  }
 



},[step,formData,getTotalTaxonomy,totalItems])


const handleSubmitExam = () =>{
  
  const updateStatus = {
    Status: 1
  };
  
  api
    .patch(`/api/tos-info/${id}/update/`, updateStatus)
    .then((res) => {
      console.log('Status updated', res.data);
      getUser(); // Refresh the user list
      setOpenModal(false); // Close the modal
    })
    .catch((err) => {
      console.error('Error status:', err);
    });
}


  return (
    <div >
<form onSubmit={handleSubmit}>
  
<Card className={`mb-5 ${step == 1? 'show':'hidden'}`} > 

<Breadcrumb aria-label="Default breadcrumb example">
      <Breadcrumb.Item onClick={()=>{setStep(1)}}>
      Course Information
      </Breadcrumb.Item>
      
    </Breadcrumb>
   
   <Progress progress={25} size={'sm'} color={'primary'}/>
   
   <Card className=' mx-auto ' >
    
     <div className='w-full gap-4'>


       {/* Title and Semester */}
       <div className='w-full gap-4 flex flex-col sm:flex-row'>
         <div className='w-full'>
           <div className="mb-2 block">
             <Label htmlFor="title" value="Title" />
           </div>
           <TextInput id="title" type="text" name="Title" value={formData.Title} onChange={handleChange} />
           
         </div>
         <div className="w-full">
           <div className="mb-2 block">
             <Label htmlFor="semester" value="Semester" />
           </div>
           <Select id="semester" name="Semester" value={formData.Semester} onChange={handleChange} color={'gray'} required>
         
             <option value="1st Semester">1st Semester</option>
             <option value="2nd Semester">2nd Semester</option>
         
           </Select>
         </div>
       </div>
   

       {/* Academic Year and Campus */}
       <div className='w-full gap-4 flex flex-col sm:flex-row'>
         <div className="w-full">
           <div className="mb-2 block">
             <Label htmlFor="Academic-year" value="Academic Year" />
           </div>
           <TextInput id="title" type="text" name="AcademicYear" value={formData.AcademicYear} onChange={handleChange} />
         </div>
     
         <div className="w-full">
           <div className="mb-2 block">
             <Label htmlFor="campus" value="Campus" />
           </div>
           <Select id="campus" name="Campus" value={formData.Campus} onChange={handleChange} required>
             <option value="San Carlos Campus">San Carlos Campus</option>
             <option value="Lingayen Campus">Lingayen Campus</option>
           </Select>
         </div>
       </div>

       {/* Course Code and Department */}
       <div className='w-full gap-4 flex flex-col sm:flex-row'>
         <div className='w-full'>
           <div className="mb-2 block">
             <Label htmlFor="course-code" value="Course Code" />
           </div>
           <TextInput id="course-code" type="text" name="CourseCode" value={formData.CourseCode} onChange={handleChange} />
         </div>
         <div className="w-full">
           <div className="mb-2 block">
             <Label htmlFor="department" value="Department" />
           </div>
           <Select id="department" name="Department" value={formData.Department} onChange={handleChange} required>
             <option value=" Business and Office Administration"> Business and Office Administration</option>
             <option value="Mathematics">Mathematics</option>
             <option value="Physics">Physics</option>
             <option value="Chemistry">Chemistry</option>
           </Select>
         </div>
       </div>

       {/* Type of Examination and Course Type */}
       <div className='w-full gap-4 flex flex-col sm:flex-row'>
         <div className="w-full ">
   
<div className="mb-2 block">
           <Label htmlFor="executive-director" value="Campus Executive Director" />
         </div>
         <TextInput id="executive-director" type="text" name="Director" value={formData.Director} onChange={handleChange} />
   
         </div>
         <div className='w-full'>
           <div className="mb-2 block">
             <Label htmlFor="course-type" value="Course Type" />
           </div>
           <TextInput id="course-type" type="text" name="CourseType" value={formData.CourseType} onChange={handleChange} />
         </div>
       </div>

       <div className='w-full gap-4 flex flex-col sm:flex-row'>
       {/* Date of Examination */}
       <div className='w-full'>
         <div className="mb-2 block">
           <Label htmlFor="exam-date" value="Date of Examination" />
         </div>
         <TextInput id="exam-date" type="date" name="ExaminationDate" value={formData.ExaminationDate} onChange={handleChange} />
       </div>

       {/* Faculty */}
       <div className='w-full'>
         <div className="mb-2 block">
           <Label htmlFor="faculty" value="Faculty" />
         </div>
         <TextInput id="faculty" type="text" name="Faculty" value={formData.Faculty} onChange={handleChange} />
       </div>
       </div>

       <div className='w-full gap-4 flex flex-col sm:flex-row'>
       {/* Department Chairperson */}
       <div className='w-full'>
         <div className="mb-2 block">
           <Label htmlFor="chairperson" value="Department Chairperson" />
         </div>
         <TextInput id="chairperson" type="text" name="Chairperson" value={formData.Chairperson} onChange={handleChange} />
       </div>

       {/* College Dean */}
       <div className='w-full'>
         <div className="mb-2 block">
           <Label htmlFor="dean" value="College Dean" />
         </div>
         <TextInput id="dean" type="text" name="Dean" value={formData.Dean} onChange={handleChange} />
       </div>
       </div>

       {/* Campus Executive Director */}
       <div className=' my-3'>
       <div className="mb-2 block">
             <Label htmlFor="exam-type" value="Type of Examination" />
           </div>
           <Autocomplete
      multiple
      id="chip-selection"
      name="ExaminationType"
      options={options} // List of options
      value={formData.ExaminationType}
      onChange={(event, newValue) => {
        setFormData({ ...formData, ExaminationType: newValue });
        localStorage.setItem('formData', JSON.stringify({ ...formData, ExaminationType: newValue }));
      }}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            variant="outlined"
            label={option}
            {...getTagProps({ index })}
            key={index}
          />
        ))
      }
      renderInput={(params) => (
        <TextField {...params} variant="outlined" label="Select type of examination" />
      )}
    />

       </div>
     </div>
     {/* <button className='bg-blue-950 hover:bg-blue-800 py-2 text-white rounded-lg'>Next</button> */}

  
   </Card>
   {inputModal(indexRow,lessonsData)}
</Card>

  
       
         
       

  
      <Card className={`mb-5 ${step == 2? 'show':'hidden'}`}>
      <Breadcrumb aria-label="Default breadcrumb example">
      <Breadcrumb.Item onClick={()=>{setStep(1)}} className="cursor-pointer">
      Course Information
      </Breadcrumb.Item>
      <Breadcrumb.Item >
      Taxonomy Allocation
      </Breadcrumb.Item>
      
    </Breadcrumb>
   
   <Progress progress={50} size={'sm'} color={'primary'} />
   
   <br />
   <Learning_outcomes 
        setRemembering={setRemembering} 
        setUnderstanding={setUnderstanding}
        setAnalyzing={setAnalyzing}
        setApplying={setApplying}
        setEvaluating={setEvaluating}
        setCreating={setCreating}
        setTotalTaxonomy={setTotalTaxonomy} 
        getTotalTaxonomy={getTotalTaxonomy} 
      />
<div className="flex gap-3"> 
        <div className=" max-w-md">
      <div>
        <div className="mb-2 block">
          <Label htmlFor="totalItems" value="Total of Items" />
        </div>
        <TextInput id="totalItems" type="number" required value={totalItems} onChange={handleTotalItemsChange} />
      </div>
      {/* {placements} */}

      {/* <div className="mb-3">
        <div className="mb-2 block">
          <Label htmlFor="numLesson" value="Number of Lesson" />
        </div>
        <TextInput id="numLesson" type="number" required value={lesson} onChange={handleLessonChange} />
      </div> */}
      </div>

      <Card className=" gap-4 mb-5  w-full p-3"> 
      <div>
        <div className="flex gap-3">
        <div className="mt-2 block w-32">
          <Label htmlFor="md-range" value="Remembering" />
        </div>
        <RangeSlider id="md-range" sizing="md" className="mt-2 w-full" value={Remembering} onChange={handleRememberingChange} />
        <div className="flex">
        <input type="number" className="border-0 border-b-2 border-black w-10 bg-transparent focus:outline-none p-0" value={Remembering}  onChange={handleRememberingChange} /><span className="mt-2">%</span>
        </div>
        </div>
      </div>


      <div>
        <div className="flex gap-3">
        <div className="mt-2 block w-32">
          <Label htmlFor="md-range" value="Understanding" />
        </div>
        <RangeSlider id="md-range" sizing="md" className="mt-2 w-full" value={Understanding} onChange={handleUnderstandingChange} />
        <div className="flex">
        <input type="number" className="border-0 border-b-2 border-black w-10 bg-transparent focus:outline-none p-0" value={Understanding}  onChange={handleUnderstandingChange} /><span className="mt-2">%</span>
        </div>
        </div>
      </div>


      <div>
        <div className="flex gap-3">
        <div className="mt-2 block w-32">
          <Label htmlFor="md-range" value="Applying" />
        </div>
        <RangeSlider id="md-range" sizing="md" className="mt-2 w-full" value={Applying} onChange={handleApplyingChange} />
        <div className="flex">
        <input type="number" className="border-0 border-b-2 border-black w-10 bg-transparent focus:outline-none p-0" value={Applying}  onChange={handleApplyingChange} /><span className="mt-2">%</span>
        </div>
        </div>
      </div>


      <div>
        <div className="flex gap-3">
        <div className="mt-2 block w-32">
          <Label htmlFor="md-range" value="Analyzing" />
        </div>
        <RangeSlider id="md-range" sizing="md" className="mt-2 w-full" value={Analyzing} onChange={handleAnalyzingChange} />
        <div className="flex">
        <input type="number" className="border-0 border-b-2 border-black w-10 bg-transparent focus:outline-none p-0" value={Analyzing}  onChange={handleAnalyzingChange} /><span className="mt-2">%</span>
        </div>
        </div>
      </div>



      <div>
        <div className="flex gap-3">
        <div className="mt-2 block w-32">
          <Label htmlFor="md-range" value="Evaluating" />
        </div>
        <RangeSlider id="md-range" sizing="md" className="mt-2 w-full" value={Evaluating} onChange={handleEvaluatingChange} />
        <div className="flex">
        <input type="number" className="border-0 border-b-2 border-black w-10 bg-transparent focus:outline-none p-0" value={Evaluating}  onChange={handleEvaluatingChange} /><span className="mt-2">%</span>
        </div>
        </div>
      </div>


      <div>
        <div className="flex gap-3">
        <div className="mt-2 block w-32">
          <Label htmlFor="md-range" value="Creating" />
        </div>
        <RangeSlider id="md-range" sizing="md" className="mt-2 w-full" value={Creating} onChange={handleCreatingChange} />
        <div className="flex">
        <input type="number" className="border-0 border-b-2 border-black w-10 bg-transparent focus:outline-none p-0" value={Creating}  onChange={handleCreatingChange} /><span className="mt-2">%</span>
        </div>
        </div>
      </div>
      <hr  />
      <div className=" flex justify-between"> 
      <span className="max-w-96 mr-20">Total:</span>
      <span className="w-full text-center">
      <Progress
      
      progress={getTotalTaxonomy}
      progressLabelPosition="inside"
  
      color={'primary'}
    
      size="lg"
     
    />
   
      {checkTaxonomy(getTotalTaxonomy)} </span>
      <span className="max-w-96 ml-6 flex justify-end ">
        <div className="w-10 font-bold">
        {getTotalTaxonomy}%</div></span> 
      
      </div>
      </Card>

      </div>

       
      </Card>

      <Card className={`mb-5 ${step == 3? 'show':'hidden'}`}>
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
      
    </Breadcrumb>
   
   <Progress progress={75} size={'sm'} color={'primary'}/>
 
   <br />

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row,index) => (
                <TableRow role="checkbox" tabIndex={-1} key={index} >
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}  >
                        {column.format && typeof value === "number"
                          ? column.format(value)
                          : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
   
      </Paper>
      <div className="w-full">
        <div className="  w-full flex flex-wrap ">
     <div  className=" mt-3 flex gap-3   mx-auto">
      <Button color={'primary'}  onClick={() => addLesson({  
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
      totalItems:0,})}> <AddCircleOutlineIcon className="mr-2 "/>Add Lesson</Button>

     

      <Button color="blue" onClick={() => setPdfModal(true)}><VisibilityIcon className="mr-2"/>Preview</Button>

 
      </div>
      </div>
      </div>

      <Modal show={PdfModal} size={'7xl'}  onClose={() => setPdfModal(false)} className="h-screen">
        <Modal.Header>Table of Specification</Modal.Header>
        <Modal.Body  className="p-0">
          <div className="min-h-96 "  style={{height:'575px'}}>
          <PDFViewer className="h-full w-full">
    <PdfFile lessonsData={lessonsDataInitial} Remembering={Remembering}  Analyzing={Analyzing} Understanding={Understanding} Applying={Applying} Evaluating={Evaluating} Creating={Creating}  formData={formData}/>
  </PDFViewer>
      
          </div>
        </Modal.Body>
      </Modal>
      </Card>

        <div className={`mb-5 ${step == 4? 'show':'hidden'}`}>
      <Examtest saveDataToLocalStorageTestPart={saveDataToLocalStorageTestPart} files={files} setExamTitle={setExamTitle} items={totalItems} tos_id={tos_id} lessonsData={lessonsData} examStates={examStates} setExamStates={setExamStates} handleStateChange={handleStateChange} ExamTitle={ExamTitle} handleExamTitleChange={handleExamTitleChange} handleRadioAnswer={handleRadioAnswer} TestPart={TestPart} setTestPart={setTestPart} handleTestPartChange={handleTestPartChange} saveDataToLocalStorageQuestion={saveDataToLocalStorageQuestion} setSubmit={setSubmit} setLoading={setLoadingGenerate} context={context} setContext={setContext} formData={formData}/>


    

      <div className="mt-3">

      </div>
      </div>
      </form>
      {submitToast  && <ToastMessage  message = "Exam created and submitted successfully!" setToast={setSubmitToast}/>}
      {Toast  && <ToastMessage  message = "Exam successfully created!" setToast={setToast} />}
      {loading  && <LoadingSubmit/>}
      {loadingGenerate  && <LoadingGenerate/>}
<div className="w-full justify-center mx-auto flex gap-14">
  <div>
   
<Button size={'sm'} color={'primary'} onClick={handleBack} disabled={disableBack} className="px-3"><NavigateBeforeIcon/> <p style={{marginTop:'0.5px'}}>Previous</p></Button>
</div>
<div>
 
      <Button size={'sm'}  color={'primary'} onClick={handleNext} disabled={disableNext} className="px-4" > <p style={{marginTop:'0.5px'}}>Next</p> <NavigateNextIcon  /></Button>
      
      </div>
      </div>
    </div>
  );
  
ReactDOM.render(<TOS />, document.getElementById('root'));
}

export default TOS
