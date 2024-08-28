import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card,Progress,Label, Textarea, TextInput,Button,RangeSlider,Modal,Select,Breadcrumb } from "flowbite-react";
import api from "../api";
import { HiHome } from "react-icons/hi";
import TaxonomyAllocation from './TaxonomyAllocation';
import Tableofspecs from './Tableofspecs';

import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ExamUpdate from './ExamUpdate';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';


import ReactDOM from 'react-dom';
import { PDFViewer } from '@react-pdf/renderer';
import PdfUpdate from "./PdfUpdate";
import Examtest from "./Examtest";
import LoadingSubmit from "./LoadingSubmit";
import ToastMessage from "./Toast";


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

function TOSview() {
  const [TOSContent, setTOSContent] = useState([]);
  const [TOSInfo, setTOSInfo] = useState([]);

  const [answerChoices, setAnswerChoices] = useState([]);
  const [submitToast,setSubmitToast] = useState(false);
  const [Submit,setSubmit] = useState(false);

  
  const [loading, setLoading] = useState(false);
  const [Toast, setToast] = useState(false);
  const [TotalItems, setTotalItems] = useState(0);
  const [formData, setFormData] = useState({
    Title: '',
    Semester: '1st Semester',
    AcademicYear: '',
    Campus: 'San Carlos Campus',
    CourseCode: '',
    Department: 'Business and Office Administration',
    ExaminationType: 'Multiple choices',
    CourseType: '',
    ExaminationDate: '',
    Faculty: '',
    Chairperson: '',
    Dean: '',
    Director: ''
  });

  const [lessonData,setLessonData] = useState([{  
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
  TotalItems:0,
  teacher_tos: 0,
  }])
  const [getTestPart, setGetTestPart] = useState([]);
  const [TestPart, setTestPart] = useState([]);
  const [exam,setExam] = useState([])

  const [getQuestion, setGetQuestion] = useState([]);
  const [getAnswer, setGetAnswer] = useState([]);
  const [examStates, setExamStates] = useState([]);




  const { id } = useParams();
  
  const[exam_id,setExam_ID] = useState([]);
  useEffect(() => {
    if (id) {
      getTOSContent();
      getTOSInfo();
      getExam();
    
    }
  }, [id]);

  useEffect(() => {
    if (TOSInfo.length) {
      setFormData({
 
        Title: TOSInfo[0].Title,
        Semester: TOSInfo[0].Semester,
        AcademicYear: TOSInfo[0].AcademicYear,
        Campus: TOSInfo[0].Campus,
        CourseCode: TOSInfo[0].CourseCode,
        Department: TOSInfo[0].Department,
        ExaminationType: TOSInfo[0].ExaminationType,
        CourseType: TOSInfo[0].CourseType,
        ExaminationDate: TOSInfo[0].ExaminationDate,
        Faculty: TOSInfo[0].Faculty,
        Chairperson: TOSInfo[0].Chairperson,
        Dean: TOSInfo[0].Dean,
        Director: TOSInfo[0].Director
      });
    }
  
    if (TOSContent.length) {
      // Map over TOSContent to update lessonData
      const updatedLessonData = TOSContent.map((content) => ({
        id:content.id,
        topic: content.topic,
        learning_outcomes: content.learning_outcomes || '',
        teachingHours: content.teachingHours || 0,
        allocation: content.allocation || 0,
        items: content.items || 0,
        remembering: content.remembering || 0,
        understanding: content.understanding || 0,
        applying: content.applying || 0,
        analyzing: content.analyzing || 0,
        evaluating: content.evaluating || 0,
        creating: content.creating || 0,
        total: content.total || 0,
        placement: content.placement || '',
        TotalItems: content.TotalItems || 0,
        teacher_tos: content.teacher_tos || 0,
       
      }));

      const updateTotalItems = TOSContent.reduce((total, content) => total + content.items, 0);

      const calculatePercentage = (totalValue, TotalItems) => (totalValue / TotalItems) * 100;


// Sum for each category
const totalRemembering = TOSContent.reduce((total, content) => total + content.remembering, 0);
const totalUnderstanding = TOSContent.reduce((total, content) => total + content.understanding, 0);
const totalApplying = TOSContent.reduce((total, content) => total + content.applying, 0);
const totalAnalyzing = TOSContent.reduce((total, content) => total + content.analyzing, 0);
const totalEvaluating = TOSContent.reduce((total, content) => total + content.evaluating, 0);
const totalCreating = TOSContent.reduce((total, content) => total + content.creating, 0);

// Calculate percentages
const updateRemembering = calculatePercentage(totalRemembering, updateTotalItems);
const updateUnderstanding = calculatePercentage(totalUnderstanding, updateTotalItems);
const updateApplying = calculatePercentage(totalApplying, updateTotalItems);
const updateAnalyzing = calculatePercentage(totalAnalyzing, updateTotalItems);
const updateEvaluating = calculatePercentage(totalEvaluating, updateTotalItems);
const updateCreating = calculatePercentage(totalCreating, updateTotalItems);

// Set state for each percentage
setRemembering(updateRemembering);
setUnderstanding(updateUnderstanding);
setApplying(updateApplying);
setAnalyzing(updateAnalyzing);
setEvaluating(updateEvaluating);
setCreating(updateCreating);
      setTotalItems(updateTotalItems);
      setLessonData(updatedLessonData);  // Replace the entire lessonData with the mapped content
    }


if(exam.length){
  setExamTitle(exam[0].exam_title)
  setExam_ID(exam[0].id)
 
}

if(getTestPart.length){

  const updatedTestPart = getTestPart.map((content) => (
    {  
      id: content.id,
      test_type: content.test_type,
      test_instruction: content.test_instruction,
      test_part_num: content.test_part_num,
      exam_id: content.exam_id
    
    }
   
  ));

  setTestPart(updatedTestPart); 

}

if (getQuestion.length && getAnswer.length) {
  const updatedExamStates = getQuestion.map((content, index) => {
    // Find the corresponding answers for this question
    const correspondingAnswers = getAnswer[index];

    // Initialize choices array
    const choices = ['', '', '', ''];
    
    const answerid = []
    // If there are corresponding answers, map them to choices
    if (correspondingAnswers && correspondingAnswers.length) {
      correspondingAnswers.forEach((answer) => {
        // Match the choices A, B, C, D to the answer_text
        
        console.log('answerdebug',answer.id)
        answerid.push(answer.id)
      
        switch (answer.choices) {
          case 'A':
            choices[0] = answer.answer_text;
            break;
          case 'B':
            choices[1] = answer.answer_text;
            break;
          case 'C':
            choices[2] = answer.answer_text;
            break;
          case 'D':
            choices[3] = answer.answer_text;
            break;
          default:
            break;
        }
      });
    }

    return { 
      question_id: content.id,
      question: content.question,
      answer_id: answerid,
      choices: choices,  // Insert the updated choices here
      question_type: content.question_type,
      exam_id:content.exam_id,
      answer: content.answer,
      test_part_num: content.test_part.test_part_num,
      test_part_id: content.test_part_id
    };
  });

  setExamStates(updatedExamStates);

  setAnswerChoices( examStates.reduce((acc,data,index) =>{

                 
    const answers = ['A','B','C','D']
    
    for(let i = 0; i< 4; i++){
      if(data.choices[i] != '' && data.answer != ''){
        acc.push({
          'answer_id': data.answer_id[i],
          'answer_text': data.choices[i],
          'choices': answers[i],
          'question_id': data.question_id
        });
      }
    }

    return acc
  }, [])

)
  
}


  }, [TOSInfo, TOSContent,exam,getTestPart,getQuestion,getAnswer]);
  

  const getTOSContent = () => {
    api
      .get(`/api/tos-content/${id}/detail/`)
      .then((res) => res.data)
      .then((data) => {setTOSContent(data)
        console.log('toscontent: ', data);
      })
      .catch((err) => alert(err));
  };

 

  const getExam = () => {
    api
      .get(`/api/exam/${id}/detail/`)
      .then((res) => res.data)
      .then((data) => {
        setExam(data);
        console.log('examcontent: ', data);
       
  
        // Assuming we want to make a second API call based on tos_id
        return api.get(`/api/test-part/${data[0].id}/detail/`);
      })
      .then((testPart) => {
        
        // Handle the result of the second query
        console.log('TOS data: ', testPart.data);
        setGetTestPart(testPart.data)
        // Set some state based on the second query if needed

        return api.get(`/api/questions/${testPart.data[0].exam_id}/detail/`);
      })
      .then((question)=>{

         console.log('ques data: ', question.data);
        setGetQuestion(question.data)
         // Assuming `exam_id` is an array of question IDs
      const questionIds = question.data.map((exam) => exam.id);

      // Fetch all questions for each exam ID
      const questionPromises = questionIds.map((examId) =>
        api.get(`/api/answers/${examId}/detail/`)
      );

      // Use Promise.all to handle multiple requests
      return Promise.all(questionPromises);

        // console.log('ques data: ', question.data);
        // setGetQuestion(question.data)
        // return api.get(`/api/answers/${question.data[0].exam_id}/detail/`);
      })
      .then((answer) => {
        const allAnswers = answer.map((response) => response.data);

          console.log('answersdata: ',allAnswers)
          setGetAnswer(allAnswers)
      })
      .catch((err) => alert(err));
  };

 
  const getTOSInfo = () => {
    api
      .get(`/api/tos-info/${id}/detail/`)
      .then((res) => res.data)
      .then((data) => {
        setTOSInfo(data);
        console.log('tosinfo: ', data);
      })
      .catch((err) => alert(err));
  };

  const updateTOSinfo = async (e) => {
    e.preventDefault();
    try {

      formData.Status = Submit===true?1:0

      await api.put(`/api/tos-info/${id}/update/`, formData);
      

      setLoading(true);




         const updateOrCreateTOScontent = async (data) =>{
          try{
            const content = await api.put(`/api/tos-content/${data.id}/update/`, data);
            return content; // Return the successful update response
          }
          catch(error) {
            if (error.response && error.response.status === 404) {
              const lessonsDataJson = JSON.stringify([
                {
                  topic: data.topic,
                  learning_outcomes: data.learning_outcomes,
                  teachingHours: data.teachingHours,
                  allocation: data.allocation ,
                  items: data.items,
                  remembering: data.remembering,
                  understanding: data.understanding,
                  applying: data.applying,
                  analyzing: data.analyzing,
                  evaluating: data.evaluating,
                  creating: data.creating,
                  total: data.total,
                  placement: data.placement,
                  TotalItems: data.TotalItems,
                  teacher_tos: id,
                }
              ]);

              return await api.post("/api/tos-content/", { lessonsDataJson })
        
            }
            else {
              throw new Error("Failed to create toscontent.");
            }
          }

         }

         const updatePromisesTOScontent = lessonData.map(updateOrCreateTOScontent);
        
         // Await all the promises to complete
         try {
           const results = await Promise.all(updatePromisesTOScontent);
           console.log('Responses:', results); // Array of responses for each operation
         } catch (error) {
           console.error('Error in updating or creating tos content:', error);
         }

         

         await api.put(`/api/exam/${exam_id}/update/`, {
          'exam_title':ExamTitle,
          'tos_id': id
         });

         const updateOrCreateTestPart = async (data) => {
          try {
            // Attempt to update the test part
            const testpart = await api.put(`/api/test-part/${data.id}/update/`, data);
            return testpart; // Return the successful update response
          } catch (error) {
            if (error.response && error.response.status === 404) {
              // If the test part doesn't exist, create a new one
              const itemTestPartJson = JSON.stringify([{
                'test_type': data.test_type,
                'test_instruction': data.test_instruction,
                'test_part_num': data.test_part_num,
                'exam_id': data.exam_id
              }]);
        
              try {
                const testPartRes = await api.post("/api/create-testpart/", { itemTestPartJson });
                if (testPartRes.status === 201) {
                  const createdTestPart = Array.isArray(testPartRes.data) ? testPartRes.data[0] : testPartRes.data;
                  console.log('createdtestpartid:', createdTestPart.id);
        
                  // Accumulate related questions based on the created test part's type
                  const itemsQues = examStates.reduce((acc, dataques) => {
                    if (dataques.question_type === createdTestPart.test_type) {
                      acc.push({
                        'question': dataques.question,
                        'answer': dataques.answer,
                        'question_type': dataques.question_type,
                        'choices':dataques.choices,
                        'exam_id': data.exam_id,
                        'test_part_id': createdTestPart.id // Use the newly created test part ID
                      });
                    }
                    return acc;
                  }, []);
        
                  if (itemsQues.length > 0) {
                    // Now handle related questions and answers creation
                    const itemQuestionJson = JSON.stringify(itemsQues);
        
                    const questionRes = await api.post("/api/create-questions/", { itemQuestionJson });
                    if (questionRes.status === 201) {
                      const question_data = questionRes.data;
        
                      let ques_ids = question_data.map(q => q.id);
        
                      let itemAnswers = itemsQues.flatMap((dataques,dataIndex) => {
                        return dataques.choices.map((choice, index) => {
                          const answers = ['A', 'B', 'C', 'D'];
        
                          return {
                            'answer_text': choice,
                            'choices': answers[index],
                            'question_id': ques_ids[dataIndex] // Assuming all choices relate to the same question ID
                          };
                        }).filter(answer => answer.answer_text !== '');
                      });
        
                      const itemAnswersJson = JSON.stringify(itemAnswers);
                      return await api.post("/api/create-answers/", { itemAnswersJson });
                    } else {
                      throw new Error("Failed to create questions.");
                    }
                  } else {
                    console.log('No matching questions for the created test part.');
                  }
                } else {
                  throw new Error("Failed to create test part.");
                }
              } catch (error) {
                console.error('Error in creating test part or related questions:', error);
                throw error;
              }
            } else {
              // If it's another type of error, rethrow it
              throw error;
            }
          }
        };
        
        const updatePromisesTestPart = TestPart.map(updateOrCreateTestPart);
        
        // Await all the promises to complete
        try {
          const resulttest = await Promise.all(updatePromisesTestPart);
          console.log('Responses:', resulttest); // Array of responses for each operation
        } catch (error) {
          console.error('Error in updating or creating test parts:', error);
        }
        
        


        const updateOrCreateQuestion = async (data) => {
          try {
            // Attempt to update the question
            const ques = await api.put(`/api/questions/${data.question_id}/update/`, data);
            return ques; // Return the successful update response
          } catch (error) {
            if (error.response && error.response.status === 404) {
              // If there's an error (e.g., question doesn't exist), create a new question
              if(data.test_part_id === undefined){
                return null
              }
              const itemQuestionJson = JSON.stringify([
                {
                  'question': data.question,
                  'answer': data.answer,
                  'question_type': data.question_type,
                  'exam_id': data.exam_id,
                  'test_part_id': data.test_part_id
                }
              ]);
        
              try {
                const fourthRes = await api.post("/api/create-questions/", { itemQuestionJson });
                if (fourthRes.status === 201) {
                  const question_data = fourthRes.data;
        
                  let ques_ids = question_data.map(q => q.id);
        
                  let itemAnswers = data.choices.map((choice, index) => {
                    const answers = ['A', 'B', 'C', 'D'];
        
                    return {
                      'answer_text': choice,
                      'choices': answers[index],
                      'question_id': ques_ids[0] // Assuming all choices relate to the same question ID
                    };
                  }).filter(answer => answer.answer_text !== '');
        
                  const itemAnswersJson = JSON.stringify(itemAnswers);
                  return await api.post("/api/create-answers/", { itemAnswersJson });
        
                } else {
                  throw new Error("Failed to create question.");
                }
              } catch (error) {
                console.error('Error creating new question:', error);
                throw error;
              }
            } else {
              // If there's another type of error, throw it again
              throw error;
            }
          }
        };
        
        const updatePromisesExamStates = examStates.map(updateOrCreateQuestion);
        
        // Await all the promises to complete
        try {
          const results = await Promise.all(updatePromisesExamStates);
          console.log('Responses:', results); // Array of responses for each operation
        } catch (error) {
          console.error('Error in updating or creating questions:', error);
        }
        const updatePromisesAnswerChoices = answerChoices.map(async (data) => {
          try {
            const ans = await api.put(`/api/answers/${data.answer_id}/update/`, data);
            return ans; // Return the successful update response
          } catch (error) {
            if (error.response && error.response.status === 404) {

              const itemAnswers = answerChoices.reduce((acc,data) =>{
                if(data.answer_id === undefined && data.question_id != null){
                  acc.push({
                    'answer_text': data.answer_text,
                    'choices': data.choices,
                    'question_id': data.question_id
                  });
                }
                return acc
              },[])
              const itemAnswersJson = JSON.stringify(itemAnswers);
              const createdAnswer = await api.post("/api/create-answers/", { itemAnswersJson });
              return createdAnswer; // Return the successful creation response
            } else {
              // If it's another type of error, rethrow it
              throw error;
            }
          }
        });
        
        try {
          const resultsans = await Promise.all(updatePromisesAnswerChoices);

          console.log('Responses:', resultsans); // Array of responses for each operation

          const AdminNotifDataJson = JSON.stringify({
            notification_text: "user updated this exam again",
            tos: id,
          })
          await api.post(`api/notification/admin/`, {AdminNotifDataJson});


        } catch (error) {
          console.error('Error in updating or creating answers:', error);
        }
        

      //   const updatePromisesAnswerChoices = answerChoices.map((data) => 
      //     api.put(`/api/answers/${data.answer_id}/update/`, data)
      //   );

      // const ans = await Promise.all(updatePromisesAnswerChoices);
      //  console.log("ansdebug :", ans)



      setLoading(false);
      Submit===true?setSubmitToast(true):setToast(true)
        
    } catch (error) {
      console.error('Error updating TOSInfo:', error);
      // Optional: Show a more user-friendly message or use a toast notification
    }
  };


  const handleChange = (event) => {
    const { name, value } = event.target;
    const updatedFormData = {
      ...formData,
      [name]: value
    };
    setFormData(updatedFormData);
   
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

const [Remembering, setRemembering] = React.useState(0);
  const [Understanding, setUnderstanding] = React.useState(0);
  const [Applying, setApplying] = React.useState(0);
  const [Analyzing, setAnalyzing] = React.useState(0);
  const [Evaluating, setEvaluating] = React.useState(0);
  const [Creating, setCreating] = React.useState(0);


  function hundred(value){
    if(value < 0 || value > 100){
      return 0

    }
    else{
      return value
    }
   }

const handleTotalItemsChange = (event) => {
  setTotalItems(event.target.value);
};

const handleRememberingChange = (event) => {

  setRemembering(hundred(event.target.value));
 

};



const handleUnderstandingChange = (event) => {
  setUnderstanding(hundred(event.target.value));
 
  
};

const handleApplyingChange = (event) => {
  setApplying(hundred(event.target.value));
 
 
};

const handleAnalyzingChange = (event) => {
  setAnalyzing(hundred(event.target.value));
 

};

const handleEvaluatingChange = (event) => {
  setEvaluating(hundred(event.target.value));
 
  
};

const handleCreatingChange = (event) => {
  setCreating(hundred(event.target.value));
 

};
let getTotalTaxonomy = Number(Remembering) + Number(Understanding) + Number(Applying) + Number(Analyzing) + Number(Evaluating) + Number(Creating)

function checkTaxonomy(getTotalTaxonomy){
  let check = 100-getTotalTaxonomy

  if(check >= 0){
    return <span className="w-full">{check}% remaining</span>
  }
  else{
    return <span className="w-full text-red-700">Taxonomy allocation exceeds 100%</span>
  }

 }

 const columns = [
  { id: "topic", label: "Lesson/Topic", minWidth: 170  },
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

const rows = lessonData.map((data, index) =>
  createData(
  <div className="max-w-36  max-h-10  overflow-hidden" style={{maxHeight:'100'}} key={index}> {data.topic}</div>,
  <div className="max-w-36  overflow-hidden" style={{maxHeight:'100'}} key={index}> {data.learning_outcomes}</div>,
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

const handleReset = (i) => {
  // Clone the lessonsData array to avoid direct mutation
  const newData = [...lessonData];


      // Recalculate fields based on the updated teachingHours
      newData[i]['allocation'] = getAllocation(Number(newData[i]['teachingHours']), getTotalHours());
      newData[i]['items'] = getNumItems(TotalItems, newData[i]['allocation']);
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

   
      newData[i]['totalItems'] = TotalItems;
  
  // Update the state with the new data
  setLessonData(newData);

 
};



const removeLesson = (lessonsData, index) => {
  let myArray = lessonsData.slice(); // Create a shallow copy of the array

  // Check if the index is valid and the array is not empty
  if (myArray && myArray.length > 0 && index >= 0 && index < myArray.length) {
    // Remove the item at the specified index
    myArray.splice(index, 1);

    if(lessonData[index].id!==undefined){

      api.delete(`api/toscontent/delete/${lessonData[index].teacher_tos}/${lessonData[index].id}/`).then((res) => {
        if (res.status === 204) alert("table of specification deleted!");
        else alert("Failed to delete table of specification.");
       
      })
      .catch((error) => alert(error));
    }

   

    // Update the state with the modified array
    setLessonData(myArray);


  } else {
    console.log('Invalid index or array is empty.');
  }
};




const [openModal, setOpenModal] = useState(false);
const [indexRow, setIndexRow] = useState(0);

const handleModalRow = (event,index) => {
  setOpenModal(true)
  setIndexRow(index)
 
}

function inputModal(indexRow,lessonData){
  if(lessonData[indexRow] === undefined){
    return ''
  }
  else{
    return(
    <Modal size={'7xl'} show={openModal} onClose={() => setOpenModal(false)}>
    <Modal.Header>Lesson {indexRow+1}</Modal.Header>
    <Modal.Body>
      <div className="space-y-6 " >
        <div className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
         

    <div className="flex gap-5">  
       <div style={{flex:1}} className="flex flex-col">
        <Card className="h-full">
      <div className="mb-3 flex-1">
     
    <div className="mb-2 block">
      <Label htmlFor={`topic-${indexRow}`} value="Lesson/Topic" />
    </div>
    <Textarea
      id={`topic-${indexRow}`}
      value={lessonData[indexRow]['topic']}
     style={{height:'90%'}}
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
      value={lessonData[indexRow]['learning_outcomes']}
      style={{height:'90%'}}
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
      <Label htmlFor={`teaching_hours-${indexRow}`} value="No. of Teaching Hours" />
    </div>
    <TextInput
      id={`teaching_hours-${indexRow}`}
      type="number"
      style={{maxWidth:'200px'}}
      value={lessonData[indexRow]['teachingHours']}
      onChange={(e) => handleLessonDataChange(indexRow, 'teachingHours', e.target.value)}
      required
    />
  </div>

  <div className="mb-3 flex" style={{borderBottomStyle:'solid',borderBottomWidth:1}}>
<div className="mb-2 block flex-1">
  <Label htmlFor={`teaching_hours-${indexRow}`} value="% of Allocation" />
</div>
<span className=" flex-1 text-right text-black">
  {lessonData[indexRow]['allocation']}%
</span>
<span className="text-right text-black font-bold" style={{flex: 0.2}}>
  {/* Additional data if needed */}
</span>
</div>

<div className="mb-3 flex" style={{borderBottomStyle:'solid',borderBottomWidth:1}}>
<div className="mb-2 block flex-1">
  <Label htmlFor={`teaching_hours-${indexRow}`} value="Number of Items" />
  <div className="flex gap-3 px-3">
    <Button size={'xs'} onClick={(e) => handleFloor(indexRow, 'items', lessonData[indexRow]['items'])}><ArrowDownwardIcon /> <span className="mt-1">floor</span></Button>
    <Button size={'xs'} onClick={(e) => handleCeil(indexRow, 'items', lessonData[indexRow]['items'])}><ArrowUpwardIcon/> <span className="mt-1">ceil</span></Button>

  </div>
</div>
<span className=" flex-1 text-right text-black">
  {/* Additional percentage or related info if needed */}
</span>
<span className="text-right text-black font-bold" style={{flex: 0.2}}>
  {lessonData[indexRow]['items']}
</span>
</div>


  <div className="mb-3 flex" style={{borderBottomStyle:'solid',borderBottomWidth:1}}>
    <div className="mb-2 block flex-1">
      <Label htmlFor={`teaching_hours-${indexRow}`} value={`Knowledge/Remembering `} />
      <div className="flex gap-3 px-3">
      <Button size={'xs'} onClick={(e) => handleFloor(indexRow, 'remembering', lessonData[indexRow]['remembering'])}><ArrowDownwardIcon /> <span className="mt-1">floor</span></Button>
      <Button size={'xs'} onClick={(e) => handleCeil(indexRow, 'remembering', lessonData[indexRow]['remembering'])}><ArrowUpwardIcon/> <span className="mt-1">ceil</span></Button>

  </div>
      
    </div>
    <span className=" flex-1 text-right text-black">
      {Remembering}%
    </span>
    <span className=" text-right text-black font-bold" style={{flex:0.2}}>
  {lessonData[indexRow]['remembering']}
  </span>
 
  </div>

  <div className="mb-3 flex" style={{borderBottomStyle:'solid',borderBottomWidth:1}}>
<div className="mb-2 block flex-1">
  <Label htmlFor={`teaching_hours-${indexRow}`} value={`Comprehension/Understanding`} />
  <div className="flex gap-3 px-3">
      <Button size={'xs'} onClick={(e) => handleFloor(indexRow, 'understanding', lessonData[indexRow]['understanding'])}><ArrowDownwardIcon /> <span className="mt-1">floor</span></Button>
      <Button size={'xs'} onClick={(e) => handleCeil(indexRow, 'understanding', lessonData[indexRow]['understanding'])}><ArrowUpwardIcon/> <span className="mt-1">ceil</span></Button>

  </div>
</div>
<span className=" flex-1 text-right text-black">
  {Understanding}%
</span>
<span className="text-right text-black font-bold" style={{flex: 0.2}}>
  {lessonData[indexRow]['understanding']}
</span>
</div>

<div className="mb-3 flex" style={{borderBottomStyle:'solid',borderBottomWidth:1}}>
<div className="mb-2 block flex-1">
  <Label htmlFor={`teaching_hours-${indexRow}`} value={`Application/Applying`} />
  <div className="flex gap-3 px-3">
      <Button size={'xs'} onClick={(e) => handleFloor(indexRow, 'applying', lessonData[indexRow]['applying'])}><ArrowDownwardIcon /> <span className="mt-1">floor</span></Button>
      <Button size={'xs'} onClick={(e) => handleCeil(indexRow, 'applying', lessonData[indexRow]['applying'])}><ArrowUpwardIcon/> <span className="mt-1">ceil</span></Button>

  </div>
</div>
<span className=" flex-1 text-right text-black">
  {Applying}%
</span>
<span className="text-right text-black font-bold" style={{flex: 0.2}}>
  {lessonData[indexRow]['applying']}
</span>
</div>

<div className="mb-3 flex" style={{borderBottomStyle:'solid',borderBottomWidth:1}}>
<div className="mb-2 block flex-1">
  <Label htmlFor={`teaching_hours-${indexRow}`} value={`Analysis/Analyzing`} />
  <div className="flex gap-3 px-3">
      <Button size={'xs'} onClick={(e) => handleFloor(indexRow, 'analyzing', lessonData[indexRow]['analyzing'])}><ArrowDownwardIcon /> <span className="mt-1">floor</span></Button>
      <Button size={'xs'} onClick={(e) => handleCeil(indexRow, 'analyzing', lessonData[indexRow]['analyzing'])}><ArrowUpwardIcon/> <span className="mt-1">ceil</span></Button>

  </div>
</div>
<span className=" flex-1 text-right text-black">
  {Analyzing}%
</span>
<span className="text-right text-black font-bold" style={{flex: 0.2}}>
  {lessonData[indexRow]['analyzing']}
</span>
</div>

<div className="mb-3 flex" style={{borderBottomStyle:'solid',borderBottomWidth:1}}>
<div className="mb-2 block flex-1">
  <Label htmlFor={`teaching_hours-${indexRow}`} value={`Synthesis/Evaluating`} />
  <div className="flex gap-3 px-3">
      <Button size={'xs'} onClick={(e) => handleFloor(indexRow, 'evaluating', lessonData[indexRow]['evaluating'])}><ArrowDownwardIcon /> <span className="mt-1">floor</span></Button>
      <Button size={'xs'} onClick={(e) => handleCeil(indexRow, 'evaluating', lessonData[indexRow]['evaluating'])}><ArrowUpwardIcon/> <span className="mt-1">ceil</span></Button>

  </div>
</div>
<span className=" flex-1 text-right text-black">
  {Evaluating}%
</span>
<span className="text-right text-black font-bold" style={{flex: 0.2}}>
  {lessonData[indexRow]['evaluating']}
</span>
</div>

<div className="mb-3 flex" style={{borderBottomStyle:'solid',borderBottomWidth:1}}>
<div className="mb-2 block flex-1">
  <Label htmlFor={`teaching_hours-${indexRow}`} value={`Evaluation/Creating`} />
  <div className="flex gap-3 px-3">
      <Button size={'xs'} onClick={(e) => handleFloor(indexRow, 'creating', lessonData[indexRow]['creating'])}><ArrowDownwardIcon /> <span className="mt-1">floor</span></Button>
      <Button size={'xs'} onClick={(e) => handleCeil(indexRow, 'creating', lessonData[indexRow]['creating'])}><ArrowUpwardIcon/> <span className="mt-1">ceil</span></Button>

  </div>
</div>
<span className=" flex-1 text-right text-black">
  {Creating}%
</span>
<span className="text-right text-black font-bold" style={{flex: 0.2}}>
  {lessonData[indexRow]['creating']}
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
  {lessonData[indexRow]['total']}
</span>
</div>

<div className="mb-3 flex" style={{borderBottomStyle:'solid',borderBottomWidth:1}}>
<div className="mb-2 block flex-1">
  <Label htmlFor={`teaching_hours-${indexRow}`} value="Placement" />
</div>
<span className=" flex-1 text-right text-black">
  {/* If there's a percentage or similar value, you can place it here */}
</span>
<span className="text-right text-black font-bold" style={{flex: 0.2}}>
  {lessonData[indexRow]['placement']}
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
          <Button color="failure" onClick={() => removeLesson(lessonData,indexRow)}><RemoveCircleOutlineIcon className="mr-2"/>Remove Lesson</Button>
         <Button onClick={() => setOpenModal(false)}  color={'success'}>Done</Button>
         
         </div>
         </div>
       </Modal.Footer>
     </Modal>)
     
  }
}


function getRemembering(remembering,items){

  return (remembering/100)*items
}

function getUnderstanding(Understanding,items){

  return (Understanding/100)*items
}

function getApplying(Applying,items){

  return (Applying/100)*items
}
function getAnalyzing(Analyzing,items){

  return (Analyzing/100)*items
}
function getEvaluating(Evaluating,items){

  return (Evaluating/100)*items
}
function getCreating(Creating,items){

  return (Creating/100)*items
}

function getAllocation(hours,totalHours){

  return Math.round((hours / totalHours) * 100);
}
function getTotalHours(){
  let hours= lessonData.reduce((acc, data) => {
     return acc + Number(data.teachingHours);
   }, 0);
 
 
 
   return hours
 }
 let placements = [];

for(let i = 1; i<=TotalItems; i++){
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
 
function getNumItems(TotalItems,allocation){
  const allocationDecimal = allocation / 100;
  return TotalItems * allocationDecimal
 

}

function getTotal(remembering,understanding,applying,analyzing,evaluating,creating){

  return remembering+understanding+applying+analyzing+evaluating+creating
}

const handleLessonDataChange = (index, field, value) => {
  // Clone the lessonData array to avoid direct mutation
  const newData = [...lessonData];

  // Update the specific field in the corresponding lesson object
  newData[index][field] = value;



  if (field === 'teachingHours') {
    for (let i = 0; i < newData.length; i++) {
      // Recalculate fields based on the updated teachingHours
      newData[i]['allocation'] = getAllocation(Number(newData[i][field]), getTotalHours());
      newData[i]['items'] = getNumItems(TotalItems, newData[i]['allocation']);
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
      newData[i]['totalItems'] = TotalItems;
    }
  }

  // Update the state with the new data
  setLessonData(newData);

 
};


const handleCeil = (index, field, value) => {

  const newData = [...lessonData];

  // Update the specific field in the corresponding lesson object
  newData[index][field] = value;



  if (field === 'items' ) {
    for (let i = 0; i < newData.length; i++) {
      // Recalculate fields based on the updated teachingHours
      newData[i]['allocation'] = getAllocation(Number(newData[i]['teachingHours']), getTotalHours());
      if(i == index){
        newData[i]['items'] = Math.ceil(getNumItems(TotalItems, newData[i]['allocation']));
      }
      else{
        if(newData[i]['items']%1 != 0){
        newData[i]['items'] = getNumItems(TotalItems, newData[i]['allocation']);
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
      newData[i]['totalItems'] = TotalItems;
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
      newData[i]['totalItems'] = TotalItems;
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
      newData[i]['totalItems'] = TotalItems;
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
      newData[i]['totalItems'] = TotalItems;
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
      newData[i]['totalItems'] = TotalItems;
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
      newData[i]['totalItems'] = TotalItems;
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
      newData[i]['totalItems'] = TotalItems;
    }
  }


  // Update the state with the new data
  setLessonData(newData);


};



const handleFloor = (index, field, value) => {
  // Clone the lessonsData array to avoid direct mutation
  const newData = [...lessonData];

  // Update the specific field in the corresponding lesson object
  newData[index][field] = value;



  if (field === 'items' ) {
    for (let i = 0; i < newData.length; i++) {
      // Recalculate fields based on the updated teachingHours
      newData[i]['allocation'] = getAllocation(Number(newData[i]['teachingHours']), getTotalHours());
      if(i == index){
        newData[i]['items'] = Math.floor(getNumItems(TotalItems, newData[i]['allocation']));
      }
      else{
        if(newData[i]['items']%1 != 0){
        newData[i]['items'] = getNumItems(TotalItems, newData[i]['allocation']);
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
      newData[i]['totalItems'] = TotalItems;
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
      newData[i]['totalItems'] = TotalItems;
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
      newData[i]['totalItems'] = TotalItems;
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
      newData[i]['totalItems'] = TotalItems;
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
      newData[i]['totalItems'] = TotalItems;
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
      newData[i]['totalItems'] = TotalItems;
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
      newData[i]['totalItems'] = TotalItems;
    }
  }


  // Update the state with the new data
  setLessonData(newData);


};

const addLesson = (newLesson) => {
  const updatedLessons = [...lessonData, newLesson];
  setLessonData(updatedLessons);
 
};


const [PdfModal, setPdfModal] = useState(false);


const [ExamTitle, setExamTitle] = useState('');


const handleStateChange = (index, type, value) => {
  const newStates = [...examStates];
  if (type === 'question') {
    newStates[index]['question'] = value;
  } else {
    
    newStates[index]['choices'][type] = value;
  }
  setExamStates(newStates);

  setAnswerChoices( newStates.reduce((acc,data,index) =>{

                 
    const answers = ['A','B','C','D']
    

      if(data.answer_id != undefined){
    for(let i = 0; i< 4; i++){
      if(data.choices[i] != '' && data.answer != ''){
      
        acc.push({
          'answer_id': data.answer_id[i],
          'answer_text': data.choices[i],
          'choices': answers[i],
          'question_id': data.question_id
        });
      }
      
    }

    
  }
  else{
    for(let i = 0; i< 4; i++){
      if(data.choices[i] != '' && data.answer != ''){
        acc.push({
          'answer_text': data.choices[i],
          'choices': answers[i],
          'question_id': data.question_id
        });
      }
    }
    
  }

    return acc
  }, []))


};

const handleExamTitleChange = (event) => {
  setExamTitle(event.target.value)
  const data = {
    ExamTitle: event.target.value,
    tos_id:0
  };

 
}

const handleRadioAnswer = (index, value) => {
  const newStates = [...examStates];
 
    newStates[index]['answer'] = value;

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
      if(getTotalTaxonomy!=100){
        setDisableNext(true)
      }
    
      break
  }
 



},[step,formData,getTotalTaxonomy,TotalItems])




const handleSubmitExam = () =>{
  
  const updateStatus = {
    Status: 1
  };
  setLoading(true);
  api
    .patch(`/api/tos-info/${id}/update/`, updateStatus)
    .then((res) => {
      console.log('Status updated', res.data);
     
      setOpenModal(false); // Close the modal
      setLoading(false);
    })
    .catch((err) => {
      console.error('Error status:', err);
    });
    setSubmit(true)
}





  return (
    <div className='content'>
      <form  onSubmit={updateTOSinfo}>
   <Card className={`mb-5 ${step == 1? 'show':'hidden'}`}>
  <Breadcrumb aria-label="Default breadcrumb example">
      <Breadcrumb.Item >
       Exams
      </Breadcrumb.Item>
      <Breadcrumb.Item >Course Information</Breadcrumb.Item>

    </Breadcrumb>


    

      <Card className='max-w-3xl mx-auto ' >
    
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
           <Select id="semester" name="Semester" value={formData.Semester} onChange={handleChange} required>
         
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
         <div className="w-full">
           <div className="mb-2 block">
             <Label htmlFor="exam-type" value="Type of Examination" />
           </div>
           <Select id="exam-type" name="ExaminationType" value={formData.ExaminationType} onChange={handleChange} required>
             <option value="Multiple choices">Multiple choices</option>
             <option value="Identification">Identification</option>
             <option value="True or false">True or false</option>
           </Select>
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
       <div className='w-2/4'>
         <div className="mb-2 block">
           <Label htmlFor="executive-director" value="Campus Executive Director" />
         </div>
         <TextInput id="executive-director" type="text" name="Director" value={formData.Director} onChange={handleChange} />
       </div>
     </div>
     {/* <button className='bg-blue-950 hover:bg-blue-800 py-2 text-white rounded-lg'>Next</button> */}

  
   </Card>


   </Card>

   <div className={`mb-5 ${step == 2? 'show':'hidden'}`}>

  

  <TaxonomyAllocation totalItems={TotalItems} handleTotalItemsChange={handleTotalItemsChange} handleRememberingChange={handleRememberingChange} handleUnderstandingChange={handleUnderstandingChange} handleApplyingChange={handleApplyingChange} handleAnalyzingChange={handleAnalyzingChange} handleEvaluatingChange={handleEvaluatingChange} handleCreatingChange={handleCreatingChange} Remembering={Remembering} Understanding={Understanding} Applying={Applying} Analyzing={Analyzing} Evaluating={Evaluating} Creating={Creating} getTotalTaxonomy={getTotalTaxonomy} checkTaxonomy={checkTaxonomy} />

 
   </div>


   <div className={`mb-5 ${step == 3? 'show':'hidden'}`}>

  <Card>
  <Breadcrumb aria-label="Default breadcrumb example">
      <Breadcrumb.Item >
      Exams
      </Breadcrumb.Item>
      <Breadcrumb.Item >
      Course content
      </Breadcrumb.Item>
      <Breadcrumb.Item >
      Taxonomy Allocation
      </Breadcrumb.Item>
      <Breadcrumb.Item >
      Table of Specification
      </Breadcrumb.Item>
      </Breadcrumb>
    <Tableofspecs lessonData={lessonData} columns={columns} rows={rows} handleModalRow={handleModalRow}/>

    {inputModal(indexRow,lessonData)}

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

     

      <Button color="blue" onClick={() => setPdfModal(true)}><VisibilityIcon className="mr-2"/>Preview</Button>

 
      </div>
      </div>
      </div>

      <Modal show={PdfModal} size={'7xl'}  onClose={() => setPdfModal(false)} className="h-screen">
        <Modal.Header>Table of Specification</Modal.Header>
        <Modal.Body  className="p-0">
          <div className="min-h-96 "  style={{height:'575px'}}>
          <PDFViewer className="h-full w-full">
    <PdfUpdate lessonsData={lessonData} Remembering={Remembering}  Analyzing={Analyzing} Understanding={Understanding} Applying={Applying} Evaluating={Evaluating} Creating={Creating}  formData={formData}/>
  </PDFViewer>
      
          </div>
        </Modal.Body>
      </Modal>
      </Card>
 
   </div>

   <div className={`mb-5 ${step == 4? 'show':'hidden'}`}>
   <ExamUpdate items={TotalItems} lessonsData={lessonData} examStates={examStates} setExamStates={setExamStates} handleStateChange={handleStateChange} ExamTitle={ExamTitle} handleExamTitleChange={handleExamTitleChange} handleRadioAnswer={handleRadioAnswer} TestPart={TestPart} setTestPart={setTestPart} handleTestPartChange={handleTestPartChange} exam_id={exam_id} updateTOSinfo={updateTOSinfo} handleSubmitExam={handleSubmitExam} setSubmit={setSubmit}/>

    </div>

    <div className="w-full justify-center mx-auto flex gap-14">
  <div>
  
<Button size={'sm'} color={'primary'} onClick={handleBack} disabled={disableBack} className="px-3"><NavigateBeforeIcon/> <p style={{marginTop:'0.5px'}}>Previous</p></Button>
</div>
<div>
      <Button size={'sm'}  color={'primary'} onClick={handleNext} disabled={disableNext} className="px-4" > <p style={{marginTop:'0.5px'}}>Next</p> <NavigateNextIcon  /></Button>
      </div>
      </div>

 

      {loading  && <LoadingSubmit/>}
      {Toast  && <ToastMessage  message = "Exam successfully updated!" setToast={setToast}/>}
      {submitToast  && <ToastMessage  message = "Exam successfully submitted!" setToast={setSubmitToast}/>}
    

      {/* <Button href='/exam_bank'> Back to list</Button> */}
      </form>
    </div>
  );
  ReactDOM.render(<TOSview />, document.getElementById('root'));
}



export default TOSview;
