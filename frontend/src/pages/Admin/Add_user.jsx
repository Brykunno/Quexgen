import { useState,useEffect} from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import {Button} from "@mui/material";

import {  Radio, Label, TextInput,Card,Modal } from "flowbite-react";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Autocomplete, TextField, Chip } from '@mui/material';
import { useSnackbar } from 'notistack';


function Add_user({setLoading,setOpenModalAdd,openModalAdd,setRefresh,refresh}){
    // return <Add_form route="/api/create_user/" method="add_user"/>
  const { enqueueSnackbar } = useSnackbar();
    const [username, setUsername] = useState("");
    const [first_name, setfirst_name] = useState("");
    const [last_name, setlast_name] = useState("");
    const [middle_name, setMiddle_name] = useState("");
    const [is_staff, setIs_staff] = useState(false);
    const [is_superuser, setIs_superuser] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("PSU_$C2025");
    const [showPassword, setShowPassword] = useState(false); 
      const [testError,setTestError] = useState(false);
const [options,setOptions] = useState([]);

const [courses,setCourses] = useState([])
const [selected,setSelected] = useState([])


useEffect(() => {
  // Only generate if all fields are filled
  if (first_name && middle_name && last_name) {
    // Get first letter of first and middle name, and full last name (no spaces, uppercase)
    const uname =
      (first_name[0] || "").toUpperCase() +
      (middle_name[0] || "").toUpperCase() +
      (last_name.replace(/\s+/g, "").toUpperCase());
    setUsername(uname);
  }
}, [first_name, middle_name, last_name]);



useEffect(() => {
  api.get(`/api/courses/`)
    .then((res) => {
      const courseNames = res.data.map((course) => course.course_name); // Extract course names
      setOptions(courseNames); // Update state once with the full array
      setCourses(res.data)
    })
    .catch((err) => {
      console.error("Error fetching courses:", err);
    });
}, []);


   
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true); // Start the loading spinner
    
      try {
        // Send the API request to create the user
        const res = await api.post('/api/create_user/', {
          username,
          password,
          first_name,
          middle_name,
          last_name,
          email,
          is_staff,
          is_superuser,
        });
    
        // Extract user_id from the response
        const user_id = res.data.id; // Adjust based on your API's response structure
    
        // Map through the courses and associate user with selected courses

        if(is_staff){
          const postCoursePromises = courses.map(async (course) => {
            if (selected.includes(course.course_name)) {
              const course_id = course.id;
              return api.post(`/api/teacherCourse/`, { user_id, course_id });
            }
          });
          
        // Await all course association calls
        await Promise.all(postCoursePromises);
        }
   
    
    
        // Reset fields after successful submission
        setUsername("");
        setfirst_name("");
        setlast_name("");
        setMiddle_name("");
        setEmail("");
        setPassword("");
        setIs_staff(false);
        setIs_superuser(false);
    
        // Optionally close the modal
        setOpenModalAdd(false);

        setRefresh(prev => !prev);
    enqueueSnackbar("User successflly added!",{variant:'success'})
      } catch (error) {

          enqueueSnackbar(error.response.data.errors.email[0],{variant:'error'});

       enqueueSnackbar("Failed to create user or associate courses. Please try again.",{variant:'error'});
      } finally {
        setLoading(false); // Stop the loading spinner
      }
    };
    
    

      const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);  // Toggle the state to switch between "text" and "password"
    };
      
    return(

        <div >
<form onSubmit={handleSubmit} >
<Modal dismissible show={openModalAdd} onClose={() => setOpenModalAdd(false)}>
            <Modal.Header>User Information</Modal.Header>
            <Modal.Body>
            <div className="space-y-6">
                <div>
                  <Label htmlFor="first_name" value="First Name" />
                  <TextInput
                    id="first_name"
                    type="text"
                    value={first_name}
                    onChange={(e) => setfirst_name(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="middle_name" value="Middle Name" />
                  <TextInput
                    id="middle_name"
                    type="text"
                    value={middle_name}
                    onChange={(e) => setMiddle_name(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="last_name" value="Last Name" />
                  <TextInput
                    id="last_name"
                    type="text"
                    value={last_name}
                    onChange={(e) => setlast_name(e.target.value)}
                    required
                  />

                 
                </div>
                <div className="flex max-w-md flex-col gap-4">
                  <Label>User Type</Label>
                  <div className="flex gap-10">
                    <div className="flex items-center gap-2">
                      <Radio
                        id="superuser"
                        name="account"
                        value="superuser"
                        checked={is_superuser}
                        onChange={(e) => {setIs_superuser(true); setIs_staff(false);}}
                      />
                      <Label htmlFor="superuser">Admin</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Radio
                        id="teacher"
                        name="account"
                        value="teacher"
                        checked={is_staff}
                        onChange={(e) => {setIs_superuser(false); setIs_staff(true);}}
                      />
                      <Label htmlFor="teacher">Instructor</Label>
                    </div>
                  </div>
                </div>
                <div className={is_staff?`show`:`hidden`}>
                <Autocomplete
  multiple
  id="chip-selection"
  name="ExaminationType"
  options={options} // List of options
  value={selected} // Current selected options
  onChange={(event, newValue) => {
    setSelected(newValue); // Directly set the updated list
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
    <TextField
      error={testError}
      {...params}
      variant="outlined"
      label="Courses"
    />
  )}
/>

                </div>
                <div>
                  <Label htmlFor="email" value="Email" />
                  <TextInput
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                               <div>
                  <Label htmlFor="uname" value="Username (auto-generated)" />
                  <TextInput
                    id="uname"
                    type="text"
                    value={username}
                    readOnly
                    required
                  />
                </div>
               
                <div>
        <div className="mb-2 block">
          <Label htmlFor="password1" value="Password" />
        </div>

        <div className="relative mb-3">
                        <TextInput
                            type={showPassword ? "text" : "password"}
                            
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-2 top-2"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? <VisibilityIcon className="h-5 w-5 text-gray-500" /> : <VisibilityOffIcon className="h-5 w-5 text-gray-500" />}
                        </button>
                    </div>

      </div>
 
 
                </div>
            </Modal.Body>
            <Modal.Footer>
              <Button color={'primary'} variant='contained' onClick={handleSubmit} >Add</Button>
              
              <Button  onClick={() => setOpenModalAdd(false)}>
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>
          </form>
        
 
</div>
    );
}
export default Add_user