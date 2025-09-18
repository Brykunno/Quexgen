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
import {Button} from "@mui/material";
import { Breadcrumb,Card,Progress,Label, Textarea,ToggleSwitch, TextInput,RangeSlider,Modal,Select,FileInput } from "flowbite-react";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import TOSmodal from "./TOSmodal";
import Error from "./Error";
import api from "../api";
import { json, useNavigate } from "react-router-dom";
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
import ToastError from "./ToastError";



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
      study_guide,
     
    };
  }

function Tostest({lessonsData,Remembering,Understanding,Applying,Analyzing,Evaluating,Creating,configTotal,configTotalHours,configTotalAllocation,configTotalRemember,configTotalunderstand,configTotalapply,configTotalanalyze,configTotalevaluate,configTotalcreate,configTotalTaxonomy}) {


    
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
    />
    
    </div>,
     
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
  

    

  function getAllocation(hours,totalHours){
    let result = (hours / totalHours) * 100;

    if (result % 1 >= 0.3 && result % 1 <= 0.7) {
      return parseFloat(result.toFixed(2)); 
    }
    return Math.round(parseFloat(result.toFixed(2))); 
   
  
  }

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

  function getLevelAllocation(allocations,level,index){

    const Remembering = allocations[index]['Remembering']
    const Understanding = allocations[index]['Understanding']
    const Applying = allocations[index]['Applying']
    const Analyzing = allocations[index]['Analyzing']
    const Evaluating = allocations[index]['Evaluating']
    const Creating = allocations[index]['Creating']
  
    const total = Remembering+Understanding+Applying+Analyzing+Evaluating+Creating
  
    
    const percent = Math.round((allocations[index][level]/total)*100)
  
    
  
    return percent
  
  
  
  }

  
function getRemembering(remembering,items){



    return roundNum((remembering/100)*items)
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
  
  function getLevelAllocation(allocations,level,index){
  
    const Remembering = allocations[index]['Remembering']
    const Understanding = allocations[index]['Understanding']
    const Applying = allocations[index]['Applying']
    const Analyzing = allocations[index]['Analyzing']
    const Evaluating = allocations[index]['Evaluating']
    const Creating = allocations[index]['Creating']
  
    const total = Remembering+Understanding+Applying+Analyzing+Evaluating+Creating
  
    
    const percent = Math.round((allocations[index][level]/total)*100)
  
    
  
    return percent
  
  
  
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

   function roundNumItems(num) {

    return parseFloat(num.toFixed(2)); 
   
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
  
        let remembering = 0;
        let understanding = 0;
        let applying = 0;
        let analyzing = 0;
        let evaluating = 0;
        let creating = 0;
        if(specific===true){
  
        
         remembering = getLevelAllocation(allocations,'Remembering',i)
         understanding = getLevelAllocation(allocations,'Understanding',i)
  
         applying = getLevelAllocation(allocations,'Applying',i)
  
         analyzing = getLevelAllocation(allocations,'Analyzing',i)
  
         evaluating = getLevelAllocation(allocations,'Evaluating',i)
  
         creating = getLevelAllocation(allocations,'Creating',i)
        }
        else{
  
           remembering = Remembering;
           understanding = Understanding;
           applying = Applying;
           analyzing = Analyzing;
           evaluating = Evaluating;
           creating = Creating;
  
        }
  
  
  
        newData[i]['remembering'] = getRemembering(remembering, newData[i]['items']);
        newData[i]['understanding'] = getUnderstanding(understanding, newData[i]['items']);
        newData[i]['applying'] = getApplying(applying, newData[i]['items']);
        newData[i]['analyzing'] = getAnalyzing(analyzing, newData[i]['items']);
        newData[i]['evaluating'] = getEvaluating(evaluating, newData[i]['items']);
        newData[i]['creating'] = getCreating(creating, newData[i]['items']);
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

  return (
    <div>
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
    </div>
  )
}

export default Tostest
