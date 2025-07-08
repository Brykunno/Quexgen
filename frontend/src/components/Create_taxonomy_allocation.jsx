import React from 'react'
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import TableRow from "@mui/material/TableRow";
import RestoreIcon from '@mui/icons-material/Restore';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { Modal,Card,Label,Button,TextInput,Textarea } from 'flowbite-react';

function Create_taxonomy_allocation({rows,columns,handleModalRow,lessonsData,indexRow,openModal,setOpenModal,Remembering,Understanding,Applying,Analyzing,Evaluating,Creating,configTotal,setLessonsDatainitial,getAllocation,getTotalHours,getTotal,getPlacement,placements,getNumItems, getRemembering,getUnderstanding,getApplying,getAnalyzing,getEvaluating,getCreating}) {


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
      
      
      

 function inputModal(indexRow,lessonsData){
    if(lessonsData[indexRow] === undefined){
      return ''
    }
    else{
      return(
      <Modal size={'4xl'} show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Lesson {indexRow+1} </Modal.Header>
      <Modal.Body>
        <div className="space-y-6 " >
          <div className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
           

      <div className="flex-col gap-5">  
         <div style={{flex:1}} className="">
          <Card className="p-5 pb-10 mb-5">
        <div className="mb-5 ">
       
      <div className="mb-2 block">
        <Label htmlFor={`topic-${indexRow}`} > Lesson/Topic Summary<span className='text-red-600 font-bold'>*</span></Label>
      </div>
      <Textarea
        id={`topic-${indexRow}`}
        value={lessonsData[indexRow]['topic']}

       style={{height:'100px'}}
        onChange={(e) => handleLessonDataChange(indexRow, 'topic', e.target.value)}
        required
      />
    </div>
    <div className="mb-3 ">
      <div className="mb-2 block">
      <Label htmlFor={`learning_outcomes-${indexRow}`}>
  Learning Outcomes <span className='text-red-600 font-bold'>*</span>
</Label>
      </div>
      <Textarea
      
        id={`learning_outcomes-${indexRow}`}
        value={lessonsData[indexRow]['learning_outcomes']}
        style={{height:'100px'}}
        onChange={(e) => handleLessonDataChange(indexRow, 'learning_outcomes', e.target.value)}
        required
      />
      
    </div>
    
   
    </Card>
    </div>
    <div style={{flex:1}}>
      <Card>
    <div className="mb-4">
      <div className="mb-2 block">
        <Label htmlFor={`teaching_hours-${indexRow}`} >No. of Teaching Hours<span className='text-red-600 font-bold'>*</span></Label>
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

<div className="mb-3 flex"  style={{borderBottomStyle:'solid',borderBottomWidth:1}}>
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
    <Label htmlFor={`teaching_hours-${indexRow}`} value="Expected number of items" />
  </div>
  <span className=" flex-1 text-right text-black">
    {/* If there's a percentage or similar value, you can place it here */}
  </span>
  <span className="text-right text-black font-bold" style={{flex: 0.2}}>
    {lessonsData[indexRow]['items']}
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

<div className="mb-3 flex" style={{borderBottomStyle:'solid',borderBottomWidth:1}}>
  <div className="mb-2 block flex-1">
    <Label htmlFor={`teaching_hours-${indexRow}`} value="Total of all items" />
  </div>
  <span className=" flex-1 text-right text-black">
    {/* If there's a percentage or similar value, you can place it here */}
  </span>
  <span className="text-right text-black font-bold" style={{flex: 0.3}}>
    {configTotal}
  </span>
</div>
<Button color={'failure'} size={'xs'} onClick={(e) => handleReset(indexRow, 'reset')}><RestoreIcon/> <span className="mt-1">Reset</span></Button>
</Card>
    </div>

  
    
    </div>
    
    </div>
           
           </div>
         </Modal.Body>
         <Modal.Footer>
          <div className=" w-full ">
            <div className="mx-auto flex gap-5 justify-center">
            {/* <Button color="failure" onClick={() => removeLesson(lessonsData,indexRow)}><RemoveCircleOutlineIcon className="mr-2"/>Remove Lesson</Button> */}
           <Button onClick={() => setOpenModal(false)}  color={'success'}>Done</Button>
           
           </div>
           </div>
         </Modal.Footer>
       </Modal>)
       
    }
  }



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
                <TableRow role="checkbox" tabIndex={-1} key={index} onClick={(event) => handleModalRow(event, index)} className="cursor-pointer " >
                  
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
      {inputModal(indexRow,lessonsData)}
    </div>
  )
}

export default Create_taxonomy_allocation
