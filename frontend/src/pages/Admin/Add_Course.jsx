
import { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

import { Button, Radio, Label, TextInput,Card } from "flowbite-react";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';


function Add_Course({setLoading}){
    // return <Add_form route="/api/create_user/" method="add_user"/>

    const [course_name, setcourse_name] = useState("");
    const [course_code, setcourse_code] = useState("");
    const [course_type, setcourse_type] = useState("");
   
   
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
    
        try {
        await api.post('/api/courses/', {course_name,course_code, course_type });
        
        } catch (error) {
          alert(error);
        } finally {
          setLoading(true);
        }
      };

      
      
    return(

        <div >
        
    <Card className="max-w-sm w-auto   ">
    <div className="text-center text-xl font-bold"><h1>ADD COURSE</h1></div>
<form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
<div>
    <div className="mb-2 block">
      <Label htmlFor="course_name" value="Course Name" />
    </div>
    <TextInput
      id="course_name"
      type="text"
      value={course_name}
      onChange={(e) => setcourse_name(e.target.value)}
     
      required
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
      onChange={(e) => setcourse_code(e.target.value)}
      
      required
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
      onChange={(e) => setcourse_type(e.target.value)}
      
      required
    />
  </div>

 

  
  <Button color={'primary'} type="submit" >
    <PersonAddIcon className="mr-2"/>
    <p style={{marginTop:'0.8px'}}>  ADD COURSE</p>
  
  </Button>
</form>
</Card>
</div>
    );
}
export default Add_Course