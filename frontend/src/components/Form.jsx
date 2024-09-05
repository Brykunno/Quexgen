import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css"
import LoadingIndicator from "./LoadingIndicator";



import { Button, Checkbox, Label, TextInput,Card } from "flowbite-react";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const name = method == "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await api.post(route, { username, password });
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        localStorage.setItem('img_dir',`${import.meta.env.VITE_API_URL}/api`)

        console.log('usersdata: ',res.data)
        api
        .get(`/api/user/account/`)
        .then((res) => res.data)
        .then((data) => {
          
         if(data[0].is_superuser ===true){
          navigate("/admin_profile");
         }
         else{
          navigate("/profile");
         }
        })
        .catch((err) => alert(err));
      } else {
        navigate("/login");
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };
  return ( 
   
    <Card className="max-w-sm w-auto form-container  ">
        <div className="text-center text-2xl font-bold"><h1>LOGIN</h1></div>
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
          placeholder="Username"
          required
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="password1" value="Password" />
        </div>
        <TextInput
          id="password1"
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="text-center w-full">
      {loading && <LoadingIndicator/>}
      </div>
      <Button type="submit" color="primary">
        LOGIN 
      </Button>
    </form>
    </Card>
  
  );
  
}

export default Form;
