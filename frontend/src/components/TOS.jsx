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
import Error from "./Error";
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
import RestoreIcon from '@mui/icons-material/Restore';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ErrorHandling from "./ErrorHandling";
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
  study_guide

  
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
    study_guide
   
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
file_status:'',
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
  const [loadingAllocate,setLoadingAllocate] = useState(false)

  const [files, setFiles] = useState([]); 
  const [context,setContext] = useState([])

  const [openModal, setOpenModal] = useState(false);

  const [submitToast,setSubmitToast] = useState(false);
  const[loadingGenerate,setLoadingGenerate] = useState(false)

  const [selectedOptions, setSelectedOptions] = useState([]);

  function roundNum(num) {
    if (num % 1 >= 0.3 && num % 1 <= 0.7) {
      return parseFloat(num.toFixed(2)); 
    }
    return parseFloat(num.toFixed(2)); 
   
  }
  
  function roundNumItems(num) {

    return parseFloat(num.toFixed(2)); 
   
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
    let result = (hours / totalHours) * 100;

    if (result % 1 >= 0.3 && result % 1 <= 0.7) {
      return parseFloat(result.toFixed(2)); 
    }
    return Math.round(parseFloat(result.toFixed(2))); 
   
  
  }


  const [course, setcourse] = useState([]);



  const getcourse = () => {
    api.get(`/api/courses/`)
      .then((res) => {
        setcourse(res.data);
        console.log('courses',res.data)
        
      })
      .catch((err) => {
        alert(err);
        
      });
  };
  useEffect(() => {
   
    getcourse();
  },[]);

function getTotalHours(){
 let hours= lessonsData.reduce((acc, data) => {
    return acc + Number(data.teachingHours);
  }, 0);



  return hours
}


function getNumItems(totalItems,allocation){
  const allocationDecimal = allocation / 100;
  return roundNumItems(totalItems * allocationDecimal)
 

}

function getRemembering(remembering,items){



  return roundNum((remembering/100)*items)
}

