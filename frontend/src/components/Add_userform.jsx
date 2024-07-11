import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css"

import { Button, Radio, Label, TextInput,Card } from "flowbite-react";

function Add_form({ route, method }) {
  const [username, setUsername] = useState("");
  const [first_name, setfirst_name] = useState("");
  const [last_name, setlast_name] = useState("");
  const [is_staff, setIs_staff] = useState(false);
  const [is_superuser, setIs_superuser] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const name = method == "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await api.post(route, {username, password ,first_name,last_name, email, is_staff,is_superuser });
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
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
        <div className="text-center text-2xl font-bold"><htrue>ADD USER</htrue></div>
  <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
  <div>
        <div className="mb-2 block">
          <Label htmlFor="uname" value="Username" />
        </div>
        <TextInput
          id="uname"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          required
        />
      </div>
  <div>
        <div className="mb-2 block">
          <Label htmlFor="first_name" value="First Name" />
        </div>
       
        <TextInput
          id="first_name"
          type="text"
          value={first_name}
          onChange={(e) => setfirst_name(e.target.value)}
          placeholder="Enter your first name"
          required
        />
      </div>

      <div>
        <div className="mb-2 block">
          <Label htmlFor="last_name" value="Last Name" />
        </div>
        <TextInput
          id="last_name"
          type="text"
          value={last_name}
          onChange={(e) => setlast_name(e.target.value)}
          placeholder="Enter your Last name"
          required
        />
      </div>

      <fieldset className="flex max-w-md flex-col gap-4">
      <legend className="mb-4">User Type</legend>
      <div className="flex items-center gap-2">
        <Radio id="superuser" name="account" 
        value="superuser"
        checked={is_superuser}
         onChange={(e) => {setIs_superuser(true); setIs_staff(false);}}
        
        />
        <Label htmlFor="admin">admin</Label>
      </div>
      <div className="flex items-center gap-2">
        <Radio id="teacher" name="account"
         value="teacher"
         checked={is_staff}
         onChange={(e) => {setIs_superuser(false); setIs_staff(true);}}
        />
        <Label htmlFor="teacher">Teacher</Label>
      </div>
   
    </fieldset>


      <div>
        <div className="mb-2 block">
          <Label htmlFor="emailtrue" value="Your email" />
        </div>
        <TextInput
          id="emailtrue"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="johndoe@gmail.com"
          required
        />
      </div>

      <div>
        <div className="mb-2 block">
          <Label htmlFor="passwordtrue" value="Your password" />
        </div>
        <TextInput
          id="passwordtrue"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <Button type="submit" color="success">
        ADD USER
      </Button>
    </form>
    </Card>
  
  );
  
}

export default Add_form;
