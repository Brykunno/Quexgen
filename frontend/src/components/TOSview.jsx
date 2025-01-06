import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {Button} from "@mui/material";
import { Card,Progress,Label, Textarea, TextInput,RangeSlider,Modal,Select,Breadcrumb } from "flowbite-react";
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
import { Autocomplete, TextField, Chip } from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import RecommendIcon from '@mui/icons-material/Recommend';  
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import RateReviewIcon from '@mui/icons-material/RateReview';



import ReactDOM from 'react-dom';
import { PDFViewer } from '@react-pdf/renderer';
import PdfUpdate from "./PdfUpdate";
import Examtest from "./Examtest";
import LoadingSubmit from "./LoadingSubmit";
import ToastMessage from "./Toast";
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
    study_guide,
   
  };
}


function TOSview() {

  const [modalComment,setModalComment]=useState(false)

  const [stats,setStats] = useState(0)
  const [TOSContent, setTOSContent] = useState([]);
  const [TaxonomyLevel, setTaxonomyLevel] = useState([]);
  const [TOSInfo, setTOSInfo] = useState([]);
  const [Comment,setComment]=useState([]);

  const [answerChoices, setAnswerChoices] = useState([]);
  const [submitToast,setSubmitToast] = useState(false);
  const [Submit,setSubmit] = useState(false);
  const[loadingGenerate,setLoadingGenerate] = useState(false)
  const [learningOutcomes, setLearningOutcomes] = useState([]); 

  
  const [loading, setLoading] = useState(false);
  const [Toast, setToast] = useState(false);
  const [TotalItems, setTotalItems] = useState(0);

   
  const getLearningOutcomes = () =>{
    api.get(`/api/learning_outcomes/`)
    .then((res) => {
      setLearningOutcomes(res.data);
    })
    .catch((err) => {
      alert(err);
      
    });
  }


  const [formData, setFormData] = useState({
    Title: '',
    Semester: '1st Semester',
    Term: 'Midterm',
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

  const [lessonData,setLessonData] = useState([{  
    topic: '',
learning_outcomes: [],
teachingHours: [],
allocation: [],
items: [],
remembering: [],
understanding: [],
applying: [],
analyzing: [],
evaluating: [],
creating: [],
total: [],
placement: [],
totalItems:0,
max:0,
study_guide:null,
tos_teacher: 0,
file_status:'',
taxonomy_levels: {
  Remembering:0,
  Understanding:0,
  Applying:0,
  Analyzing:0,
  Evaluating:0,
  Creating:0
}
  }])
  const [getTestPart, setGetTestPart] = useState([]);
  const [TestPart, setTestPart] = useState([]);
  const [exam,setExam] = useState([])

  const [getQuestion, setGetQuestion] = useState([]);
  const [getAnswer, setGetAnswer] = useState([]);
  const [examStates, setExamStates] = useState([]);
  const options = ['Multiple Choice ','Identification ','True or False','Subjective'];

const [files,setFiles] = useState([])

  const { id } = useParams();
  
  const[exam_id,setExam_ID] = useState([]);
  useEffect(() => {
    if (id) {
      getTOSContent();
      getTOSInfo();
      getExam();
      getComment();
      getLearningOutcomes();
    
    }
  }, [id]);

  useEffect(() => {
    if (TOSInfo.length) {
      setFormData({
 
        Title: TOSInfo[0].Title,
        Semester: TOSInfo[0].Semester,
        Term: TOSInfo[0].Term,
        AcademicYear: TOSInfo[0].AcademicYear,
        Campus: TOSInfo[0].Campus,
        CourseCode: TOSInfo[0].CourseCode,
        Department: TOSInfo[0].Department,
        ExaminationType: TOSInfo[0].ExaminationType.split('/'), // Convert string to array
        CourseType: TOSInfo[0].CourseType,
        ExaminationDate: TOSInfo[0].ExaminationDate ,
        Faculty: TOSInfo[0].Faculty,
        Chairperson: TOSInfo[0].Chairperson,
        Dean: TOSInfo[0].Dean,
        Director: TOSInfo[0].Director,
        Status: TOSInfo[0].Status,
        Status_display: TOSInfo[0].Status_display
      });
    }
  
    if (TOSContent.length) {
      // Map over TOSContent to update lessonData
      const updatedLessonData = TOSContent.map((content) => {

        const outcomes =  learningOutcomes.filter(data => data.tos_content == content.id);
        const l_outcome = outcomes.map((data)=>{
          let out = []
          out.push(data.learning_outcomes)
          return out
        })

        const lid = learningOutcomes
  .filter(data => data.tos_content === content.id)
  .map(data => data.id);

        const thours = learningOutcomes
  .filter(data => data.tos_content === content.id)
  .map(data => data.teachingHours);

  const allocation = learningOutcomes
  .filter(data => data.tos_content === content.id)
  .map(data => data.allocation);

  const items = learningOutcomes
  .filter(data => data.tos_content === content.id)
  .map(data => data.items);

  const remembering = learningOutcomes
  .filter(data => data.tos_content === content.id)
  .map(data => data.remembering);

  const understanding = learningOutcomes
  .filter(data => data.tos_content === content.id)
  .map(data => data.understanding);

  const applying = learningOutcomes
  .filter(data => data.tos_content === content.id)
  .map(data => data.applying);

  const analyzing = learningOutcomes
  .filter(data => data.tos_content === content.id)
  .map(data => data.analyzing);

  const evaluating = learningOutcomes
  .filter(data => data.tos_content === content.id)
  .map(data => data.evaluating);

  const creating = learningOutcomes
  .filter(data => data.tos_content === content.id)
  .map(data => data.creating);

  const placement = learningOutcomes
  .filter(data => data.tos_content === content.id)
  .map(data => data.placement);

  const total = learningOutcomes
  .filter(data => data.tos_content === content.id)
  .map(data => data.total);



  const taxonomy = TaxonomyLevel.filter(data => data.Tos_content_id === content.id)



        
        
        return{
        id:content.id,
        topic: content.topic,
        learning_outcomes_id: lid || [],
        learning_outcomes: l_outcome || [],
        teachingHours: thours || [],
        allocation: allocation || [],
        items: items || [],
        remembering: remembering || [],
        understanding: understanding || [],
        applying: applying || [],
        analyzing: analyzing || [],
        evaluating: evaluating || [],
        creating: creating || [],
        total: total || [],
        placement: placement || [],
        taxonomy_levels:taxonomy || [],
        TotalItems: total.reduce((total,content)=> total +content,0) || 0,
        teacher_tos: content.teacher_tos || 0,
       
      }});

      setAllocations(updatedLessonData.map((data)=>{return data.taxonomy_levels}))
      const updateTotalItems = updatedLessonData.reduce((total, content) => total + content.TotalItems, 0);

      const calculatePercentage = (totalValue, TotalItems) => Math.round((totalValue / TotalItems) * 100);


// Sum for each category
const totalRemembering = updatedLessonData.reduce((total, content) => total + content.remembering.reduce((total2, content2) => total2 + content2, 0), 0);

const totalUnderstanding = updatedLessonData.reduce((total, content) => total + content.understanding.reduce((total2, content2) => total2 + content2, 0), 0);
const totalApplying = updatedLessonData.reduce((total, content) => total + content.applying.reduce((total2, content2) => total2 + content2, 0), 0);
const totalAnalyzing = updatedLessonData.reduce((total, content) => total + content.analyzing.reduce((total2, content2) => total2 + content2, 0), 0);
const totalEvaluating = updatedLessonData.reduce((total, content) => total + content.evaluating.reduce((total2, content2) => total2 + content2, 0), 0);
const totalCreating = updatedLessonData.reduce((total, content) => total + content.creating.reduce((total2, content2) => total2 + content2, 0), 0);


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
      test_part_id: content.test_part_id,
      context: content.context
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
  
  const getTOSContent = async () => {
    try {
      // Fetch TOS content
      const tosResponse = await api.get(`/api/tos-content/${id}/detail/`);
      const tosData = tosResponse.data;
      setTOSContent(tosData);
      console.log('tosContent:', tosData);
  
      // Fetch taxonomy levels for all topics in parallel
      const taxonomyRequests = tosData.map((item) =>
        api.get(`/api/taxonomy_levels/by-topic/${item.id}/`)
      );
  
      const taxonomyResponses = await Promise.all(taxonomyRequests);
  
      // Flatten and process taxonomy levels
      const taxonomyLevels = taxonomyResponses.flatMap((res) =>
        res.data.map((item) => ({
          id: item.id,
          Remembering: item.remembering,
          Understanding: item.understanding,
          Applying: item.applying,
          Analyzing: item.analyzing,
          Evaluating: item.evaluating,
          Creating: item.creating,
          Tos_content_id: item.tos_content_id,
        }))
      );
  
      setTaxonomyLevel(taxonomyLevels);
      console.log('taxonomyLevels:', taxonomyLevels);
    } catch (error) {
      console.error('Error fetching TOS content or taxonomy levels:', error);
      alert('Failed to fetch data. Please try again later.');
    }
  };
  
  const handleinnertaxlevelChange = (index, field,level,subIndex, value) => {

    setSpecific(true)
    // Clone the lessonsData array to avoid direct mutation
    const newData = [...lessonData];
    const newDataAllocation = [...allocations]
  
    // Update the specific field in the corresponding lesson object
    newData[index][field][subIndex][level] = value;
    newDataAllocation[index][subIndex][level] = Number(value)

      // Update the state with the new data
      setLessonData(newData);
      


      setAllocations(newDataAllocation)
  
  }

  function comment(Comment){
    let comment_text;
  
    Comment.map(admin_comment => {comment_text = admin_comment.comment });

    return comment_text

  }
  
  let comment_text = comment(Comment)

  const getComment =()=>{
    api
    .get(`api/comments/${id}/detail/admin/`)
    .then((res) => res.data)
    .then((data) => {setComment(data)
      console.log('toscontent: ', data);
    })
    .catch((err) => alert(err));
  }

 

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

    
     
      console.log('examtypes: ',formData.ExaminationType)
      formData.Status = Submit===true?1:formData.Status

      

      const formData1 = formData

      if (Array.isArray(formData1.ExaminationType)) {
        // It's an array, proceed to join
        formData1.ExaminationType = formData1.ExaminationType.join('/');
      } else if (typeof formData1.ExaminationType === 'string') {
        // It's a string, split into an array and then join
        formData1.ExaminationType = formData1.ExaminationType.split('/').join('/');
      } else {
        // Handle unexpected cases (e.g., null, undefined, etc.)
        console.error('ExaminationType is not an array or a string:', formData1.ExaminationType);
      }
      
      await api.put(`/api/tos-info/${id}/update/`, formData1);
      

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

         const updateOrCreateTaxonomyLevel = async (data) => {
          try {
            // Update existing learning outcomes
            const updatePromises = data.learning_outcomes.map((item, index) => {
              const learningContent = {
                learning_outcomes: item[0],
                teachingHours: data.teachingHours[index],
                allocation: data.allocation[index],
                items: data.items[index],
                remembering: data.remembering[index],
                understanding: data.understanding[index],
                applying: data.applying[index],
                analyzing: data.analyzing[index],
                evaluating: data.evaluating[index],
                creating: data.creating[index],
                total: data.total[index],
                placement: data.placement[index],
                tos_content: data.id,
              };
        
              // Perform the PUT request

              console.log('learningcontentupdate:',learningContent)
              return api.put(`/api/learning_outcomes/${data.learning_outcomes_id[index]}/`, learningContent);
            });
        
            // Wait for all PUT requests to complete
            await Promise.all(updatePromises);
            return "Update successful";
          } catch (error) {
            // Handle specific 404 errors
            if (error.response && error.response.status === 404) {
              try {
                // Create new learning outcomes if not found
                const createPromises = data.learning_outcomes.map((item, index) => {
                  const learningContent = {
                    learning_outcomes: item,
                    teachingHours: data.teachingHours[index],
                    allocation: data.allocation[index],
                    items: data.items[index],
                    remembering: data.remembering[index],
                    understanding: data.understanding[index],
                    applying: data.applying[index],
                    analyzing: data.analyzing[index],
                    evaluating: data.evaluating[index],
                    creating: data.creating[index],
                    total: data.total[index],
                    placement: data.placement[index],
                  };
        
                  // Perform the POST request
                  return api.post("/api/learning_outcomes/", learningContent);
                });
        
                // Wait for all POST requests to complete
                await Promise.all(createPromises);
                return "Creation successful";
              } catch (postError) {
                throw new Error("Failed to create taxonomy levels during POST.");
              }
            } else {
              throw new Error("An error occurred during the update or create process.");
            }
          }
        };
        
        // Execute the update or create function for all lesson data
        try {
          const updatePromisesTaxonomyLevel = lessonData.map(updateOrCreateTaxonomyLevel);
          const results = await Promise.all(updatePromisesTaxonomyLevel);
          console.log("Responses:", results); // Log all responses
        } catch (error) {
          console.error("Error in updating or creating taxonomy levels:", error);
        }
        
        const updateOrCreateTaxlevels = async (data) => {
          try {
            // Update existing learning outcomes
            const updatePromises = data.taxonomy_levels.map((item, index) => {
              const learningContent = {
                remembering:item.Remembering,
                understanding:item.Understanding,
                applying:item.Applying,
                analyzing:item.Analyzing,
                evaluating:item.Evaluating,
                creating:item.Creating,
                tos_content_id:item.Tos_content_id

              };
        
              // Perform the PUT request
              return api.put(`/api/taxonomy_levels/${item.id}/`, learningContent);
            });
        
            // Wait for all PUT requests to complete
            await Promise.all(updatePromises);
            return "Update successful";
          } catch (error) {
            // Handle specific 404 errors
            if (error.response && error.response.status === 404) {
              try {
                // Create new learning outcomes if not found
                const createPromises = data.taxonomy_levels.map((item, index) => {
                  const learningContent = {
                    remembering:item.Remembering,
                    understanding:item.Understanding,
                    applying:item.Applying,
                    analyzing:item.Analyzing,
                    evaluating:item.Evaluating,
                    creating:item.Creating,
                    tos_content_id:item.Tos_content_id
                  };
        
                  // Perform the POST request
                  return api.post("/api/taxonomy_levels/", learningContent);
                });
        
                // Wait for all POST requests to complete
                await Promise.all(createPromises);
                return "Creation successful";
              } catch (postError) {
                throw new Error("Failed to create taxonomy levels during POST.");
              }
            } else {
              throw new Error("An error occurred during the update or create process.");
            }
          }
        };
        
        // Execute the update or create function for all lesson data
        try {
          const updatePromisesTaxlevels = lessonData.map(updateOrCreateTaxlevels);
          const results = await Promise.all(updatePromisesTaxlevels);
          console.log("Responses:", results); // Log all responses
        } catch (error) {
          console.error("Error in updating or creating taxonomy levels:", error);
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
                        'context':data.context,
                        'test_part_id': createdTestPart.id // Use the newly created test part ID

                      });
                    }
                    return acc;
                  }, []);
        
                  if (itemsQues.length > 0) {
                    // Now handle related questions and answers creation
                    const itemQuestionJson = JSON.stringify(itemsQues);


                    console.log('debugcontext: ',itemQuestionJson)
        
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
                  'context':data.context,
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
            notification_text: " updated ",
            tos: id,
          })
          await api.post(`api/notification/admin/`, {AdminNotifDataJson});


        } catch (error) {
          console.error('Error in updating or creating answers:', error);
        }
        




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
const [specific,setSpecific] = useState(false)

