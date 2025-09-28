import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Swal from 'sweetalert2';
import { Button, Checkbox, Label, TextInput, Card } from "flowbite-react";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [swal, setSwal] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const showSwal = (message) => {
    Swal.fire({
      title: message,
      icon: "error",
      confirmButtonText: "Proceed",
      confirmButtonColor: '#0f23a5',
      preConfirm: () => {
        setSwal(false);
      }
    });
  };

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await api.post(route, { username, password });

      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        localStorage.setItem('img_dir', `${import.meta.env.VITE_API_URL}/api`);
        try {
          const userRes = await api.get(`/api/user/account/`);
          const data = userRes.data;
          localStorage.setItem('username', data[0].username);
          localStorage.setItem('first_name', data[0].first_name);
          localStorage.setItem('last_name', data[0].last_name);
          console.log(data[0])
          const first_login = data[0].last_login == null? true:false 
          localStorage.setItem('first_login', first_login);
          api.post('api/update-last-login/',{})



                  if (data[0].first_name && data[0].last_name) {
            const log = `User ${data[0].first_name+" "+data[0].last_name} logged in successfully`;
            const status = "success";
            api.post("/api/logs/", { log, status });
          }

          if (data[0].is_superuser === true) {
            localStorage.setItem('admin_logged_in', true)
            navigate("/dashboard");
          } else {
            localStorage.setItem('user_logged_in', true)
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
    setShowPassword(!showPassword);
  };

  return (
  <div className="flex items-center justify-center min-h-screen px-2" style={{ position: 'relative', minHeight: '100vh', width: '100vw' }}>
    {/* Background image with lower opacity */}
    <div
      style={{
        backgroundImage: "url('/images/blob-scene-haikei.svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',

        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
      }}
    />
    {/* Foreground content */}
    <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
      <Card className="w-full max-w-md mx-auto shadow-2xl border-0 rounded-2xl bg-white/90">
        {swal && showSwal("Invalid username or password")}
        <div className="flex flex-col items-center mt-4">
          <img src="/images/quexgen.png" alt="Quexgen Logo" className="h-20 w-20 rounded-full shadow-lg mb-2 border-4 border-[#1a237e] bg-white" />
          <h1 className="text-2xl font-extrabold text-[#1a237e] mb-1">Welcome to Quexgen</h1>
          <p className="text-center text-base font-medium text-gray-700 mb-4">Login to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-2">
          <div>
            <Label htmlFor="username1" value="Username" className="mb-1 font-semibold text-[#1a237e]" />
            <TextInput
              id="username1"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="rounded-lg border-gray-300 focus:border-[#3949ab] focus:ring-[#3949ab]"
              autoComplete="username"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <Label htmlFor="password1" value="Password" className="mb-1 font-semibold text-[#1a237e]" />
            <div className="relative">
              <TextInput
                id="password1"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-lg border-gray-300 focus:border-[#3949ab] focus:ring-[#3949ab] pr-10"
                autoComplete="current-password"
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute right-2 top-2"
                onClick={togglePasswordVisibility}
                tabIndex={-1}
              >
                {showPassword
                  ? <VisibilityIcon className="h-5 w-5 text-[#3949ab]" />
                  : <VisibilityOffIcon className="h-5 w-5 text-gray-400" />}
              </button>
            </div>
            <div className="text-right w-full text-sm font-semibold mt-1">
              <a href="/password-reset" className="text-[#3949ab] hover:underline">Forgot password?</a>
            </div>
          </div>
          <div className="text-center w-full">
            {loading && <LoadingIndicator />}
          </div>
          <Button
            type="submit"
            color="primary"
            className="w-full rounded-lg bg-[#3949ab] hover:bg-[#1a237e] text-white font-bold py-2 mt-2 transition-all"
          >
            LOGIN
          </Button>
        </form>
      </Card>
    </div>
  </div>
  );
}

export default Form;
