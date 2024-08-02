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
import { Card,Progress,Label, Textarea, TextInput,Button,RangeSlider,Modal,Select } from "flowbite-react";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import TOSmodal from "./TOSmodal";
import api from "../api";
import { useNavigate } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import VisibilityIcon from '@mui/icons-material/Visibility';

import { useState,useEffect } from "react";
import ToastMessage from "./Toast";
import Exam from "./Exam";


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
  placement
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

  const [indexRow, setIndexRow] = React.useState(0);
  
  const [loading, setLoading] = useState(false);
  const [Toast, setToast] = useState(false);
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);

  const [sample, setSample] = useState([]);


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
  { id: "topic", label: "Lesson/Topic", minWidth: 170 },
  { id: "learning_outcomes", label: "Learning Outcomes", minWidth: 170 },
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

  // React.useEffect(() => {
  //   const initialData = Array.from({ length: lesson }, () => ({
  //     topic: '',
  //     learning_outcomes: '',
  //     teachingHours: 0,
  //     allocation: 0,
  //     items: 0,
  //     remembering: 0,
  //     understanding: 0,
  //     applying: 0,
  //     analyzing: 0,
  //     evaluating: 0,
  //     creating: 0,
  //     total: 0,
  //     placement: '',
  //     totalItems:0,
   
  //   }));
  //   setLessonsData(initialData);
  // }, [lesson]);

  
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

// let getTotalHours = lessonsData.reduce((acc, data) => {
//   return acc + Number(data.teachingHours);
// }, 0);


function getTotalHours(){
 let hours= lessonsData.reduce((acc, data) => {
    return acc + Number(data.teachingHours);
  }, 0);



  return hours
}


function getNumItems(totalItems,allocation){
  const allocationDecimal = allocation / 100;
  return Math.round(totalItems * allocationDecimal);
 

}

function getRemembering(remembering,items){

  return Math.round((remembering/100)*items)
}

function getUnderstanding(Understanding,items){

  return Math.round((Understanding/100)*items)
}