const [disableBack, setDisableBack] = useState(false);

const handleNext = () => {
  setStep(step + 1);
};

const handleBack = () => {

  if (step === 1) {
    window.location.href = "/exam_bank";
    return; // Exit the function early to avoid decrementing `step`
  }
  setStep(step - 1);
  
};

function roundNumItems(num) {

  return parseFloat(num.toFixed(2)); 
 
}



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
    <div className="max-w-36  max-h-10  overflow-hidden" style={{maxHeight:'100'}} key={index}><b> {index+1}</b></div>,
    <div className="max-w-36  overflow-hidden" style={{maxHeight:'100'}} key={index}> {data.learning_outcomes}</div>,
    <div className={`${data.teachingHours==0?'bg-red-500 rounded-lg text-white':''} text-center`} key={index} >  <TextInput
    min={0}
      id={`teaching_hours-${index}`}
      type="number"
      style={{maxWidth:'200px'}}
      value={lessonData[index]['teachingHours']}
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
     <Button color={'error'} >{data.placement}</Button>

     </div>,


    
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
    <Button color={'error'} size={'xs'} onClick={(e) => handleFloor(indexRow, 'items', lessonData[indexRow]['items'])}><ArrowDownwardIcon /> <span className="mt-1">floor</span></Button>
    <Button color={'primary'} size={'xs'} onClick={(e) => handleCeil(indexRow, 'items', lessonData[indexRow]['items'])}><ArrowUpwardIcon/> <span className="mt-1">ceil</span></Button>

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
      <Button  color={'error'} size={'xs'} onClick={(e) => handleFloor(indexRow, 'remembering', lessonData[indexRow]['remembering'])}><ArrowDownwardIcon /> <span className="mt-1">floor</span></Button>
      <Button color={'primary'} size={'xs'} onClick={(e) => handleCeil(indexRow, 'remembering', lessonData[indexRow]['remembering'])}><ArrowUpwardIcon/> <span className="mt-1">ceil</span></Button>

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
      <Button color={'error'} size={'xs'} onClick={(e) => handleFloor(indexRow, 'understanding', lessonData[indexRow]['understanding'])}><ArrowDownwardIcon /> <span className="mt-1">floor</span></Button>
      <Button color={'primary'} size={'xs'} onClick={(e) => handleCeil(indexRow, 'understanding', lessonData[indexRow]['understanding'])}><ArrowUpwardIcon/> <span className="mt-1">ceil</span></Button>

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
      <Button color={'error'} size={'xs'} onClick={(e) => handleFloor(indexRow, 'applying', lessonData[indexRow]['applying'])}><ArrowDownwardIcon /> <span className="mt-1">floor</span></Button>
      <Button color={'primary'} size={'xs'} onClick={(e) => handleCeil(indexRow, 'applying', lessonData[indexRow]['applying'])}><ArrowUpwardIcon/> <span className="mt-1">ceil</span></Button>

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
      <Button color={'error'} size={'xs'} onClick={(e) => handleFloor(indexRow, 'analyzing', lessonData[indexRow]['analyzing'])}><ArrowDownwardIcon /> <span className="mt-1">floor</span></Button>
      <Button color={'primary'} size={'xs'} onClick={(e) => handleCeil(indexRow, 'analyzing', lessonData[indexRow]['analyzing'])}><ArrowUpwardIcon/> <span className="mt-1">ceil</span></Button>

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
      <Button color={'error'} size={'xs'} onClick={(e) => handleFloor(indexRow, 'evaluating', lessonData[indexRow]['evaluating'])}><ArrowDownwardIcon /> <span className="mt-1">floor</span></Button>
      <Button color={'primary'} size={'xs'} onClick={(e) => handleCeil(indexRow, 'evaluating', lessonData[indexRow]['evaluating'])}><ArrowUpwardIcon/> <span className="mt-1">ceil</span></Button>

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
      <Button color={'error'} size={'xs'} onClick={(e) => handleFloor(indexRow, 'creating', lessonData[indexRow]['creating'])}><ArrowDownwardIcon /> <span className="mt-1">floor</span></Button>
      <Button color={'primary'} size={'xs'} onClick={(e) => handleCeil(indexRow, 'creating', lessonData[indexRow]['creating'])}><ArrowUpwardIcon/> <span className="mt-1">ceil</span></Button>

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
<Button color={'error'} size={'xs'} onClick={(e) => handleReset(indexRow, 'reset')}><ArrowUpwardIcon/> <span className="mt-1">Reset</span></Button>
</Card>
  </div>


  
  </div>
  
  </div>
         
         </div>
       </Modal.Body>
       <Modal.Footer>
        <div className=" w-full ">
          <div className="mx-auto flex gap-5 justify-center">
          <Button color="error" onClick={() => removeLesson(lessonData,indexRow)}><RemoveCircleOutlineIcon className="mr-2"/>Remove Lesson</Button>
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

  if(total===1){

    return `${placements.splice(0,total)}`;
  }
  else if(total===0){
    return "0";
  }
  else{

  start = placements.splice(0,total-1)[0];
  end = placements.splice(0,1);
  if(start === undefined || end === undefined){
    return "0 - 0"
  }
  else{
    return `${start} - ${end}`;
  }
}
    
  

}
 