function getRoundRemembering(remembering,items,index){

  // let remembering = lessonsData[index]['remembering'];
  // let understanding = lessonsData[index]['understanding'];
  // let applying = lessonsData[index]['applying'];
  // let analyzing = lessonsData[index]['analyzing'];
  // let evaluating = lessonsData[index]['evaluating'];
  // let creating = lessonsData[index]['creating'];

  let total = lessonsData[index]['total'];
  let num = roundNum((remembering/100)*items)
  if(total > items && num % 1 == 0.5 ){
    return Math.floor(num)
  }
  return num
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
 const num = remembering+understanding+applying+analyzing+evaluating+creating
  return parseFloat(num.toFixed(2))
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

    
    }
    for (let i = 0; i < newData.length; i++) {

      let overall = 0
      let percent = 0
    
      for (let i = 0; i < newData.length; i++) {
          overall += newData[i]['items']
      }

      for (let i = 0; i < newData.length; i++) {
        percent += newData[i]['allocation']
    }

    if(percent<100){
      newData[i]['allocation'] = Math.ceil(newData[i]['allocation']);
    }
    else if(percent>100){
      newData[i]['allocation'] = Math.floor(newData[i]['allocation']);
    }
    else if(percent==100){
      newData[i]['allocation'] = Math.round(newData[i]['allocation']);
    }




    
      console.log('overall: ',overall)
    
      if(overall<totalItems){
        newData[i]['items'] = Math.ceil(newData[i]['items']);
        if(newData[i]['items'] == newData[i]['total'] && !Number.isInteger(newData[i]['remembering'])){
          newData[i]['remembering'] = Math.round(newData[i]['remembering']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
        else if(newData[i]['items'] < newData[i]['total']){
          newData[i]['remembering'] = Math.floor(newData[i]['remembering']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
    
        else if(newData[i]['items'] > newData[i]['total']){
          newData[i]['remembering'] = Math.ceil(newData[i]['remembering']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
    
        if(newData[i]['items'] == newData[i]['total'] && !Number.isInteger(newData[i]['understanding'])){
          newData[i]['understanding'] = Math.round(newData[i]['understanding']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
        else if(newData[i]['items'] < newData[i]['total']){
          newData[i]['understanding'] = Math.floor(newData[i]['understanding']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
    
        else if(newData[i]['items'] > newData[i]['total']){
          newData[i]['understanding'] = Math.ceil(newData[i]['understanding']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
    
        if(newData[i]['items'] == newData[i]['total'] && !Number.isInteger(newData[i]['applying'])){
          newData[i]['applying'] = Math.round(newData[i]['applying']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
        else if(newData[i]['items'] < newData[i]['total']){
          newData[i]['applying'] = Math.floor(newData[i]['applying']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
    
        else if(newData[i]['items'] > newData[i]['total']){
          newData[i]['applying'] = Math.ceil(newData[i]['applying']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
    
        if(newData[i]['items'] == newData[i]['total'] && !Number.isInteger(newData[i]['analyzing'])){
          newData[i]['analyzing'] = Math.round(newData[i]['analyzing']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
        else if(newData[i]['items'] < newData[i]['total']){
          newData[i]['analyzing'] = Math.floor(newData[i]['analyzing']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
    
        else if(newData[i]['items'] > newData[i]['total']){
          newData[i]['analyzing'] = Math.ceil(newData[i]['analyzing']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
    
        if(newData[i]['items'] == newData[i]['total'] && !Number.isInteger(newData[i]['evaluating'])){
          newData[i]['evaluating'] = Math.round(newData[i]['evaluating']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
        else if(newData[i]['items'] < newData[i]['total']){
          newData[i]['evaluating'] = Math.floor(newData[i]['evaluating']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
    
        else if(newData[i]['items'] > newData[i]['total']){
          newData[i]['evaluating'] = Math.ceil(newData[i]['evaluating']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
    
        if(newData[i]['items'] == newData[i]['total'] && !Number.isInteger(newData[i]['creating'])){
          newData[i]['creating'] = Math.round(newData[i]['creating']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
        else if(newData[i]['items'] < newData[i]['total']){
          newData[i]['creating'] = Math.floor(newData[i]['creating']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
    
        else if(newData[i]['items'] > newData[i]['total']){
          newData[i]['creating'] = Math.ceil(newData[i]['creating']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
    
      }
      else if(overall>totalItems){
        newData[i]['items'] = Math.floor(newData[i]['items']);
    
    
        if(newData[i]['items'] == newData[i]['total'] && !Number.isInteger(newData[i]['remembering'])){
          newData[i]['remembering'] = Math.round(newData[i]['remembering']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
        else if(newData[i]['items'] < newData[i]['total']){
          newData[i]['remembering'] = Math.floor(newData[i]['remembering']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
    
        else if(newData[i]['items'] > newData[i]['total']){
          newData[i]['remembering'] = Math.ceil(newData[i]['remembering']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
    
        if(newData[i]['items'] == newData[i]['total'] && !Number.isInteger(newData[i]['understanding'])){
          newData[i]['understanding'] = Math.round(newData[i]['understanding']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
        else if(newData[i]['items'] < newData[i]['total']){
          newData[i]['understanding'] = Math.floor(newData[i]['understanding']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
    
        else if(newData[i]['items'] > newData[i]['total']){
          newData[i]['understanding'] = Math.ceil(newData[i]['understanding']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
    
        if(newData[i]['items'] == newData[i]['total'] && !Number.isInteger(newData[i]['applying'])){
          newData[i]['applying'] = Math.round(newData[i]['applying']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
        else if(newData[i]['items'] < newData[i]['total']){
          newData[i]['applying'] = Math.floor(newData[i]['applying']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
    
        else if(newData[i]['items'] > newData[i]['total']){
          newData[i]['applying'] = Math.ceil(newData[i]['applying']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
    
        if(newData[i]['items'] == newData[i]['total'] && !Number.isInteger(newData[i]['analyzing'])){
          newData[i]['analyzing'] = Math.round(newData[i]['analyzing']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
        else if(newData[i]['items'] < newData[i]['total']){
          newData[i]['analyzing'] = Math.floor(newData[i]['analyzing']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
    
        else if(newData[i]['items'] > newData[i]['total']){
          newData[i]['analyzing'] = Math.ceil(newData[i]['analyzing']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
    
        if(newData[i]['items'] == newData[i]['total'] && !Number.isInteger(newData[i]['evaluating'])){
          newData[i]['evaluating'] = Math.round(newData[i]['evaluating']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
        else if(newData[i]['items'] < newData[i]['total']){
          newData[i]['evaluating'] = Math.floor(newData[i]['evaluating']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
    
        else if(newData[i]['items'] > newData[i]['total']){
          newData[i]['evaluating'] = Math.ceil(newData[i]['evaluating']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
    
        if(newData[i]['items'] == newData[i]['total'] && !Number.isInteger(newData[i]['creating'])){
          newData[i]['creating'] = Math.round(newData[i]['creating']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
        else if(newData[i]['items'] < newData[i]['total']){
          newData[i]['creating'] = Math.floor(newData[i]['creating']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
    
        else if(newData[i]['items'] > newData[i]['total']){
          newData[i]['creating'] = Math.ceil(newData[i]['creating']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
      
      }
      else if(overall==totalItems){
        newData[i]['items'] = Math.round(newData[i]['items']);
        
        if(newData[i]['items'] == newData[i]['total'] && !Number.isInteger(newData[i]['remembering'])){
          newData[i]['remembering'] = Math.round(newData[i]['remembering']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
        else if(newData[i]['items'] < newData[i]['total']){
          newData[i]['remembering'] = Math.floor(newData[i]['remembering']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
    
        else if(newData[i]['items'] > newData[i]['total']){
          newData[i]['remembering'] = Math.ceil(newData[i]['remembering']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
    
        if(newData[i]['items'] == newData[i]['total'] && !Number.isInteger(newData[i]['understanding'])){
          newData[i]['understanding'] = Math.round(newData[i]['understanding']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
        else if(newData[i]['items'] < newData[i]['total']){
          newData[i]['understanding'] = Math.floor(newData[i]['understanding']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
    
        else if(newData[i]['items'] > newData[i]['total']){
          newData[i]['understanding'] = Math.ceil(newData[i]['understanding']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
    
        if(newData[i]['items'] == newData[i]['total'] && !Number.isInteger(newData[i]['applying'])){
          newData[i]['applying'] = Math.round(newData[i]['applying']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
        else if(newData[i]['items'] < newData[i]['total']){
          newData[i]['applying'] = Math.floor(newData[i]['applying']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
    
        else if(newData[i]['items'] > newData[i]['total']){
          newData[i]['applying'] = Math.ceil(newData[i]['applying']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
    
        if(newData[i]['items'] == newData[i]['total'] && !Number.isInteger(newData[i]['analyzing'])){
          newData[i]['analyzing'] = Math.round(newData[i]['analyzing']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
        else if(newData[i]['items'] < newData[i]['total']){
          newData[i]['analyzing'] = Math.floor(newData[i]['analyzing']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
    
        else if(newData[i]['items'] > newData[i]['total']){
          newData[i]['analyzing'] = Math.ceil(newData[i]['analyzing']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
    
        if(newData[i]['items'] == newData[i]['total'] && !Number.isInteger(newData[i]['evaluating'])){
          newData[i]['evaluating'] = Math.round(newData[i]['evaluating']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
        else if(newData[i]['items'] < newData[i]['total']){
          newData[i]['evaluating'] = Math.floor(newData[i]['evaluating']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
    
        else if(newData[i]['items'] > newData[i]['total']){
          newData[i]['evaluating'] = Math.ceil(newData[i]['evaluating']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
    
        if(newData[i]['items'] == newData[i]['total'] && !Number.isInteger(newData[i]['creating'])){
          newData[i]['creating'] = Math.round(newData[i]['creating']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
        else if(newData[i]['items'] < newData[i]['total']){
          newData[i]['creating'] = Math.floor(newData[i]['creating']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
    
        else if(newData[i]['items'] > newData[i]['total']){
          newData[i]['creating'] = Math.ceil(newData[i]['creating']);
            newData[i]['total'] = getTotal(
          newData[i]['remembering'],
          newData[i]['understanding'],
          newData[i]['applying'],
          newData[i]['analyzing'],
          newData[i]['evaluating'],
          newData[i]['creating']
        );
    
        }
      }
      
    
    
      newData[i]['placement'] = getPlacement(newData[i]['total'], placements);
      newData[i]['totalItems'] = totalItems;
    }
    
  }

  // Update the state with the new data
  setLessonsDatainitial(newData);

  // Save the updated lessonsData to localStorage
  localStorage.setItem('lessonsData', JSON.stringify(newData));
};


const configTotal = lessonsData.reduce((acc, data) => {
  return acc + data.items;
}, 0); // Initial value of acc is set to 0

const configTotalAllocation = lessonsData.reduce((acc, data) => {
  return parseFloat(acc) + parseFloat(data.allocation);
}, 0); // Initial value of acc is set to 0

const configTotalHours = lessonsData.reduce((acc, data) => {
  return acc + Number(data.teachingHours);
}, 0); // Initial value of acc is set to 0

const configTotalRemember = lessonsData.reduce((acc, data) => {
  return acc + data.remembering;
}, 0); // Initial value of acc is set to 0

const configTotalunderstand = lessonsData.reduce((acc, data) => {
  return acc + data.understanding;
}, 0); // Initial value of acc is set to 0

const configTotalapply = lessonsData.reduce((acc, data) => {
  return acc + data.applying;
}, 0); // Initial value of acc is set to 0

const configTotalanalyze = lessonsData.reduce((acc, data) => {
  return acc + data.analyzing;
}, 0); // Initial value of acc is set to 0

const configTotalevaluate = lessonsData.reduce((acc, data) => {
  return acc + data.evaluating;
}, 0); // Initial value of acc is set to 0

const configTotalcreate = lessonsData.reduce((acc, data) => {
  return acc + data.creating;
}, 0); // Initial value of acc is set to 0




const configTotalTaxonomy = lessonsData.reduce((acc, data) => {
  return acc + data.total;
}, 0); // Initial value of acc is set to 0







  const rows = lessonsData.map((data, index) =>
    createData(
    <div className="max-w-36  max-h-10  overflow-hidden" style={{maxHeight:'100'}} key={index}><b> {index+1}</b></div>,
    <div className="max-w-36  overflow-hidden" style={{maxHeight:'100'}} key={index}> {data.learning_outcomes}</div>,
    <div className={`${data.teachingHours==0?'bg-red-500 rounded-lg text-white':''} text-center`} key={index} >  <TextInput
    min={0}
      id={`teaching_hours-${index}`}
      type="number"
      style={{maxWidth:'200px'}}
      value={lessonsData[index]['teachingHours']}
      onChange={(e) => handleLessonDataChange(index, 'teachingHours', e.target.value)}
      required
    /></div>,
     
    <div className={`${!Number.isInteger(data.allocation)?'bg-red-500 rounded-lg text-white':''} text-center`}>{data.allocation}%</div>,
     <div className={`${!Number.isInteger(data.items)?'bg-red-500 rounded-lg text-white':''} text-center`}>{data.items}</div>,
     <div className={`${!Number.isInteger(data.remembering)?'bg-red-500 rounded-lg text-white':''} text-center`}>{data.remembering}</div>,
     <div className={`${!Number.isInteger(data.understanding)?'bg-red-500 rounded-lg text-white':''} text-center`}>{data.understanding}</div>,
     <div className={`${!Number.isInteger(data.applying)?'bg-red-500 rounded-lg text-white':''} text-center`}>{data.applying}</div>,
     <div className={`${!Number.isInteger(data.analyzing)?'bg-red-500 rounded-lg text-white':''} text-center`}>{data.analyzing}</div>,
     <div className={`${!Number.isInteger(data.evaluating)?'bg-red-500 rounded-lg text-white':''} text-center`}>{data.evaluating}</div>,
     <div className={`${!Number.isInteger(data.creating)?'bg-red-500 rounded-lg text-white':''} text-center`}>{data.creating}</div>,
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
      
    }
  };




const options = ['Multiple Choice','Identification','True or False','Subjective'];

const [user, setUser] = useState([]);
const [formData, setFormData] = useState({
  Title: '',
  Semester: '1st Semester',
  AcademicYear: '',
  Term: 'Midterm',
  Campus: 'San Carlos Campus',
  CourseCode: '',
  Department: 'IT Department',
  ExaminationType: [],
  CourseType: '',
  ExaminationDate: '',
  Faculty: '',
  Chairperson: '',
  Dean: '',
  Director: ''
});

// Fetch user data
const getUser = () => {
  api
    .get(`/api/user/account/`)
    .then((res) => res.data)
    .then((data) => {
      setUser(data); // Set user data in state
      console.log('name: ', data);
    })
    .catch((err) => alert(err));
};

// Fetch user data on component mount
useEffect(() => {
  getUser();
}, []);

// Update formData with user's full name when user data changes
useEffect(() => {
  if (user.length > 0) {
    const fullName = getFullNames(user); // Get full name of the user
    setFormData(prevFormData => ({
      ...prevFormData,
      Faculty: fullName // Update formData with the full name
    }));
  }
}, [user]); // Only run this effect when 'user' state changes

// Function to get full name of the user
function getFullNames(users) {
  let fname = users[0]?.first_name || ''; // Use optional chaining to avoid errors
  let lname = users[0]?.last_name || '';
  
  return `${fname} ${lname}`.trim();
}





  const handleChange = (event) => {
    const { name, value } = event.target;
    const updatedFormData = {
      ...formData,
      [name]: value
    };
    setFormData(updatedFormData);
    localStorage.setItem('formData', JSON.stringify(updatedFormData));
  };


  const handleCourse = (event, course) => {
    const { name, value } = event.target;
  
    const updatedFormData = {
      ...formData,
      [name]: value,
      CourseCode: course.find((item) => item.course_name === value)?.course_code || '',
      CourseType: course.find((item) => item.course_name === value)?.course_type || '',
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

}




const handleExamTitleChange = (event) => {
  setExamTitle(event.target.value)
  const data = {
    ExamTitle: event.target.value,
    tos_id:0
  };

  localStorage.setItem('examData', JSON.stringify(data));
}






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





const uploadFiles = async (data) => {


  const uploadPromises = files.map(async (lesson,index) => {
    const formDatapdf = new FormData();

    // Check if the study_guide is a valid file
    if (lesson) {
      
      formDatapdf.append('study_guide', lesson); // Ensure this is a valid file object
      formDatapdf.append('tos_content', data[index]); 
    

      try {
        const response = await api.post('/api/upload/', formDatapdf, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
    
      } catch (error) {
        console.error('Upload failed:', error);
      }
    } else {
      console.warn('No valid file to upload for lesson:', lesson);
    }
  });

  // Wait for all uploads to complete
  await Promise.all(uploadPromises);

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




  let id_tos = 0
 
  e.preventDefault();

  api.post("/api/tos-info/", { formDataJson })
    .then((firstRes) => {

      if (firstRes.status === 201) {
        const id = firstRes.data[0].id;  // Assuming the ID is in the data of the response
        id_tos = id
        
       
        const updatedLessonsData = lessonsData.map((lesson) => {
          // Update the lesson object as needed, for example:
          lesson.teacher_tos = id; // or any other modification
          
          return lesson;
        });
        const lessonsDataJson = JSON.stringify(updatedLessonsData);

        

        



return api.post("/api/tos-content/", { lessonsDataJson })
  .then((secondRes) => {

    if (secondRes.status === 201) {
      const ids = secondRes.data.reduce((acc, item) => {
        // Assuming each item in secondRes.data has an `id` property
        acc.push(item.id); // Add each ID to the accumulator (array)
        return acc;
      }, []); // Initialize the accumulator as an empty array
    
      
     
      uploadFiles(ids);

 


      // Third request example
      const examData =  {
        exam_title: ExamTitle,
        tos_id: id_tos
      };

      const examDataJson = JSON.stringify(examData)
  
      return api.post("/api/create-exams/", {examDataJson})
      .then((TestPartRes) => { //third
       
        if (TestPartRes.status === 201) {
          
     
         
     
          const exam_id = TestPartRes.data[0].id
         
    
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
         
          return api.post("/api/create-testpart/", {itemTestPartJson})
          
      .then((thirdRes) => { //third
        
        if (thirdRes.status === 201) {
          
     
     
          const exam_id = thirdRes.data[0].exam_id
         

    
          let test_part_id = 0
          // Third request example
          const itemQuestion = examStates.reduce((acc,data,index) =>{


           
          
            for(let i = 0; i<thirdRes.data.length;i++){
              if(thirdRes.data[i].test_part_num === data.test_part_num){
                test_part_id = thirdRes.data[i].id
         
                
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
     
          return api.post("/api/create-questions/", {itemQuestionJson})
          .then((fourthRes) => {
       
            if (fourthRes.status === 201) {


        
          
      
              const question_data = fourthRes.data
            

              const ques_len = question_data.length;
           

                let ques_ids = question_data.reduce((accu, data) => {
                  accu.push(data.id);
                  return accu;
                }, []);
            

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
                  Department: 'IT Department',
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

        
                
          const AdminNotifDataJson = JSON.stringify({
            notification_text: " submitted ",
            tos: id,
          }) 
          api.post(`api/notification/admin/`, {AdminNotifDataJson});

           
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

  let topic = false
let outcomes = false
let hours = false
let items = false
let remember =false
let understand =false
let analyze =false
let apply =false
let evaluate  = false
let create = false

  lessonsData.map((data)=>{

    if(data.topic == ''){
      topic = true
    }
    if(data.learning_outcomes == ''){
      outcomes = true
    }

    if(data.teachingHours == 0){
      hours = true
    }

    if(!Number.isInteger(data.items)){
      items = true
    }


    if(!Number.isInteger(data.remembering)){
      remember = true
    }

    if(!Number.isInteger(data.understanding)){
      understand = true
    }

    if(!Number.isInteger(data.analyzing)){
      analyze = true
    }

    if(!Number.isInteger(data.applying)){
      apply = true
    }

    if(!Number.isInteger(data.evaluating)){
      evaluate = true
    }

    if(!Number.isInteger(data.creating)){
      create = true
    }


  })

  switch(step){
    case 1:
      if(formData.Title == '' || formData.AcademicYear == '' || formData.CourseCode == '' || formData.Faculty == ''|| formData.Chairperson == ''|| formData.Dean == ''|| formData.Director == ''|| formData.ExaminationDate == ''){
        setDisableNext(true)
      }
      break
    case 2:
      if(getTotalTaxonomy!=100 || totalItems<10 || topic || outcomes || files.length != lessonsData.length){
        setDisableNext(true)
      }
      break
    case 3:
      if(items || hours || remember|| understand || analyze || apply || evaluate ||create){
        setDisableNext(true)
      }
      break
  }



 



},[step,formData,getTotalTaxonomy,totalItems,lessonsData])


const handleSubmitExam = () =>{
  
  const updateStatus = {
    Status: 1
  };
  
  api
    .patch(`/api/tos-info/${id}/update/`, updateStatus)
    .then((res) => {

      getUser(); // Refresh the user list
      setOpenModal(false); // Close the modal
    })
    .catch((err) => {
      console.error('Error status:', err);
    });
}
const [allocations, setAllocations] = useState([]);

  // Handle the form submission
  const handleSubmitAllocation = async () => {
    try {
      const promises = lessonsData.map(async (l) => {
        const response = await api.post('/api/taxonomy-allocation/', {
          objectives: l.learning_outcomes,
        });
        return response.data.allocation; // Return the allocation data
      });

      const allocationsArray = await Promise.all(promises);


      // Flatten the array if you have nested arrays in allocations
      setAllocations((previous) => [...previous, ...allocationsArray.flat()]);

     
    
     
    
    } catch (error) {
      console.error('Error processing the file and data:', error);
    }


    setLoadingAllocate(false)
  };

  const submitAllocation = () =>{

    setLoadingAllocate(true)
    setAllocations([]);
    handleSubmitAllocation();

   
  }
  useEffect(() => {
    const creating = Number(Creating);
    const evaluating = Number(Evaluating);
    const applying = Number(Applying);
  
    // Retain past values and update the examination type
    setFormData((prevFormData) => {
      let updatedExaminationType = [...prevFormData.ExaminationType];
  
      // Check if 'Subjective' should be added
      if (creating > 0 || evaluating > 0 || applying > 0) {
        if (!updatedExaminationType.includes('Subjective')) {
          updatedExaminationType.push('Subjective'); // Add 'Subjective'
        }
      } else {
        // Remove 'Subjective' if it exists
        updatedExaminationType = updatedExaminationType.filter(type => type !== 'Subjective');
      }
  
      // Create updated formData
      const updatedFormData = {
        ...prevFormData,
        ExaminationType: updatedExaminationType,
      };
  
      // Update localStorage with the new formData
      localStorage.setItem('formData', JSON.stringify(updatedFormData));
  
      return updatedFormData; // Return updated formData to update the state
    });
  
  }, [Creating, Evaluating, Applying]); // Add dependencies to trigger the effect when necessary
  





  

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
       <div className='w-full mb-3'>

       <div className="w-full">
           <div className="mb-2 block">
             <Label htmlFor="title" value="Course" />
           </div>
           <Select id="title" name="Title" value={formData.Title} onChange={(e)=>{handleExamTitleChange(e);handleCourse(e,course)}} color={'gray'} required>
           <option value={''}>
     
    </option>
           {
  course.map((data, index) => (
    <option key={index} value={data.course_name}>
      {data.course_name}
    </option>
  ))
}

             {JSON.stringify(course)}
          
         
           </Select>
         </div>

           {/* <div className="mb-2 block">
             <Label htmlFor="title" value="Subject" />
           </div>
           <TextInput id="title" type="text" name="Title" value={formData.Title} onChange={(e)=>{handleChange(e);handleExamTitleChange(e)}} />
            */}
         </div>
       <div className='w-full mb-3 gap-4 flex flex-col sm:flex-row'>
      
         <div className="w-full">
           <div className="mb-2 block">
             <Label htmlFor="semester" value="Semester" />
           </div>
           <Select id="semester" name="Semester" value={formData.Semester} onChange={handleChange} color={'gray'} required>
         
             <option value="1st Semester">1st Semester</option>
             <option value="2nd Semester">2nd Semester</option>
         
           </Select>
         </div>

         <div className="w-full">
           <div className="mb-2 block">
             <Label htmlFor="semester" value="Term" />
           </div>
           <Select id="Term" name="Term" value={formData.Term} onChange={handleChange} color={'gray'} required>
         
             <option value="Midterm">Midterm</option>
             <option value="Finals">Finals</option>
         
           </Select>
         </div>
       </div>
   

       {/* Academic Year and Campus */}
       <div className='w-full gap-4 mb-3 flex flex-col sm:flex-row'>
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
       <div className='w-full gap-4 flex flex-col mb-3 sm:flex-row'>
         <div className='w-full'>
           <div className="mb-2 block">
             <Label htmlFor="course-code" value="Course Code" />
           </div>
           <TextInput readOnly id="course-code" type="text" name="CourseCode" value={formData.CourseCode} onChange={handleChange} />
         </div>
         <div className="w-full">
           <div className="mb-2 block">
             <Label htmlFor="department" value="Department" />
           </div>
           <Select id="department" name="Department" value={formData.Department} onChange={handleChange} required>
           <option value=" IT Department"> IT Department</option>
             <option value=" Business and Office Administration"> Business and Office Administration</option>
    
           </Select>
         </div>
       </div>

       {/* Type of Examination and Course Type */}
       <div className='w-full mb-3 gap-4 flex flex-col sm:flex-row'>
           {/* Date of Examination */}
       <div className='w-full'>
         <div className="mb-2 block">
           <Label htmlFor="exam-date" value="Date of Examination" />
         </div>
         <TextInput id="exam-date" type="date" name="ExaminationDate" value={formData.ExaminationDate} onChange={handleChange} />
       </div>
         <div className='w-full'>
           <div className="mb-2 block">
             <Label htmlFor="course-type" value="Course Type" />
           </div>
           <TextInput readOnly id="course-type" type="text" name="CourseType" value={formData.CourseType} onChange={handleChange} />
         </div>
       </div>

       <div className='w-full mb-3 gap-4 flex flex-col sm:flex-row'>
       {/* Date of Examination */}
       <div className="w-full ">
   
<div className="mb-2 block">
           <Label htmlFor="executive-director" value="Campus Executive Director" />
         </div>
         <TextInput id="executive-director" type="text" name="Director" value={formData.Director} onChange={handleChange} />
   
         </div>

       {/* Faculty */}
       <div className='w-full'>
         <div className="mb-2 block">
           <Label htmlFor="faculty" value="Instructor" />
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

</Card>

  
       
         
       

  
      <Card className={`mb-5 ${step == 2? 'show':'hidden'}`}>
      <div className="flex">
        <div className="flex-1 "> 

      <Breadcrumb aria-label="Default breadcrumb example">
      <Breadcrumb.Item onClick={()=>{setStep(1)}} className="cursor-pointer">
      Course Information
      </Breadcrumb.Item>
      <Breadcrumb.Item >
      Taxonomy Allocation
      </Breadcrumb.Item>
      
    </Breadcrumb>

    </div>

<div className="justify-end">
  <div>


<Error lessonsData={lessonsData} getTotalTaxonomy={getTotalTaxonomy} totalItems={totalItems} files={files}  />

  </div>
 
</div>


</div>
   
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
        Remembering={Remembering}
        addLesson={addLesson}
        lessonsDataInitial={lessonsDataInitial}
        handleLessonDataChange={handleLessonDataChange}
        lessonsData={lessonsData}
        removeLesson={removeLesson}
        formData={formData}
        setFormData={setFormData}
        submit={submitAllocation}
        handleSubmit={handleSubmitAllocation}
        allocations={allocations}
        setAllocations={setAllocations}
        files={files}
        setLessonsDatainitial={setLessonsDatainitial}
        



       
      />
<div className="flex gap-3"> 
     

      <Card className=" gap-4 mb-5  w-full p-3"> 
        <div>
      <div className="max-w-md flex gap-5">
        <div className="mt-3" >
          <Label htmlFor="totalItems" className="font-bold" > Total of Items<span className="text-red-600">*</span></Label> 
        </div>
        <TextInput id="totalItems" type="number" className="max-w-32 " required value={totalItems} min={'0'} onChange={handleTotalItemsChange} />
      </div>
      </div>
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
      <div className="my-3">
      <Button color={'primary'} className="mx-auto" onClick={submitAllocation}  isProcessing={loadingAllocate ? true : false}>
      {loadingAllocate ? 'Allocating' : 'Allocate'}
        </Button>
      </div>
      </Card>

      </div>

       
      </Card>

      <Card className={`mb-5 ${step == 3? 'show':'hidden'}`}>

      <div className="flex">
        <div className="flex-1 "> 

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

        </div>

        <div className="justify-end">
          <div>


      <ErrorHandling lessonsData={lessonsData} />
          </div>
         
        </div>
    

    </div>
   
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
                <TableRow role="checkbox" tabIndex={-1} key={index}  className="cursor-pointer " >
                  
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

              <TableRow >
                <TableCell style={{textAlign:'center',fontWeight:'bold'}}>
                  Total
                </TableCell>
                <TableCell style={{textAlign:'center',fontWeight:'bold'}}>
                  {configTotalHours}
                </TableCell>
                <TableCell style={{textAlign:'center',fontWeight:'bold'}}>
                {Number.isInteger(configTotalAllocation) ? configTotalAllocation : configTotalAllocation.toFixed(2)
                }
                </TableCell>
                <TableCell style={{textAlign:'center',fontWeight:'bold'}}>
                {Number.isInteger(configTotal) ? configTotal : configTotal.toFixed(2)
                }
                </TableCell>
                <TableCell style={{textAlign:'center',fontWeight:'bold'}}>
                {Number.isInteger(configTotalRemember) ? configTotalRemember : configTotalRemember.toFixed(2)
                }
                </TableCell>
                <TableCell style={{textAlign:'center',fontWeight:'bold'}}>
                {Number.isInteger(configTotalunderstand) ? configTotalunderstand : configTotalunderstand.toFixed(2)
                }
                </TableCell>
                <TableCell style={{textAlign:'center',fontWeight:'bold'}}>
                {Number.isInteger(configTotalapply) ? configTotalapply : configTotalapply.toFixed(2)
                }
                </TableCell>
                <TableCell style={{textAlign:'center',fontWeight:'bold'}}>
                {Number.isInteger(configTotalanalyze) ? configTotalanalyze : configTotalanalyze.toFixed(2)
                }
                
                </TableCell>
                <TableCell style={{textAlign:'center',fontWeight:'bold'}}>
                {Number.isInteger(configTotalevaluate) ? configTotalevaluate : configTotalevaluate.toFixed(2)
                }
                </TableCell>
                <TableCell style={{textAlign:'center',fontWeight:'bold'}}>
                {Number.isInteger(configTotalcreate) ? configTotalcreate : configTotalcreate.toFixed(2)
                }
                </TableCell>
                <TableCell style={{textAlign:'center',fontWeight:'bold'}}>
                  {Number.isInteger(configTotalTaxonomy) ? configTotalTaxonomy : configTotalTaxonomy.toFixed(2)
                  }
                  
                </TableCell>
                <TableCell style={{textAlign:'center',fontWeight:'bold'}}>
                 
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
   
      </Paper>
      <div className="w-full">
    
        <div className="  w-full flex flex-wrap ">
     <div  className=" mt-3 flex gap-3   mx-auto">
      {/* <Button color={'primary'}  onClick={() => addLesson({  
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
      totalItems:0,})}> <AddCircleOutlineIcon className="mr-2 "/>Add Lesson</Button> */}

    
        {/* <Button  color={'failure'} onClick={()=>handleResetAll()}>Reset</Button> */}
      <Button color="primary" onClick={() => setPdfModal(true)}><VisibilityIcon className="mr-2"/>Preview</Button>

 
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
      <Examtest saveDataToLocalStorageTestPart={saveDataToLocalStorageTestPart} files={files} setExamTitle={setExamTitle} items={totalItems} tos_id={tos_id} lessonsData={lessonsData} examStates={examStates} setExamStates={setExamStates} handleStateChange={handleStateChange} ExamTitle={ExamTitle} handleExamTitleChange={handleExamTitleChange} handleRadioAnswer={handleRadioAnswer} TestPart={TestPart} setTestPart={setTestPart} handleTestPartChange={handleTestPartChange} saveDataToLocalStorageQuestion={saveDataToLocalStorageQuestion} setSubmit={setSubmit} setLoading={setLoadingGenerate} context={context} setContext={setContext} formData={formData} handleLessonDataChange={handleLessonDataChange}/>


    

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
      
   {/* {JSON.stringify(allocations)} */}
      </div>
      </div>
    </div>
  );
  
  
ReactDOM.render(<TOS />, document.getElementById('root'));
}

export default TOS