function getApplying(Applying,items){

  return Math.round((Applying/100)*items)
}
function getAnalyzing(Analyzing,items){

  return Math.round((Analyzing/100)*items)
}
function getEvaluating(Evaluating,items){

  return Math.round((Evaluating/100)*items)
}
function getCreating(Creating,items){

  return Math.round((Creating/100)*items)
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










  const rows = lessonsData.map((data, index) =>
    createData(
    <div className="max-w-36  overflow-hidden" key={index}> {data.topic}</div>,
    <div className="max-w-36  overflow-hidden" key={index}> {data.learning_outcomes}</div>,
     data.teachingHours,
     
     data.allocation,
     data.items,
     data.remembering,
     data.understanding,
     data.applying,
     data.analyzing,
     data.evaluating,
     data.creating,
     data.total,
     data.placement


    
    )
  );

  const handleModalRow = (event,index) => {
    setOpenModal(true)
    setIndexRow(index)
   
  }

 
  

const removeLesson = (lessonsData) =>{
  let myArray = lessonsData;

// Check if the array is not null and has elements
if (myArray && myArray.length > 0) {
  // Remove the last item from the array
  myArray.pop();

  setLessonsDatainitial(myArray)
  // Save the updated array back to local storage
  localStorage.setItem('lessonsData', JSON.stringify(myArray));
} else {
  console.log('Array is empty or does not exist.');
}
}



  function inputModal(indexRow,lessonsData){
    if(lessonsData[indexRow] === undefined){
      return 0
    }
    else{
      return <div>   <div className="mb-4">
      <div className="mb-2 block">
        <Label htmlFor={`topic-${indexRow}`} value="Lesson/Topic" />
      </div>
      <Textarea
        id={`topic-${indexRow}`}
        value={lessonsData[indexRow]['topic']}
        className="min-h-44"
        onChange={(e) => handleLessonDataChange(indexRow, 'topic', e.target.value)}
        required
      />
    </div>
    <div className="mb-4">
      <div className="mb-2 block">
        <Label htmlFor={`learning_outcomes-${indexRow}`} value="Learning Outcomes" />
      </div>
      <Textarea
        id={`learning_outcomes-${indexRow}`}
        value={lessonsData[indexRow]['learning_outcomes']}
         className="min-h-44"
        onChange={(e) => handleLessonDataChange(indexRow, 'learning_outcomes', e.target.value)}
        required
      />
    </div>
    <div className="mb-4">
      <div className="mb-2 block">
        <Label htmlFor={`teaching_hours-${indexRow}`} value="No. of Teaching Hours" />
      </div>
      <TextInput
        id={`teaching_hours-${indexRow}`}
        type="number"
        value={lessonsData[indexRow]['teachingHours']}
        onChange={(e) => handleLessonDataChange(indexRow, 'teachingHours', e.target.value)}
        required
      />
    </div>

    <div className="mb-4">
      <div className="mb-2 block">
        <Label htmlFor={`teaching_hours-${indexRow}`} value="% of Allocation" />
      </div>
    {lessonsData[indexRow]['allocation']}%
    </div>

    <div className="mb-4">
      <div className="mb-2 block">
        <Label htmlFor={`teaching_hours-${indexRow}`} value="Number of Items" />
      </div>
    {lessonsData[indexRow]['items']}
    </div>

    <div className="mb-4">
      <div className="mb-2 block">
        <Label htmlFor={`teaching_hours-${indexRow}`} value={`Knowledge/Remembering ${Remembering}%`} />
      </div>
    {lessonsData[indexRow]['remembering']}
    </div>

    <div className="mb-4">
      <div className="mb-2 block">
        <Label htmlFor={`teaching_hours-${indexRow}`} value={`Comprehension/Understanding ${Understanding}%`} />
      </div>
    {lessonsData[indexRow]['understanding']}
    </div>

    <div className="mb-4">
      <div className="mb-2 block">
        <Label htmlFor={`teaching_hours-${indexRow}`} value={`Application/Applying ${Applying}%`} />
      </div>
    {lessonsData[indexRow]['applying']}
    </div>
    
    <div className="mb-4">
      <div className="mb-2 block">
        <Label htmlFor={`teaching_hours-${indexRow}`} value={`Analysis/Analyzing ${Analyzing}%`} />
      </div>
    {lessonsData[indexRow]['analyzing']}
    </div>

    <div className="mb-4">
      <div className="mb-2 block">
        <Label htmlFor={`teaching_hours-${indexRow}`} value={`Synthesis/Evaluating ${Evaluating}%`} />
      </div>
    {lessonsData[indexRow]['evaluating']}
    </div>

    <div className="mb-4">
      <div className="mb-2 block">
        <Label htmlFor={`teaching_hours-${indexRow}`} value={`Evaluation/Creating ${Creating}%`} />
      </div>
    {lessonsData[indexRow]['creating']}
    </div>

    <div className="mb-4">
      <div className="mb-2 block">
        <Label htmlFor={`teaching_hours-${indexRow}`} value="Total" />
      </div>
    {lessonsData[indexRow]['total']}
    </div>

    <div className="mb-4">
      <div className="mb-2 block">
        <Label htmlFor={`teaching_hours-${indexRow}`} value="Placement" />
      </div>
    {lessonsData[indexRow]['placement']}
    </div>
    
    </div>
    }
  }


  
  const [Title,setTitle] = useState('');
  const [Semester,setSemester] = useState('1st Semester');
  const [AlumniYear,setAlumniYear] = useState('');
  const [CourseCode,setCourseCode] = useState('');
  const [Campus,setCampus] = useState('');
  const [Department,setDepartment] = useState('');
  const [ExaminationType,setExaminationType] = useState('');
  const [CourseType,setCourseType] = useState('');
  const [ExaminationDate,setExaminationDate] = useState('');
  const [Faculty,setFaculty] = useState('');
  const [Chairperson,setChairperson] = useState('');
  const [Dean,setDean] = useState('');
  const [Director,setDirector] = useState('');


// Event handlers for each field
const handleTitle = (event) => {
  setTitle(event.target.value);
  saveDataToLocalStorage();
};

const handleSemester = (event) => {
  setSemester(event.target.value);
  saveDataToLocalStorage();
};

const handleAlumniYear = (event) => {
  setAlumniYear(event.target.value)
  saveDataToLocalStorage();;
};

const handleCampus = (event) => {
  setCampus(event.target.value)
  saveDataToLocalStorage();;
};

const handleCourseCode = (event) => {
  setCourseCode(event.target.value);
  saveDataToLocalStorage();
};

const handleDepartment = (event) => {
  setDepartment(event.target.value);
  saveDataToLocalStorage();
};

const handleExaminationType = (event) => {
  setExaminationType(event.target.value);
  saveDataToLocalStorage();
};

const handleCourseType = (event) => {
  setCourseType(event.target.value);
  saveDataToLocalStorage();
};

const handleExaminationDate = (event) => {
  setExaminationDate(event.target.value);
  saveDataToLocalStorage();
};

const handleFaculty = (event) => {
  setFaculty(event.target.value);
  saveDataToLocalStorage();
};

const handleChairperson = (event) => {
  setChairperson(event.target.value);
  saveDataToLocalStorage();
};

const handleDean = (event) => {
  setDean(event.target.value);
  saveDataToLocalStorage();
};

const handleDirector = (event) => {
  setDirector(event.target.value);
  saveDataToLocalStorage();
};

// Function to save all data to local storage
const saveDataToLocalStorage = () => {
  const data = {
    Title,
    Semester,
    AlumniYear,
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

// Call this function to load data from local storage when the component mounts
const loadDataFromLocalStorage = () => {
  const storedData = localStorage.getItem('formData');
  if (storedData) {
    const data = JSON.parse(storedData);
    setTitle(data.Title || '');
    setSemester(data.Semester || '');
    setAlumniYear(data.AlumniYear || '');
    setCampus(data.Campus || '');
    setCourseCode(data.CourseCode || '');
    setDepartment(data.Department || '');
    setExaminationType(data.ExaminationType || '');
    setCourseType(data.CourseType || '');
    setExaminationDate(data.ExaminationDate || '');
    setFaculty(data.Faculty || '');
    setChairperson(data.Chairperson || '');
    setDean(data.Dean || '');
    setDirector(data.Director || '');

  }
};

// Use the effect hook to load data when the component mounts
useEffect(() => {
  loadDataFromLocalStorage();
 
}, []);






// Function to save all data to local storage
const saveDataToLocalStorageExam = () => {
  const data = {
    ExamTitle,
    Instruction,
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
    setInstruction(data.Instruction || '');
  
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



 
// const handleSubmit =  (e) => {
//   setLoading(true);
//   const lessonsDataJson = JSON.stringify(lessonsData)
//   console.log(lessonsDataJson)
//   e.preventDefault();
//   api
//     .post("/api/tos-content/", { lessonsDataJson })
//     .then((res) => {
//       if (res.status === 201){
//           alert("Note created!");  
//           setLoading(false);
//           setToast(true);
//           localStorage.removeItem('lessonsData');
//       } 
//       else alert("Failed to make note.");
  
//     })
//     .catch((err) => alert(err));
// };


const [examStates, setExamStates] = useState([]);
const [ExamTitle, setExamTitle] = useState('');
const [Instruction, setInstruction] = useState('');

// let examDetails = [{
//   exam_title: ExamTitle,
//   exam_instruction: Instruction,
//   tos_id: 0
// }]


const handleExamTitleChange = (event) => {
  setExamTitle(event.target.value)
  saveDataToLocalStorageExam()
}

const handleInstructionChange = (event) => {
  setInstruction(event.target.value)
  saveDataToLocalStorageExam()
}
console.log('examData: ',localStorage.getItem('examData'))



const handleStateChange = (index, type, value) => {
  const newStates = [...examStates];
  if (type === 'question') {
    newStates[index]['question'] = value;
  } else {
    
    newStates[index]['choices'][type] = value;
  }
  setExamStates(newStates);
  saveDataToLocalStorageQuestion()

};

const handleRadioAnswer = (index, value) => {
  const newStates = [...examStates];
 
    newStates[index]['answer'] = value;

  setExamStates(newStates);
  saveDataToLocalStorageQuestion()

};




useEffect(() => {
 
  setExamStates(
    Array.from({ length:totalItems }, () => ({
      question: '',
      choices: ['', '', '', ''],
      answer: ''
    }))
  );

    loadDataFromLocalStorageQuestion()
  
 

}, [totalItems, exam_id]);






const saveDataToLocalStorageQuestion = () => {
  const data = examStates
 

  localStorage.setItem('questionData', JSON.stringify(data));
};

// Call this function to load data from local storage when the component mounts
const loadDataFromLocalStorageQuestion = () => {
  const storedData = localStorage.getItem('questionData');
 
  if (storedData) {
    const data = JSON.parse(storedData);
   
    setExamStates(data || []);
    
  
  }
};

console.log('examState:',localStorage.getItem('questionData'))
console.log('Examsss2:',examStates)





let examDetails = [{
  exam_title: ExamTitle,
  exam_instruction: Instruction,
  tos_id: 0
}];





const formDataStorage = localStorage.getItem('formData');
const formData = formDataStorage ? JSON.parse(formDataStorage) : null;

const examDataStorage = localStorage.getItem('examData');
const examData = examDataStorage ? JSON.parse(examDataStorage) : null;
const handleSubmit = (e) => {
  setLoading(true);
  const formDataJson = JSON.stringify(formData);
  const lessonsDataJson = JSON.stringify(lessonsData);

  let id_tos = 0
 
  e.preventDefault();

  api.post("/api/tos-info/", { formDataJson })
    .then((firstRes) => {
      console.log(firstRes);  // Log the entire response to see its structure
      if (firstRes.status === 201) {
        const id = firstRes.data[0].id;  // Assuming the ID is in the data of the response
        id_tos = id
        alert("First request successful!");
        console.log("ID of the first request: " + id);
        
        const updatedLessonsData = lessonsData.map((lesson) => {
          // Update the lesson object as needed, for example:
          lesson.teacher_tos = id; // or any other modification
          return lesson;
        });
        const lessonsDataJson = JSON.stringify(updatedLessonsData);


return api.post("/api/tos-content/", { lessonsDataJson })
  .then((secondRes) => {
    console.log(secondRes);
    if (secondRes.status === 201) {

 
      alert("Second request successful!");
      console.log("Second request data:", secondRes.data);

      // Third request example
      const examData =  {
        exam_title: ExamTitle,
        exam_instruction: Instruction,
        tos_id: id_tos
      };

      const examDataJson = JSON.stringify(examData)
      console.log('examrequest:', examDataJson)
      return api.post("/api/create-exams/", {examDataJson})
      .then((thirdRes) => {
        console.log(thirdRes);
        if (thirdRes.status === 201) {
    
     
          alert("third request successful!");
          console.log("third request data:", thirdRes.data);
          const exam_id = thirdRes.data[0].id
          console.log("exam_id: ",exam_id)
    
          // Third request example
          const itemQuestion = examStates.reduce((acc,data,index) =>{

            if(data.question != '' && data.answer != ''){
              acc.push( {
                'question': data.question,
                'answer': data.answer,
                'exam_id': exam_id
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
        
         
              alert("fourth request successful!");
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
                        'answer_text': data.choices[i],
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
      
              return api.post("/api/create-answers/", {itemAnswersJson})
              
            } else {
              throw new Error("fourth request failed.");
            }
          });
    
          
        } else {
          throw new Error("Third request failed.");
        }
      });

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


  return (
    <div>
<form onSubmit={handleSubmit}>
<div className='mb-5'> 

   <h1 className='text-3xl'>Course Information</h1>
   {/* <Progress progress={33} /> */}
   <hr />
   <br />
   <Card className='max-w-3xl mx-auto ' >
    
     <div className='w-full gap-4'>


       {/* Title and Semester */}
       <div className='w-full gap-4 flex flex-col sm:flex-row'>
         <div className='w-full'>
           <div className="mb-2 block">
             <Label htmlFor="title" value="Title" />
           </div>
           <TextInput id="title" type="text" value={Title} onChange={handleTitle} />
         </div>
         <div className="w-full">
           <div className="mb-2 block">
             <Label htmlFor="semester" value="Semester" />
           </div>
           <Select id="semester" value={Semester} onChange={handleSemester} required>
         
             <option value="1st Semester">1st Semester</option>
             <option value="2nd Semester">2nd Semester</option>
         
           </Select>
         </div>
       </div>
   

       {/* Alumni Year and Campus */}
       <div className='w-full gap-4 flex flex-col sm:flex-row'>
         <div className="w-full">
           <div className="mb-2 block">
             <Label htmlFor="alumni-year" value="Alumni Year" />
           </div>
           <TextInput id="title" type="text" value={AlumniYear} onChange={handleAlumniYear} />
         </div>
     
         <div className="w-full">
           <div className="mb-2 block">
             <Label htmlFor="campus" value="Campus" />
           </div>
           <Select id="campus" value={Campus} onChange={handleCampus} required>
             <option value="Main Campus">Main Campus</option>
             <option value="Satellite Campus">Satellite Campus</option>
           </Select>
         </div>
       </div>

       {/* Course Code and Department */}
       <div className='w-full gap-4 flex flex-col sm:flex-row'>
         <div className='w-full'>
           <div className="mb-2 block">
             <Label htmlFor="course-code" value="Course Code" />
           </div>
           <TextInput id="course-code" type="text" value={CourseCode} onChange={handleCourseCode} />
         </div>
         <div className="w-full">
           <div className="mb-2 block">
             <Label htmlFor="department" value="Department" />
           </div>
           <Select id="department" value={Department} onChange={handleDepartment} required>
             <option value="Computer Science">Computer Science</option>
             <option value="Mathematics">Mathematics</option>
             <option value="Physics">Physics</option>
             <option value="Chemistry">Chemistry</option>
           </Select>
         </div>
       </div>

       {/* Type of Examination and Course Type */}
       <div className='w-full gap-4 flex flex-col sm:flex-row'>
         <div className="w-full">
           <div className="mb-2 block">
             <Label htmlFor="exam-type" value="Type of Examination" />
           </div>
           <Select id="exam-type" value={ExaminationType} onChange={handleExaminationType} required>
             <option value="Written">Written</option>
             <option value="Oral">Oral</option>
             <option value="Practical">Practical</option>
           </Select>
         </div>
         <div className='w-full'>
           <div className="mb-2 block">
             <Label htmlFor="course-type" value="Course Type" />
           </div>
           <TextInput id="course-type" type="text" value={CourseType} onChange={handleCourseType} />
         </div>
       </div>

       {/* Date of Examination */}
       <div className='w-full'>
         <div className="mb-2 block">
           <Label htmlFor="exam-date" value="Date of Examination" />
         </div>
         <TextInput id="exam-date" type="date" value={ExaminationDate} onChange={handleExaminationDate} />
       </div>

       {/* Faculty */}
       <div className='w-full'>
         <div className="mb-2 block">
           <Label htmlFor="faculty" value="Faculty" />
         </div>
         <TextInput id="faculty" type="text" value={Faculty} onChange={handleFaculty} />
       </div>

       {/* Department Chairperson */}
       <div className='w-full'>
         <div className="mb-2 block">
           <Label htmlFor="chairperson" value="Department Chairperson" />
         </div>
         <TextInput id="chairperson" type="text" value={Chairperson} onChange={handleChairperson} />
       </div>

       {/* College Dean */}
       <div className='w-full'>
         <div className="mb-2 block">
           <Label htmlFor="dean" value="College Dean" />
         </div>
         <TextInput id="dean" type="text" value={Dean} onChange={handleDean} />
       </div>

       {/* Campus Executive Director */}
       <div className='w-full'>
         <div className="mb-2 block">
           <Label htmlFor="executive-director" value="Campus Executive Director" />
         </div>
         <TextInput id="executive-director" type="text" value={Director} onChange={handleDirector} />
       </div>
     </div>
     {/* <button className='bg-blue-950 hover:bg-blue-800 py-2 text-white rounded-lg'>Next</button> */}

  
   </Card>

</div>

    <Modal show={openModal} onClose={() => setOpenModal(false)}>
         <Modal.Header>Lesson {indexRow+1}</Modal.Header>
         <Modal.Body>
           <div className="space-y-6">
             <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              

        {inputModal(indexRow,lessonsData)}
         
       
             </p>
           
           </div>
         </Modal.Body>
         <Modal.Footer>
          <div className=" w-full">
           <Button onClick={() => setOpenModal(false)} className="mx-auto">Done</Button>
           </div>
         </Modal.Footer>
       </Modal>
       {Toast  && <ToastMessage message = "Table successfully Created!"/>}
      {loading  && <LoadingPage/>}
      
      <h1 className="text-3xl">Course content</h1>
      {/* <Progress progress={66} /> */}
      <hr />
      <br />
      <Card>
       
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
  
    
      size="lg"
     
    
    />
   
      {checkTaxonomy(getTotalTaxonomy)} </span>
      <span className="max-w-96 ml-6 flex justify-end ">
        <div className="w-10 font-bold">
        {getTotalTaxonomy}%</div></span> 
      
      </div>
      </Card>

      </div>

    

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
                <TableRow hover role="checkbox" tabIndex={-1} key={index} onClick={(event) => handleModalRow(event, index)} className="cursor-pointer ">
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align} > 
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
      <Button  onClick={() => addLesson({  
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

      <Button color="failure" onClick={() => removeLesson(lessonsData)}><RemoveCircleOutlineIcon className="mr-2"/>Decrease Lesson</Button>

      <Button color="failure" ><VisibilityIcon className="mr-2"/>Preview</Button>
      </div>
      </div>
      </div>

      
      
      </Card>

      <Exam items={totalItems} tos_id={tos_id} lessonsData={lessonsData} examStates={examStates} handleStateChange={handleStateChange} ExamTitle={ExamTitle} handleExamTitleChange={handleExamTitleChange} Instruction={Instruction} handleInstructionChange={handleInstructionChange} handleRadioAnswer={handleRadioAnswer}  />


    

      <div className="mt-3">
      <Button className="mx-auto" type="submit" color="success">Submit</Button>
      </div>
      </form>
    </div>
  );
}

export default TOS