function getNumItems(TotalItems,allocation){
  const allocationDecimal = allocation / 100;
  return TotalItems * allocationDecimal
 

}

function getTotal(remembering,understanding,applying,analyzing,evaluating,creating){

  return remembering+understanding+applying+analyzing+evaluating+creating
}

function getInnerNumItems(totalItems,allocation){
 
  const allocationDecimal = Number(allocation) / 100;

  return roundNumItems(totalItems * allocationDecimal)
 
}

function getInnerLevelAllocation(allocations,level,index,subIndex){


  const Remembering = allocations[index][subIndex]['Remembering']

  console.log('heremember:',Remembering,' index:',index)
  const Understanding = allocations[index][subIndex]['Understanding']
  const Applying = allocations[index][subIndex]['Applying']
  const Analyzing = allocations[index][subIndex]['Analyzing']
  const Evaluating = allocations[index][subIndex]['Evaluating']
  const Creating = allocations[index][subIndex]['Creating']

  const total = Remembering+Understanding+Applying+Analyzing+Evaluating+Creating

  
  const percent = Math.round((allocations[index][subIndex][level]/total)*100)

  console.log('totalAll: ',percent, '|level:',level,'|index:',index)

  return percent

}
function getInnerTotalHours() {
  const hours = lessonData.reduce((acc, data) => {
    // If teachingHours is valid, sum up its numbers
    const totalTeachingHours = data.teachingHours?.reduce((sum, val) => sum + Number(val), 0) || 0;

    return acc + totalTeachingHours;
  }, 0);

  return hours;
}
function getInnerAllocation(hours,totalHours,max){
  let result = (hours / totalHours) * max;

  if (result % 1 >= 0.3 && result % 1 <= 0.7) {
    return parseFloat(result.toFixed(2)); 
  }
  return Math.round(parseFloat(result.toFixed(2))); 
}
const handleInnerLessonDataChange = (index,subIndex, field, value) => {
  // Clone the lessonsData array to avoid direct mutation
  const newData = [...lessonData];
  
  
  // Update the specific field in the corresponding lesson object
  newData[index][field][subIndex] = value;



  if (field === 'teachingHours') {
    for (let i = 0; i < newData.length; i++) {

      const sumHours =  newData[i][field].reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      
      const lessonAlloc = getAllocation(Number(sumHours),getInnerTotalHours())

      for(let k=0;k<newData[i]['allocation'].length;k++){
        newData[i]['allocation'][k] = getInnerAllocation(Number(newData[i][field][k]),sumHours,lessonAlloc)
      }
    
      const sumAlloc =  newData[i]['allocation'].reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      const lessonItem = getNumItems(TotalItems,sumAlloc)
      console.log('showitems:l',lessonItem)
      for(let k=0;k<newData[i]['items'].length;k++){
        newData[i]['items'][k] = getInnerNumItems(TotalItems,newData[i]['allocation'][k])
        console.log('showitems:',newData[i]['items'][k])
        console.log('showitems:a',newData[i]['allocation'][k])
     
        console.log('showitems:s',sumAlloc)
      }
    
      
    
      

      let remembering = Array(newData[i]['allocation']?.length || 0).fill(0);
      let understanding = Array(newData[i]['allocation']?.length || 0).fill(0);
      let applying = Array(newData[i]['allocation']?.length || 0).fill(0);
      let analyzing = Array(newData[i]['allocation']?.length || 0).fill(0);
      let evaluating = Array(newData[i]['allocation']?.length || 0).fill(0);
      let creating = Array(newData[i]['allocation']?.length || 0).fill(0);
      

      
        for(let k=0;k<newData[i]['allocation'].length;k++){
          remembering[k] = getInnerLevelAllocation(allocations,'Remembering',i,k)
          understanding[k] = getInnerLevelAllocation(allocations,'Understanding',i,k)
   
          applying[k] = getInnerLevelAllocation(allocations,'Applying',i,k)
   
          analyzing[k] = getInnerLevelAllocation(allocations,'Analyzing',i,k)
   
          evaluating[k] = getInnerLevelAllocation(allocations,'Evaluating',i,k)
   
          creating[k] = getInnerLevelAllocation(allocations,'Creating',i,k)
        }

        console.log('uprob: ',understanding)
     
    

      
      for (let z = 0; z < newData.length; z++) {
      
        if (!newData[z]['remembering']) {
          newData[z]['remembering'] = Array(newData[z]['allocation']?.length || 0).fill(0);
        
        }
        if (!newData[z]['understanding']) {
          newData[z]['understanding'] = Array(newData[z]['allocation']?.length || 0).fill(0);
        }
        if (!newData[z]['applying']) {
          newData[z]['applying'] = Array(newData[z]['allocation']?.length || 0).fill(0);
        }
        if (!newData[z]['analyzing']) {
          newData[z]['analyzing'] = Array(newData[z]['allocation']?.length || 0).fill(0);
        }
        if (!newData[z]['evaluating']) {
          newData[z]['evaluating'] = Array(newData[z]['allocation']?.length || 0).fill(0);
        }
        if (!newData[z]['creating']) {
          newData[z]['creating'] = Array(newData[z]['allocation']?.length || 0).fill(0);
        }
      }
      

      console.log('nowrem:',remembering)
       console.log('definedData?: ',newData[i])
        console.log('defined?: ',newData[i]['remembering'])
      for (let k = 0; k < newData[i]['allocation'].length; k++) {

       
        newData[i]['remembering'][k] = getRemembering(remembering[k], newData[i]['items'][k]);
        
        newData[i]['understanding'][k] = getUnderstanding(understanding[k], newData[i]['items'][k]);
        newData[i]['applying'][k] = getApplying(applying[k], newData[i]['items'][k]);
        newData[i]['analyzing'][k] = getAnalyzing(analyzing[k], newData[i]['items'][k]);
        newData[i]['evaluating'][k] = getEvaluating(evaluating[k], newData[i]['items'][k]);
        newData[i]['creating'][k] = getCreating(creating[k], newData[i]['items'][k]);
        newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
      }
      
     

    
    }

    for (let i = 0; i < newData.length; i++) {

   
      for(let k=0;k<newData[i]['allocation'].length;k++){
   
      let overall = 0
    
      let percent = 0
      for (let j = 0; j < newData.length; j++) {
        for(let h=0;h<newData[j]['items'].length;h++){
          overall += newData[j]['items'][h]
        }
      }

   


      for (let j = 0; j < newData.length; j++) {
        for(let h=0;h<newData[j]['allocation'].length;h++){

          percent += newData[j]['allocation'][h]
        }
    }

    console.log('percenthere:',percent)

    if(percent<100){

        newData[i]['allocation'][k] = Math.ceil(newData[i]['allocation'][k]);
      
    }
    else if(percent>100){
    
      newData[i]['allocation'][k] = Math.floor(newData[i]['allocation'][k]);
      
    }
    else if(percent==100){
    
      newData[i]['allocation'][k] = Math.round(newData[i]['allocation'][k]);
      
    }
    



    
      console.log('overall: ',overall)
      console.log('total items: ',TotalItems)

            
    console.log('overall: ',overall,' total items: ',TotalItems)
   
   
      if(overall<TotalItems){

        
        newData[i]['items'][k] = Math.ceil(newData[i]['items'][k]);
        console.log('remembertrailll',k,': ',newData[i]['remembering'][k])
        console.log('true?: ',newData[i]['items'][k] ,':', newData[i]['total'][k])
        if(newData[i]['items'][k] == newData[i]['total'][k] && !Number.isInteger(newData[i]['remembering'][k])){

          
          console.log('remembertraillls',k,': ',newData[i]['remembering'][k])
          newData[i]['remembering'][k] = Math.round(newData[i]['remembering'][k]);
         


         
         
            newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
        else if(newData[i]['items'][k] < newData[i]['total'][k]){
          newData[i]['remembering'][k] = Math.floor(newData[i]['remembering'][k]);
          console.log('remembertrailllss',k,': ',newData[i]['remembering'][k])
            newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
    
        else if(newData[i]['items'][k] > newData[i]['total'][k]){
          console.log('larger?: ',newData[i]['items'][k] ,':', newData[i]['total'][k])
          newData[i]['remembering'][k] = Math.ceil(newData[i]['remembering'][k]);
          console.log('remembertrailllsss',k,': ',newData[i]['remembering'][k])
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
    
        if(newData[i]['items'][k] == newData[i]['total'][k] && !Number.isInteger(newData[i]['understanding'][k])){
          newData[i]['understanding'][k] = Math.round(newData[i]['understanding'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
        else if(newData[i]['items'][k] < newData[i]['total'][k]){
          newData[i]['understanding'][k] = Math.floor(newData[i]['understanding'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
    
        else if(newData[i]['items'][k] > newData[i]['total'][k]){
          newData[i]['understanding'][k] = Math.ceil(newData[i]['understanding'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
    
        if(newData[i]['items'][k] == newData[i]['total'][k] && !Number.isInteger(newData[i]['applying'][k])){
          newData[i]['applying'][k] = Math.round(newData[i]['applying'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
        else if(newData[i]['items'][k] < newData[i]['total'][k]){
          newData[i]['applying'][k] = Math.floor(newData[i]['applying'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
    
        else if(newData[i]['items'][k] > newData[i]['total'][k]){
          newData[i]['applying'][k] = Math.ceil(newData[i]['applying'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
    
        if(newData[i]['items'][k] == newData[i]['total'][k] && !Number.isInteger(newData[i]['analyzing'][k])){
          newData[i]['analyzing'][k] = Math.round(newData[i]['analyzing'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
        else if(newData[i]['items'][k] < newData[i]['total'][k]){
          newData[i]['analyzing'][k] = Math.floor(newData[i]['analyzing'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
    
        else if(newData[i]['items'][k] > newData[i]['total'][k]){
          newData[i]['analyzing'][k] = Math.ceil(newData[i]['analyzing'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
    
        if(newData[i]['items'][k] == newData[i]['total'][k] && !Number.isInteger(newData[i]['evaluating'][k])){
          newData[i]['evaluating'][k] = Math.round(newData[i]['evaluating'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
        else if(newData[i]['items'][k] < newData[i]['total'][k]){
          newData[i]['evaluating'][k] = Math.floor(newData[i]['evaluating'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
    
        else if(newData[i]['items'][k] > newData[i]['total'][k]){
          newData[i]['evaluating'][k] = Math.ceil(newData[i]['evaluating'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
    
        if(newData[i]['items'][k] == newData[i]['total'][k] && !Number.isInteger(newData[i]['creating'][k])){
          newData[i]['creating'][k] = Math.round(newData[i]['creating'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
        else if(newData[i]['items'][k] < newData[i]['total'][k]){
          newData[i]['creating'][k] = Math.floor(newData[i]['creating'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
    
        else if(newData[i]['items'][k] > newData[i]['total'][k]){
          newData[i]['creating'][k] = Math.ceil(newData[i]['creating'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
      
      }
      else if(overall>TotalItems){

        
        newData[i]['items'][k] = Math.floor(newData[i]['items'][k]);
    
    
        if(newData[i]['items'][k] == newData[i]['total'][k] && !Number.isInteger(newData[i]['remembering'][k])){
          newData[i]['remembering'][k] = Math.round(newData[i]['remembering'][k]);
          console.log('rememberround2',k,': ',newData[i]['remembering'][k])
            newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
        else if(newData[i]['items'][k] < newData[i]['total'][k]){
        
          
          newData[i]['remembering'][k] = Math.floor(newData[i]['remembering'][k]);
          console.log('rememberfloor2',k,': ',newData[i]['remembering'][k])
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
    
        else if(newData[i]['items'][k] > newData[i]['total'][k]){
          newData[i]['remembering'][k] = Math.ceil(newData[i]['remembering'][k]);
          console.log('rememberceil2',k,': ',newData[i]['remembering'][k])
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
    
        if(newData[i]['items'][k] == newData[i]['total'][k] && !Number.isInteger(newData[i]['understanding'][k])){
          newData[i]['understanding'][k] = Math.round(newData[i]['understanding'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
        else if(newData[i]['items'][k] < newData[i]['total'][k]){
          newData[i]['understanding'][k] = Math.floor(newData[i]['understanding'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
    
        else if(newData[i]['items'][k] > newData[i]['total'][k]){
          newData[i]['understanding'][k] = Math.ceil(newData[i]['understanding'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
    
        if(newData[i]['items'][k] == newData[i]['total'][k] && !Number.isInteger(newData[i]['applying'][k])){
          newData[i]['applying'][k] = Math.round(newData[i]['applying'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
        else if(newData[i]['items'][k] < newData[i]['total'][k]){
          newData[i]['applying'][k] = Math.floor(newData[i]['applying'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
    
        else if(newData[i]['items'][k] > newData[i]['total'][k]){
          newData[i]['applying'][k] = Math.ceil(newData[i]['applying'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
    
        if(newData[i]['items'][k] == newData[i]['total'][k] && !Number.isInteger(newData[i]['analyzing'][k])){
          newData[i]['analyzing'][k] = Math.round(newData[i]['analyzing'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
        else if(newData[i]['items'][k] < newData[i]['total'][k]){
          newData[i]['analyzing'][k] = Math.floor(newData[i]['analyzing'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
    
        else if(newData[i]['items'][k] > newData[i]['total'][k]){
          newData[i]['analyzing'][k] = Math.ceil(newData[i]['analyzing'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
    
        if(newData[i]['items'][k] == newData[i]['total'][k] && !Number.isInteger(newData[i]['evaluating'][k])){
          newData[i]['evaluating'][k] = Math.round(newData[i]['evaluating'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
        else if(newData[i]['items'][k] < newData[i]['total'][k]){
          newData[i]['evaluating'][k] = Math.floor(newData[i]['evaluating'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
    
        else if(newData[i]['items'][k] > newData[i]['total'][k]){
          newData[i]['evaluating'][k] = Math.ceil(newData[i]['evaluating'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
    
        if(newData[i]['items'][k] == newData[i]['total'][k] && !Number.isInteger(newData[i]['creating'][k])){
          newData[i]['creating'][k] = Math.round(newData[i]['creating'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
        else if(newData[i]['items'][k] < newData[i]['total'][k]){
          newData[i]['creating'][k] = Math.floor(newData[i]['creating'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
    
        else if(newData[i]['items'][k] > newData[i]['total'][k]){
          newData[i]['creating'][k] = Math.ceil(newData[i]['creating'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
      
      
      }
      else if(overall==TotalItems){

    
        
        

        newData[i]['items'][k] = Math.round(newData[i]['items'][k]);
        
        if(newData[i]['items'][k] == newData[i]['total'][k] && !Number.isInteger(newData[i]['remembering'][k])){
          newData[i]['remembering'][k] = Math.round(newData[i]['remembering'][k]);
          console.log('rememberround3',k,': ',newData[i]['remembering'][k])
            newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
        else if(newData[i]['items'][k] < newData[i]['total'][k]){
          newData[i]['remembering'][k] = Math.floor(newData[i]['remembering'][k]);
          console.log('rememberfloor3',k,': ',newData[i]['remembering'][k])
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
    
        else if(newData[i]['items'][k] > newData[i]['total'][k]){
          newData[i]['remembering'][k] = Math.ceil(newData[i]['remembering'][k]);
          console.log('rememberceil3',k,': ',newData[i]['remembering'][k])
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
    
        if(newData[i]['items'][k] == newData[i]['total'][k] && !Number.isInteger(newData[i]['understanding'][k])){
          newData[i]['understanding'][k] = Math.round(newData[i]['understanding'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
        else if(newData[i]['items'][k] < newData[i]['total'][k]){
          newData[i]['understanding'][k] = Math.floor(newData[i]['understanding'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
    
        else if(newData[i]['items'][k] > newData[i]['total'][k]){
          newData[i]['understanding'][k] = Math.ceil(newData[i]['understanding'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
    
        if(newData[i]['items'][k] == newData[i]['total'][k] && !Number.isInteger(newData[i]['applying'][k])){
          newData[i]['applying'][k] = Math.round(newData[i]['applying'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
        else if(newData[i]['items'][k] < newData[i]['total'][k]){
          newData[i]['applying'][k] = Math.floor(newData[i]['applying'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
    
        else if(newData[i]['items'][k] > newData[i]['total'][k]){
          newData[i]['applying'][k] = Math.ceil(newData[i]['applying'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
    
        if(newData[i]['items'][k] == newData[i]['total'][k] && !Number.isInteger(newData[i]['analyzing'][k])){
          newData[i]['analyzing'][k] = Math.round(newData[i]['analyzing'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
        else if(newData[i]['items'][k] < newData[i]['total'][k]){
          newData[i]['analyzing'][k] = Math.floor(newData[i]['analyzing'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
    
        else if(newData[i]['items'][k] > newData[i]['total'][k]){
          newData[i]['analyzing'][k] = Math.ceil(newData[i]['analyzing'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
        }
    
        if(newData[i]['items'][k] == newData[i]['total'][k] && !Number.isInteger(newData[i]['evaluating'][k])){
          newData[i]['evaluating'][k] = Math.round(newData[i]['evaluating'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
        else if(newData[i]['items'][k] < newData[i]['total'][k]){
          newData[i]['evaluating'][k] = Math.floor(newData[i]['evaluating'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
    
        else if(newData[i]['items'][k] > newData[i]['total'][k]){
          newData[i]['evaluating'][k] = Math.ceil(newData[i]['evaluating'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
    
        if(newData[i]['items'][k] == newData[i]['total'][k] && !Number.isInteger(newData[i]['creating'][k])){
          newData[i]['creating'][k] = Math.round(newData[i]['creating'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
        else if(newData[i]['items'][k] < newData[i]['total'][k]){
          newData[i]['creating'][k] = Math.floor(newData[i]['creating'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
    
        else if(newData[i]['items'][k] > newData[i]['total'][k]){
          newData[i]['creating'][k] = Math.ceil(newData[i]['creating'][k]);
             newData[i]['total'][k] = getTotal(
          newData[i]['remembering'][k],
          newData[i]['understanding'][k],
          newData[i]['applying'][k],
          newData[i]['analyzing'][k],
          newData[i]['evaluating'][k],
          newData[i]['creating'][k]
        );
    
        }
      
      }
      
    
     
      newData[i]['placement'][k] = getPlacement(newData[i]['total'][k], placements);
      newData[i]['totalItems'] = TotalItems;
      
    }
    }
    
  }

  // Update the state with the new data
  setLessonData(newData);

 
};

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
    
      if(overall<TotalItems){
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
      else if(overall>TotalItems){
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
      else if(overall==TotalItems){
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
  } 
  else  if (type === 'context') {
    newStates[index]['context'] = value;
  } 
  else {
    
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
  // if(step === 1){
  //   setDisableBack(true)
  // } 
  // else{
  //   setDisableBack(false)
  // }

  if(step === 3){
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



function statusIcons(status,status_name){
  if(status===0){
    return <div className='border border-blue-700 rounded-full px-2 py-1 text-blue-700 font-bold'>Ongoing <ManageHistoryIcon className='ml-2' /></div>
  }
  else if(status===1){
    return <div className='border border-green-700 rounded-full px-2 py-1 text-green-700 font-bold'>For review <RateReviewIcon className='ml-2'/></div>
  }
  else if(status===2){
    return <div className='border border-green-800 rounded-full px-2 py-1 text-green-800 font-bold'>{status_name} <RecommendIcon className='ml-2'/></div>
  }
  else if(status===3){
    return <div className='border border-orange-600 rounded-full px-2 py-1 text-orange-600 font-bold'>To revise <EditNoteIcon className='ml-2'/></div>
  }
  else {
    return null
  }

}


const configTotal = lessonData.reduce((acc, data) => {
  return acc + data.items;
}, 0); // Initial value of acc is set to 0

const configTotalAllocation = lessonData.reduce((acc, data) => {
  return parseFloat(acc) + parseFloat(data.allocation);
}, 0); // Initial value of acc is set to 0

const configTotalHours = lessonData.reduce((acc, data) => {
  return acc + Number(data.teachingHours);
}, 0); // Initial value of acc is set to 0

const configTotalRemember = lessonData.reduce((acc, data) => {
  return acc + data.remembering;
}, 0); // Initial value of acc is set to 0

const configTotalunderstand = lessonData.reduce((acc, data) => {
  return acc + data.understanding;
}, 0); // Initial value of acc is set to 0

const configTotalapply = lessonData.reduce((acc, data) => {
  return acc + data.applying;
}, 0); // Initial value of acc is set to 0

const configTotalanalyze = lessonData.reduce((acc, data) => {
  return acc + data.analyzing;
}, 0); // Initial value of acc is set to 0

const configTotalevaluate = lessonData.reduce((acc, data) => {
  return acc + data.evaluating;
}, 0); // Initial value of acc is set to 0

const configTotalcreate = lessonData.reduce((acc, data) => {
  return acc + data.creating;
}, 0); // Initial value of acc is set to 0




const configTotalTaxonomy = lessonData.reduce((acc, data) => {
  return acc + data.total;
}, 0); // Initial value of acc is set to 0

const [loadingAllocate,setLoadingAllocate] = useState(false)

const [allocations, setAllocations] = useState([]);

  // Handle the form submission
  const handleSubmitAllocation = async () => {
    try {
      // Create a promise for each lesson
      const promises = lessonData.map(async (lesson) => {
        // Create a promise for each learning outcome in the lesson
        const outcomePromises = lesson.learning_outcomes.map(async (outcome) => {
          const response = await api.post('/api/taxonomy-allocation/', {
            objectives: outcome,
          });
          console.log('heresss: ',outcome)
          return response.data.allocation; 
        });
  
        // Resolve all promises for this lesson's outcomes
        const allocations = await Promise.all(outcomePromises);
  
        // Flatten allocations into a single array
        return allocations.flat();
      });
  
      // Wait for all lessons' allocations to resolve
      const allocationsArray = await Promise.all(promises);
  
      // Flatten if allocationsArray contains nested arrays
      const flatAllocations = allocationsArray.flat();
  
      // Update lessonsData with new taxonomy_levels
      const updatedLessonsData = lessonData.map((lesson, index) => ({
        ...lesson,
        taxonomy_levels: allocationsArray[index] || [], // Ensure allocation aligns with lessons
      }));
  
      setAllocations((prev) => [...prev, ...flatAllocations]);
      setLessonData(updatedLessonsData);
  
      // Update localStorage with new lessons data
  
  
    } catch (error) {
      console.error('Error processing the file and data:', error);
    }
  
    setLoadingAllocate(false);
  };

  const submitAllocation = () =>{

    setLoadingAllocate(true)
    setAllocations([]);
    handleSubmitAllocation();

   
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


  

  const handleCourse = (event, course) => {
    const { name, value } = event.target;
  
    const updatedFormData = {
      ...formData,
      [name]: value,
      CourseCode: course.find((item) => item.course_name === value)?.course_code || '',
      CourseType: course.find((item) => item.course_name === value)?.course_type || '',
    };
  
    setFormData(updatedFormData);
    
  };


  const handletaxlevelChange = (index, field,level, value) => {

    setSpecific(true)
    // Clone the lessonsData array to avoid direct mutation
    const newData = [...lessonData];
    const newDataAllocation = [...allocations]
  
    // Update the specific field in the corresponding lesson object
    newData[index][field][level] = value;
    newDataAllocation[index][level] = Number(value)


  
      // Update the state with the new data
      setLessonData(newData);
      
      
  

      setAllocations(newDataAllocation)
  
  }
  return (
    <div className='content'>
      <form  onSubmit={updateTOSinfo}>
   <Card className={`mb-5 ${step == 1? 'show':'hidden'}`}>
  <Breadcrumb aria-label="Default breadcrumb example">
      <Breadcrumb.Item href='/exam_bank' >
       Exams
      </Breadcrumb.Item>
      <Breadcrumb.Item >TOS Information</Breadcrumb.Item>

    </Breadcrumb>


    

      <Card className='max-w-3xl mx-auto ' >
    
     <div className='w-full gap-4'>


       {/* Title and Semester */}
       <div className='w-full mb-3 flex flex-col sm:flex-row gap-4'>
       <div className="">
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

       
          
         
           </Select>
         </div>

         <div className=''>
           <div className="mb-2 block">
             <Label htmlFor="course-code" value="Course Code" />
           </div>
           <TextInput id="course-code" type="text" name="CourseCode" value={formData.CourseCode} onChange={handleChange} />
         </div>

         <div className=''>
           <div className="mb-2 block">
             <Label htmlFor="course-type" value="Course Type" />
           </div>
           <TextInput id="course-type" type="text" name="CourseType" value={formData.CourseType} onChange={handleChange} />
         </div>
         </div>
       <div className='w-full gap-4 flex flex-col sm:flex-row'>
      
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
       <div className='w-full gap-4 flex flex-col sm:flex-row'>
         {/* <div className="w-full">
           <div className="mb-2 block">
             <Label htmlFor="Academic-year" value="Academic Year" />
           </div>
           <TextInput disabled id="title" type="text" name="AcademicYear" value={formData.AcademicYear} onChange={handleChange} />
         </div> */}
     
         <div className="w-full">
           <div className="mb-2 block">
             <Label htmlFor="campus" value="Campus" />
           </div>
           <Select id="campus" name="Campus" value={formData.Campus} onChange={handleChange} required>
             <option value="San Carlos Campus">San Carlos Campus</option>
             <option value="Lingayen Campus">Lingayen Campus</option>
           </Select>
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

       {/* Course Code and Department */}
    
       {/* Type of Examination and Course Type */}
       {/* <div className='w-full gap-4 flex flex-col sm:flex-row'>
         <div className="w-full">
        

<div className="mb-2 block">
           <Label htmlFor="executive-director" value="Campus Executive Director" />
         </div>
         <TextInput id="executive-director" type="text" name="Director" value={formData.Director} onChange={handleChange} />
         </div>
      
       </div> */}

       <div className='w-full gap-4 flex flex-col sm:flex-row'>
       {/* Date of Examination */}
       <div className='w-full'>
         <div className="mb-2 block">
           <Label htmlFor="exam-date" value="Date of Examination" />
         </div>
         <TextInput  id="exam-date" type="date" name="ExaminationDate" value={formData.ExaminationDate} onChange={handleChange} />
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
       {/* <div className='w-full'>
         <div className="mb-2 block">
           <Label htmlFor="chairperson" value="Department Chairperson" />
         </div>
         <TextInput id="chairperson" type="text" name="Chairperson" value={formData.Chairperson} onChange={handleChange} />
       </div> */}

       {/* College Dean */}
       {/* <div className='w-full'>
         <div className="mb-2 block">
           <Label htmlFor="dean" value="College Dean" />
         </div>
         <TextInput id="dean" type="text" name="Dean" value={formData.Dean} onChange={handleChange} />
       </div> */}
       </div>

       {/* Campus Executive Director */}
       <div className='w-full gap-4 sm:flex-row'>
         
       <div className='w-full'>
       
       <div className="mb-2 block">
             <Label htmlFor="exam-type" value="Type of Examination" />
           </div>
           <Autocomplete
  multiple
  id="chip-selection"
  name="ExaminationType"
  options={['Multiple Choice', 'Identification', 'True or False','Subjective']}
  value={Array.isArray(formData.ExaminationType) ? formData.ExaminationType : []}
  onChange={(event, newValue) => {
    setFormData({ ...formData, ExaminationType: newValue });
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
       <div className='text-center mt-3'> <div className='w-48 mx-auto'>{statusIcons(formData.Status,formData.Status_display)}</div></div>
       <div className={comment_text!=null?'w-full ':'w-full hidden'}>
       <div className="mt-5 block ">
           <Button color={'primary'} className='mx-auto' onClick={()=>{setModalComment(true)}}><VisibilityIcon className='mr-2'/>View comment</Button>
         
         </div>

         <Modal show={modalComment} onClose={() => setModalComment(false)}>

         <Modal.Header>Comment</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">

            <p className='text-center'>{comment_text}</p>
           
          </div>
        </Modal.Body>


         </Modal>

       </div>

       

       </div>
       
     </div>
     {/* <button className='bg-blue-950 hover:bg-blue-800 py-2 text-white rounded-lg'>Next</button> */}

  
   </Card>


   </Card>

   <div className={`mb-5 ${step == 2? 'show':'hidden'}`}>

  

  <TaxonomyAllocation totalItems={TotalItems} 
  handleInnerLessonDataChange={handleInnerLessonDataChange}
  handleTotalItemsChange={handleTotalItemsChange} handleRememberingChange={handleRememberingChange} handleUnderstandingChange={handleUnderstandingChange} handleApplyingChange={handleApplyingChange} handleAnalyzingChange={handleAnalyzingChange} handleEvaluatingChange={handleEvaluatingChange} handleCreatingChange={handleCreatingChange} Remembering={Remembering} Understanding={Understanding} Applying={Applying} Analyzing={Analyzing} Evaluating={Evaluating} Creating={Creating} getTotalTaxonomy={getTotalTaxonomy} checkTaxonomy={checkTaxonomy}
  setRemembering={setRemembering} setUnderstanding={setUnderstanding} setApplying={setApplying} setAnalyzing={setAnalyzing} setEvaluating={setEvaluating} setCreating={setCreating} lessonsData={lessonData} addLesson={addLesson}
   files={files} removeLesson={removeLesson} handleLessonDataChange={handleLessonDataChange} formData={formData} setFormData={setFormData} allocations={allocations}

  submitAllocation={submitAllocation}

  loadingAllocate={loadingAllocate}
  setLoadingAllocate={setLoadingAllocate}

  setTosModal={setPdfModal}
  handleinnertaxlevelChange={handleinnertaxlevelChange}
  />

 
   </div>


   <div className={'hidden'}>

  <Card>
  <Breadcrumb aria-label="Default breadcrumb example">
      <Breadcrumb.Item href='/exam_bank' >
      Exams
      </Breadcrumb.Item>
      <Breadcrumb.Item >
      TOS Information
      </Breadcrumb.Item>
      <Breadcrumb.Item >
      Taxonomy Allocation
      </Breadcrumb.Item>
      <Breadcrumb.Item >
      Table of Specification
      </Breadcrumb.Item>
      </Breadcrumb>
    {/* <Tableofspecs lessonData={lessonData} columns={columns} rows={rows} handleModalRow={handleModalRow}
    
    configTotal={configTotal}
    configTotalAllocation={configTotalAllocation}
    configTotalHours={configTotalHours}
    configTotalRemember={configTotalRemember}
    configTotalunderstand={configTotalunderstand}
    configTotalapply={configTotalapply}
    configTotalanalyze={configTotalanalyze}
    configTotalevaluate={configTotalevaluate}
    configTotalcreate={configTotalcreate}
    configTotalTaxonomy={configTotalTaxonomy}/> */}

    {inputModal(indexRow,lessonData)}

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
      totalItems:0,})}> <AddCircleOutlineIcon className="mr-2 "/>Add Lesson</Button>

      */}

      <Button color="primary" variant='contained' onClick={() => setPdfModal(true)}><VisibilityIcon className="mr-2"/>Preview</Button>

 
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

   <div className={`mb-5 ${step == 3? 'show':'hidden'}`}>
   <ExamUpdate setPdfModalTos={setPdfModal} items={TotalItems} lessonsData={lessonData} examStates={examStates} setExamStates={setExamStates} handleStateChange={handleStateChange} ExamTitle={ExamTitle} handleExamTitleChange={handleExamTitleChange} handleRadioAnswer={handleRadioAnswer} TestPart={TestPart} setTestPart={setTestPart} handleTestPartChange={handleTestPartChange} exam_id={exam_id} updateTOSinfo={updateTOSinfo} handleSubmitExam={handleSubmitExam} setSubmit={setSubmit} setLoading={setLoadingGenerate} Status={formData.Status} formData={formData}/>

    </div>

    <div className="w-full justify-center mx-auto flex gap-14">
  <div>
 
<Button size={'sm'} color={'primary'} onClick={handleBack} disabled={disableBack} className="px-3"><NavigateBeforeIcon/> <p style={{marginTop:'0.5px'}}>Previous</p></Button>
</div>
<div>
      <Button size={'sm'}  color={'primary'} onClick={handleNext} disabled={disableNext} className="px-4" > <p style={{marginTop:'0.5px'}}>Next</p> <NavigateNextIcon  /></Button>
      </div>
      </div>

 
      {loadingGenerate  && <LoadingGenerate/>}
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
