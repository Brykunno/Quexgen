
import { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

import { Button, Radio, Label, TextInput,Card } from "flowbite-react";
import PersonAddIcon from '@mui/icons-material/PersonAdd';


function Add_user(){
    // return <Add_form route="/api/create_user/" method="add_user"/>

    const [username, setUsername] = useState("");
    const [first_name, setfirst_name] = useState("");
    const [last_name, setlast_name] = useState("");
    const [is_staff, setIs_staff] = useState(false);
    const [is_superuser, setIs_superuser] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
    
        try {
        await api.post('/api/create_user/', {username, password ,first_name,last_name, email, is_staff,is_superuser });
        
        } catch (error) {
          alert(error);
        } finally {
          setLoading(false);
        }
      };

    return(

        <div >
        
    <Card className="max-w-sm w-auto   ">
    <div className="text-center text-xl font-bold"><h1>ADD USER</h1></div>
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
   
      required
    />
  </div>

  <fieldset className="flex max-w-md flex-col gap-4">
  <Label >User Type</Label>
  <div className="flex gap-10">
  <div className="flex items-center gap-2">
    <Radio id="superuser" name="account" 
    value="superuser"
    checked={is_superuser}
     onChange={(e) => {setIs_superuser(true); setIs_staff(false);}}
    
    />
    <Label htmlFor="admin">Admin</Label>
  </div>
  <div className="flex items-center gap-2">
    <Radio id="teacher" name="account"
     value="teacher"
     checked={is_staff}
     onChange={(e) => {setIs_superuser(false); setIs_staff(true);}}
    />
    <Label htmlFor="teacher">Teacher</Label>
  </div>
  </div>

</fieldset>


  <div>
    <div className="mb-2 block">
      <Label htmlFor="emailtrue" value="Email" />
    </div>
    <TextInput
      id="emailtrue"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
     
      required
    />
  </div>

  <div>
    <div className="mb-2 block">
      <Label htmlFor="passwordtrue" value="Password" />
    </div>
    <TextInput
      id="passwordtrue"
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
  </div>

  <Button color={'primary'} type="submit" >
    <PersonAddIcon className="mr-2"/>
    <p style={{marginTop:'0.8px'}}>  ADD USER</p>
  
  </Button>
</form>
</Card>
</div>
    );
}
export default Add_user