import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import { Button, CardContent, CardHeader, Divider } from '@mui/material';
import { Textarea, TextInput,Card,Pagination,FileInput,Label,Spinner,Modal } from 'flowbite-react';
import ClearIcon from '@mui/icons-material/Clear';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InvalidFileError from './../InvalidFileError';
import api from '../../api';
import { useSnackbar } from 'notistack';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function CustomTabPanel(props) {



  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}







export default function ScrollableTabsButtonVisible({previewTos,handleinnertaxlevelChange,totalOfItems,handleInnerLessonDataChange,handleLessonDataChange,removeFile,removeLesson,lessonsData,taxonomyRange}) {


function totalTeachingHours(index) {
  return lessonsData[index].teachingHours.reduce((sum, hour) => sum + hour, 0);
}

  const [openModals,setOpenModals] = React.useState(0);
  const [value, setValue] = React.useState(0);
  const [innerValue, setInnerValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  
  const handleChangeInner = (event, newValue) => {
    setInnerValue(newValue);
  };

  

  return (
    <Box
      sx={{
        flexGrow: 1,
        maxWidth: "100%",
        bgcolor: 'background.paper',
      }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons
        aria-label="visible arrows tabs example"
        sx={{
          [`& .${tabsClasses.scrollButtons}`]: {
            '&.Mui-disabled': { opacity: 0.3 },
          },
        }}
      >
     

{lessonsData.map((data,index)=> 
  {return <Tab key={index}
   label={`Lesson ${index+1}`}
     // sx={{ backgroundColor: 'lightblue', borderRadius:10 }}
    {...a11yProps(index)} 

    />})}

     
          
      </Tabs>


      {lessonsData.map((data,index)=> 
  {return <CustomTabPanel value={value} index={index}>
   

        <Card key={index} className="relative">
     {/* Delete button positioned in the top right */}

{/*     
     <div className="absolute top-2 right-2">
       <Button
        
         size={'xs'}
         color={'error'}
      
        
       >
        <ClearIcon  className=" hover:scale-110 transition-transform duration-200"  onClick={() => {removeLesson(lessonsData, index); removeFile(index)

        }} />

       </Button>
     </div> */}
   
     <div className="mb-3">
      
       <div>

         {/* <div className="mb-2 block">
           <Label htmlFor="file-upload">
             Upload file for Lesson {index + 1} <span className="text-red-600">*</span>
           </Label>
         </div> */}
{/*          
         <div className="flex gap-5">
           <FileInput
             id="file-upload"
             accept="application/pdf"
             className="flex-1"
             sizing="sm"
             onChange={(e) => {
               handleLessonDataChange(index, 'study_guide', e.target.files[0]);
               handleValidateFile(e.target.files[0], index);
               handleReadOneFile(e.target.files[0], index);
             }}
           />
           <div>
             {fileStatus[index] ? (
               <div><Spinner color="primary" /> Validating file...</div>
             ) : (
               <span>{getFileStatus(lessonsDataInitial[index]?.file_status)}</span>
             )}
           </div>
         </div> */}
       </div>
       
     </div>
   
       <div className="flex-1">
         <div className="ms-2 font-bold mb-2">Lesson {index + 1}</div>
         
         <Textarea
           value={lessonsData[index]['topic']}
           style={{ height: '100px' }}
           onChange={(e) => handleLessonDataChange(index, 'topic', e.target.value)}
           placeholder="Enter the summary of the lesson"
         />
       </div>


<div className='flex '>

<div className='flex-1 '>
<div className='m-3 mb-4'>


  {totalOfItems} 
</div>
      <div>
{taxonomyRange}
{previewTos}
      </div>
  </div>
          
   

<div className='flex-1'> 
    <Tabs
        value={innerValue}
        onChange={handleChangeInner}
        variant="scrollable"
        scrollButtons
        aria-label="visible arrows tabs example"
        sx={{
          [`& .${tabsClasses.scrollButtons}`]: {
            '&.Mui-disabled': { opacity: 0.3 },
          },
        }}
      >
     
         {lessonsData[index]['learning_outcomes']
  .map((line, lineIndex) => (

<Tab key={lineIndex}
   label={`Learning Outcome ${lineIndex+1}`}
     sx={lessonsData[index]['teachingHours'][lineIndex]==0?{ color: 'red' }:{ color: 'green' }}
    {...a11yProps(lineIndex)} 

    icon={lessonsData[index]['teachingHours'][lineIndex]==0?<ErrorIcon className={`text-red-600`}/>:<CheckCircleIcon className={`text-green-600`}/>}
    iconPosition='end'

    />
      ))}

   </Tabs>
               {lessonsData[index]['learning_outcomes']
  .map((line, lineIndex) => (

    <CustomTabPanel value={innerValue} index={lineIndex}>

     



  <div >
         <div className="ms-2 font-bold mb-2">Learning Outcome</div>


  
    <div key={lineIndex} style={{ marginBottom: '20px'}}>
      <Textarea
        key={lineIndex}
        value={line}
        onChange={(e)=>handleInnerLessonDataChange(index,lineIndex,'learning_outcomes',e.target.value)}
        // style={{ height: '100px', width: '300px', marginBottom: '10px' }}
        placeholder={`Enter value for line ${lineIndex}`}
      />
    </div>


       </div>


       <div className="flex gap-3 mb-3 justify-between">
         <div className="ms-2 font-bold mb-2">Number of teaching hours ( {totalTeachingHours(index)})</div>

    <div key={lineIndex} >
      <TextInput
  key={lineIndex}
  name={`teachingHours-${index}-${lineIndex}`}
  onChange={(e) => {handleInnerLessonDataChange(index, lineIndex, 'teachingHours', Number(e.target.value))
  
  }}
  value={lessonsData[index]['teachingHours'][lineIndex]}
  type='number'
  min={0}
  
  
  // style={{ height: '100px', width: '300px', marginBottom: '10px' }}
  placeholder={`Enter value for line ${lineIndex}`}
/>


    </div>

       </div>

<Card>

      <h5 className="text-center text-xl font-bold tracking-tight text-gray-900 dark:text-white">
    Bloom's Taxonomy Concentration
      </h5>


  <CardContent>
      <div className="flex gap-3 mb-3 justify-between ">
         <div className="ms-2 font-bold mb-2 ">Remembering</div>

         

    <div key={lineIndex}   className='justify-end '>
      <TextInput
  key={lineIndex}
        type="number"
  name={`teachingHours-${index}-${lineIndex}`}
   onChange={(e) => handleinnertaxlevelChange(index, 'taxonomy_levels', "Remembering",lineIndex, e.target.value)}
               value={lessonsData[index]?.taxonomy_levels?.[lineIndex]?.["Remembering"]}
          min={'0'}
  placeholder={`Enter value for line ${lineIndex}`}

/>
    </div>
       </div>
      <div className="flex gap-3 mb-3 justify-between ">
         <div className="ms-2 font-bold mb-2">Understanding</div>
         

    <div key={lineIndex}   className='justify-end '>
      <TextInput
  key={lineIndex}
        type="number"
  name={`teachingHours-${index}-${lineIndex}`}
   onChange={(e) => handleinnertaxlevelChange(index, 'taxonomy_levels', "Understanding",lineIndex, e.target.value)}
               value={lessonsData[index]?.taxonomy_levels?.[lineIndex]?.["Understanding"]}
          min={'0'}
  placeholder={`Enter value for line ${lineIndex}`}

/>
    </div>
       </div>
             <div className="flex gap-3 mb-3 justify-between ">
         <div className="ms-2 font-bold mb-2">Applying</div>
         

    <div key={lineIndex}   className='justify-end '>
      <TextInput
  key={lineIndex}
        type="number"
  name={`teachingHours-${index}-${lineIndex}`}
   onChange={(e) => handleinnertaxlevelChange(index, 'taxonomy_levels', "Applying",lineIndex, e.target.value)}
               value={lessonsData[index]?.taxonomy_levels?.[lineIndex]?.["Applying"]}
          min={'0'}
  placeholder={`Enter value for line ${lineIndex}`}
/>
    </div>
       </div>
        <div className="flex gap-3 mb-3 justify-between ">
         <div className="ms-2 font-bold mb-2">Analyzing</div>
         

    <div key={lineIndex}   className='justify-end '>
      <TextInput
  key={lineIndex}
        type="number"
  name={`teachingHours-${index}-${lineIndex}`}
   onChange={(e) => handleinnertaxlevelChange(index, 'taxonomy_levels', "Analyzing",lineIndex, e.target.value)}
               value={lessonsData[index]?.taxonomy_levels?.[lineIndex]?.["Analyzing"]}
          min={'0'}
  placeholder={`Enter value for line ${lineIndex}`}

/>
    </div>
       </div>
               <div className="flex gap-3 mb-3 justify-between ">
         <div className="ms-2 font-bold mb-2">Evaluating</div>
         

    <div key={lineIndex}   className='justify-end '>
      <TextInput
  key={lineIndex}
        type="number"
  name={`teachingHours-${index}-${lineIndex}`}
   onChange={(e) => handleinnertaxlevelChange(index, 'taxonomy_levels', "Evaluating",lineIndex, e.target.value)}
               value={lessonsData[index]?.taxonomy_levels?.[lineIndex]?.["Evaluating"]}
          min={'0'}
  placeholder={`Enter value for line ${lineIndex}`}

/>
    </div>
       </div>
        <div className="flex gap-3 mb-3 justify-between ">
         <div className="ms-2 font-bold mb-2">Creating</div>
         

    <div key={lineIndex}   className='justify-end '>
      <TextInput
  key={lineIndex}
        type="number"
  name={`teachingHours-${index}-${lineIndex}`}
   onChange={(e) => handleinnertaxlevelChange(index, 'taxonomy_levels', "Creating",lineIndex, e.target.value)}
               value={lessonsData[index]?.taxonomy_levels?.[lineIndex]?.["Creating"]}
          min={'0'}
  placeholder={`Enter value for line ${lineIndex}`}

/>
    </div>
       </div>
       </CardContent>
</Card>

    </CustomTabPanel>

      ))}
     
  </div>

 
       </div>


   </Card>


      </CustomTabPanel>
    
    })}

     

      
    </Box>
  );
}