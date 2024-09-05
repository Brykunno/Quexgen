import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts';
import { Card,Modal,Button,Label, Textarea ,Table,Pagination } from 'flowbite-react';
import PdfUpdate from '../../components/PdfUpdate';
import Swal from 'sweetalert2'
import ReactDOM from 'react-dom';
import { PDFViewer } from '@react-pdf/renderer';
import api from "../../api";
import ExampdfUpdate from '../../components/ExampdfUpdate';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CommentIcon from '@mui/icons-material/Comment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LoadingSubmit from '../../components/LoadingSubmit';

function Exam_review() {
  const { id } = useParams();
  const [TOSContent, setTOSContent] = useState([]);
  const [TOSInfo, setTOSInfo] = useState([]);
  const [loading,setLoading] = useState(false)
  const [swal,setSwal] =useState(false)

  const [Comment,setComment] = useState([{
    comment:'',
    tos: 0
  }]);

  const [CommentData,setCommentData] =useState([])

  const [answerChoices, setAnswerChoices] = useState([]);
  

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
  const [ExamTitle, setExamTitle] = useState('');

  const [commentBtn,setCommentBtn] = useState(true)



  const [approve,setApprove] = useState(false)
  const showSwal = (message) => {
    Swal.fire({
      title: message,
     
      icon: "success",
      confirmButtonText: "Proceed",
      confirmButtonColor: '#2c5282',
      preConfirm: () => {
        setSwal(false); // This will be triggered when the confirm button is clicked
        setApprove(false)
      }
    });
  }
 
  
  const[exam_id,setExam_ID] = useState([]);
  useEffect(() => {
    if (id) {
      getTOSContent();
      getTOSInfo();
      getExam();
      getComment();
    
    }
  }, [id]);

  useEffect(() => {


    if(CommentData.length){
      setComment([{
        comment: CommentData[0].comment,
        tos: CommentData[0].tos
      }])
      setCommentBtn(false)
     
    }

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
        Director: TOSInfo[0].Director,
        Status: TOSInfo[0].Status
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

  const getComment = async () => {
    try {
      const res = await api.get(`/api/comments/${id}/detail/admin/`);
      const data = res.data;
  
      if (!data) {
        setCommentData(null);
        console.log('No comment data available.');
      } else {
        setCommentData(data);
        console.log('comment: ', data);
      }
    } catch (err) {
      console.error('Error fetching comment:', err);
      alert(err);
    }
  };
  
  
 

  const getExam = () => {
    api
      .get(`/api/exam/${id}/detail/`)
      .then((res) => res.data)
      .then((data) => {
        setExam(data);
        console.log('examcontent: ', data);
       
  
        // Assuming we want to make a second API call based on tos
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

  const [Remembering, setRemembering] = React.useState(0);
  const [Understanding, setUnderstanding] = React.useState(0);
  const [Applying, setApplying] = React.useState(0);
  const [Analyzing, setAnalyzing] = React.useState(0);
  const [Evaluating, setEvaluating] = React.useState(0);
  const [Creating, setCreating] = React.useState(0);

  const [PdfModal, setPdfModal] = useState(false);
  const [ExamPdfModal, setExamPdfModal] = useState(false);

  const charData = [
    { id: 0, value: lessonData.reduce((acc, data) => acc + data.remembering, 0), label: 'Remembering' },
    { id: 1, value: lessonData.reduce((acc, data) => acc + data.understanding, 0), label: 'Understanding' },
    { id: 2, value: lessonData.reduce((acc, data) => acc + data.applying, 0), label: 'Applying' },
    { id: 3, value: lessonData.reduce((acc, data) => acc + data.analyzing, 0), label: 'Analyzing' },
    { id: 4, value: lessonData.reduce((acc, data) => acc + data.evaluating, 0), label: 'Evaluating' },
    { id: 5, value: lessonData.reduce((acc, data) => acc + data.creating, 0), label: 'Creating' },
  ];

  
    
  
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 1;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const displayedData = lessonData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleComment = async () => {
  setLoading(true)
    const updateOrCreateComment = async (data) => {
      try {
        // Attempt to update the comment using a PUT request
        const content = await api.put(`/api/comments/${data.tos}/update/`, data);
        return content; // Return the successful update response
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // If the comment does not exist (404), create a new one using POST
          const commentData = {
            comment: data.comment,
            tos: data.tos,
          };
          
          const content = await api.post("/api/create-comment/", commentData);
          return content; // Return the successful creation response
        } else {
          // Re-throw other errors to be caught in the outer try-catch
          throw new Error("Failed to update or create comment.");
        }
      }
    };
  
    try {
      // Map over Comment and execute updateOrCreateComment for each item
      const updatePromisesComment = Comment.map(updateOrCreateComment);
      
      // Await all the promises to complete
      const results = await Promise.all(updatePromisesComment);
      setLoading(false)
      setSwal(true)
      console.log("Responses:", results); // Array of responses for each operation
    } catch (error) {
      console.error("Error in updating or creating comments:", error);
    }
  
    try {
      const updateStatus = {
        Status: 3,
      };
  
      const res = await api.patch(`/api/tos-info/${id}/update/`, updateStatus);
      console.log('Status updated', res.data);
      const TeacherNotifDataJson = JSON.stringify({
        notification_text: "This exam needs revision",
        tos: id,
      })
      await api.post(`api/notification/teacher/`, {TeacherNotifDataJson});
  
     
   

    } catch (err) {
      console.error('Error status:', err);
    }
  };
  const handleApprove = () => {

    
    const updateStatus = {
      Status: 2
    };
    
    
    api
      .patch(`/api/tos-info/${id}/update/`, updateStatus)
      .then((res) => {
        console.log('Status updated', res.data);
      
        const TeacherNotifDataJson = JSON.stringify({
          notification_text: "Admin approved ",
          tos: id,
        })
     
        setApprove(true)

        return  api.post(`api/notification/teacher/`, {TeacherNotifDataJson})
      })
      .catch((err) => {
        console.error('Error status:', err);
      });


  }

  const handleCommentChange = (e) =>{
    
    setComment([{
      'comment':e.target.value,
      'tos': id
    }])

    if(e.target.value == ''){

      setCommentBtn(true)
    }
    else{
      setCommentBtn(false)
    }

   
  }

 
  return (
    <div className='content flex gap-8'>
      <div >
        <Card>
       <PieChart
       colors={[ 'red',
       'orange',
         'yellow',
        'green',
      'blue',
       'purple']}
      series={[
        {
          data:charData,
        },
      ]}
      width={500}
      height={200}
    />
    <Button color={'primary'} onClick={()=>{setPdfModal(true)}} ><VisibilityIcon className='mr-2'/> View Table of Specification</Button>
    <Button color={'primary'} onClick={()=>{setExamPdfModal(true)}} ><VisibilityIcon className='mr-2'/> View Exam</Button>

    </Card>

    <Card className='mt-5' >
      <div className="mb-2 block  text-center">
        <Label htmlFor="comment" value="Recommendation" />
      </div>
      <Textarea style={{height:'150px'}} id="comment" value={Comment[0].comment} onChange={handleCommentChange} placeholder="Leave a comment..." required rows={4} />

<div className='flex gap-5 justify-center'>
<Button color={'primary'} onClick={handleComment} disabled={commentBtn || formData.Status === 2}  ><CommentIcon className='mr-2'/> Comment </Button>
      <Button color={'success'} onClick={handleApprove} disabled={formData.Status===2} ><CheckCircleIcon className='mr-2'/> Approve </Button>
</div>
     
    </Card>
 
   

    </div>
    <div className='flex-1 '>
      <Card className='h-full relative'>

   
    <div className="overflow-x-auto h-full">
    <Table className="text-center ">

  <Table.Head>
    <Table.HeadCell className='text-lg font-bold' >Lesson/Topics</Table.HeadCell>
    <Table.HeadCell className='text-lg font-bold'>Learning Outcomes</Table.HeadCell>
  </Table.Head>
  <Table.Body className="divide-y">
  {displayedData.length > 0 ? (
                  displayedData.map((data, index) => (
                    <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell className="whitespace-pre-wrap font-medium   text-gray-900 dark:text-white text-left p-2 leading-relaxed">
                        {data.topic}
                     
                      </Table.Cell>
                      <Table.Cell className="whitespace-pre-wrap font-medium   text-gray-900 dark:text-white text-left p-2 leading-relaxed">
                        {data.learning_outcomes}
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white" colSpan="2">
                      No data found
                    </Table.Cell>
                  </Table.Row>
                )}
  </Table.Body>
</Table>
<div className="flex justify-center absolute bottom-0 w-full pb-4">
    <Pagination
    className='shadow-lg'
      currentPage={currentPage}
      totalPages={Math.ceil(lessonData.length / rowsPerPage)}
      onPageChange={handlePageChange}
    />
  </div>


    </div>
{swal && showSwal("Updated")}
{approve && showSwal("Aprroved")}

{loading && <LoadingSubmit  />}

      </Card>
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

      <Modal show={ExamPdfModal} size={'7xl'}  onClose={() => setExamPdfModal(false)} className="h-screen">
        <Modal.Header>Exam</Modal.Header>
        <Modal.Body  className="p-0">
          <div className="min-h-96 "  style={{height:'575px'}}>
          <PDFViewer className="h-full w-full">
    <ExampdfUpdate TestPart={TestPart} examStates={examStates} />
  </PDFViewer>
      
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
  ReactDOM.render(<TOSview />, document.getElementById('root'));
}

export default Exam_review

