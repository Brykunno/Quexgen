import { useState,useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css"
import LoadingIndicator from "./LoadingIndicator";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Swal from 'sweetalert2'



import { Button, Checkbox, Label, TextInput,Card } from "flowbite-react";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [swal,setSwal] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); 


  useEffect(()=>{
    if(localStorage.getItem('user_logged_in')){
      window.location.href = "/dashboard_instructor"
    }

    if(localStorage.getItem('admin_logged_in')){
      window.location.href = "/dashboard"
    }
  },[])

  const showSwal = (message) => {
    Swal.fire({
      title: message,
     
      icon: "error",
      confirmButtonText: "Proceed",
      confirmButtonColor: '#060164',
      preConfirm: () => {
        setSwal(false); 
      }
    });
  }

  // useEffect(() => {
  //   const accessToken = localStorage.getItem('username');
  //   if (accessToken) {
  
  //     navigate("/profile");
  //   }
  //   console.log('access: ',accessToken)
  // }, [navigate]);

 

  const name = method == "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
  
    try {
      const res = await api.post(route, { username, password });
  
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        
        localStorage.setItem('img_dir',`${import.meta.env.VITE_API_URL}/api`);
  
        console.log('usersdata: ', res.data);
  
        try {
          const userRes = await api.get(`/api/user/account/`);
          const data = userRes.data;
          localStorage.setItem('username',data[0].username);
  
          if (data[0].is_superuser === true) {
            localStorage.setItem('admin_logged_in',true)
            navigate("/dashboard");
          } else {
            localStorage.setItem('user_logged_in',true)
            navigate("/dashboard_instructor");
          }
        } catch (userError) {
          console.error('Error fetching user data:', userError);
          setSwal({
            show: true,
            title: 'Error',
            text: 'There was a problem fetching user data. Please try again later.',
          });
        }
  
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error('Error during login:', error);
      setSwal({
        show: true,
        title: 'Login Error',
        text: `There was an error during login: ${error.message || 'Unknown error'}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);  // Toggle the state to switch between "text" and "password"
};
  
  return ( 
   <div className="flex items-center justify-center h-screen px-5">
    <Card className="w-96 mx-auto   ">
      {swal && showSwal("Invalid username or password")}
    <img src="/images/quexgen.png" alt="" className="h-20 w-20 mx-auto" />
        <div className="text-center text-2xl font-bold"><h1>Welcome to Quexgen</h1>
        <p className="text-center text-sm font-normal">Login to your account</p>
        </div>
  <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
      <div>
        <div className="mb-2 block">
          <Label htmlFor="username1" value="Username" />
        </div>
        <TextInput
          id="username1"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        
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
                    <div className="text-left w-full text-sm font-semibold">
      <a href="/password-reset">forgot password?</a>
      </div >
      </div>
      <div className="text-center w-full">
      {loading && <LoadingIndicator/>}
      
      </div>

      
      <Button type="submit" color="primary">
        LOGIN 
      </Button>

    </form>
    </Card>
    </div>
  );
  
}

export default Form;
