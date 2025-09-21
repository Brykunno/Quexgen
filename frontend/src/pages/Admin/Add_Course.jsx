import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { Radio, Label, TextInput, Card, FileInput } from "flowbite-react";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import api from "../../api";
import { useSnackbar } from "notistack";
import useAppSnackbar from "../../components/ui/snackbar/Snackbar";

function Add_Course({ setLoading,setRefresh }) {

   const { showSnackbar } = useAppSnackbar();
  const [course_name, setCourseName] = useState("");
  const [course_code, setCourseCode] = useState("");
  const [course_type, setCourseType] = useState("");
  const [course_syllabus, setCourseSyllabus] = useState(null);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    setCourseSyllabus(file); // Update state with the file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("course_name", course_name);
      formData.append("course_code", course_code);
      formData.append("course_type", course_type);
      formData.append("course_syllabus", course_syllabus);

      await api.post("/api/courses/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showSnackbar("Course added successfully!",{variant:"success"});
      setCourseName("");
      setCourseCode("");
      setCourseType("");
      setCourseSyllabus(null);


     setRefresh(prev => !prev)
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to add course. Please try again.",{variant:"error"});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card className="max-w-sm w-auto">
        <div className="text-center text-xl font-bold">
          <h1>ADD COURSE</h1>
        </div>
        <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="course_name" value="Course Name" />
            </div>
            <TextInput
              id="course_name"
              type="text"
              value={course_name}
              onChange={(e) => setCourseName(e.target.value)}
              required
              placeholder="Enter course name"
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="course_code" value="Course Code" />
            </div>
            <TextInput
              id="course_code"
              type="text"
              value={course_code}
              onChange={(e) => setCourseCode(e.target.value)}
              required
              placeholder="Enter course code"
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="course_type" value="Course Type" />
            </div>
            <TextInput
              id="course_type"
              type="text"
              value={course_type}
              onChange={(e) => setCourseType(e.target.value)}
              required
              placeholder="Enter course type"
            />
          </div>
          <div>
            <Label htmlFor="course_syllabus" value="Course Syllabus" />
            <FileInput
              id="course_syllabus"
              sizing="sm"
              onChange={handleFileChange}
              required
            />
          </div>
          <Button color="primary" variant="contained" type="submit">
            <PersonAddIcon className="mr-2" />
            <span style={{ marginTop: "0.8px" }}>ADD COURSE</span>
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default Add_Course;
