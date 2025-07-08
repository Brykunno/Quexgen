import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Loader2, PlusIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import MultipleSelector from "@/components/ui/multiselect";
import { useState, useEffect,useContext } from "react";
import api from "@/lib/api";
import { DataContext } from "./Users";
import { customToast } from "@/components/ui/customToast";


export function AddUser() {
  const {setRefresh} = useContext(DataContext);
   
  const [loading,setLoading] = useState(false)
  const [courses, setCourses] = useState([]);
  const [userInfo, setUserInfo] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    username: "",
    password: "PSU_$C2025",
    email: "",
    is_superuser: false,
    is_staff:true,
    selectedCourses: [],
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await api.get(`/api/courses/`);
        setCourses(res.data);
      } catch (err) {
        alert(err);
      }
    };
    getData();
  }, []);


  useEffect(() => {
    const { first_name, middle_name, last_name } = userInfo;
    if (first_name && last_name) {
      const username = `${first_name.charAt(0).toUpperCase()}${middle_name.charAt(0).toUpperCase()}${last_name.replace(/\s/g, '').toUpperCase()}`;
      setUserInfo((prev) => ({ ...prev, username }));
    }
  }, [userInfo.first_name, userInfo.middle_name, userInfo.last_name]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [id]: value }));
  };
  const handleRadioChange = (value) => {
    setUserInfo((prev) => ({ ...prev, is_superuser: value }));
  };

  const handleCourseChange = (selected) => {
    const formattedCourses = selected.map(course => (course.value));
    setUserInfo((prev) => ({ ...prev, selectedCourses: formattedCourses }));
  };
  const coursesData = courses.map((course) => ({
    value: course.id,
    label: course.course_code,
  }));


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start the loading spinner
    try {

      const res = await api.post('/api/create_user/', userInfo);
  

      const user_id = res.data.id; 

      if(userInfo.is_superuser == false){
        const postCoursePromises = courses.map(async (course) => {
          if (userInfo.selectedCourses.includes(course.id)) {
            const course_id = course.id;
            return api.post(`/api/teacherCourse/`, { user_id, course_id });
          }
        });
        
      // Await all course association calls
      await Promise.all(postCoursePromises);
      }
       customToast("success","User created successfully!")
      setUserInfo({
        first_name: "",
        middle_name: "",
        last_name: "",
        username: "",
        password: "PSU_$C2025",
        email: "",
        is_superuser: false,
        is_staff:true,
        selectedCourses: [],
      });
      setRefresh((prev) => !prev); 
    } catch (error) {
      console.error("Error creating user or associating courses:", error);
      customToast("error","Failed to add user. Please try again.")
    } finally {
      setLoading(false); 
    }
  };
  


  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="ml-auto" variant="outline">
          <PlusIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
          Add user
        </Button>
      </SheetTrigger>
      <SheetContent>
        <form onSubmit={handleSubmit}>
        <SheetHeader>
          <SheetTitle>ADD USER</SheetTitle>
          <SheetDescription>
            Add a user to the system by filling out the form below. Click 'Create' when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4 pt-0 mx-4">
          <div className="flex gap-3">
            <div>
              <Label htmlFor="first_name">First Name</Label>
              <Input id="first_name" value={userInfo.first_name} onChange={handleChange} className="mt-2" />
            </div>
            <div>
              <Label htmlFor="middle_name">Middle Name</Label>
              <Input id="middle_name" value={userInfo.middle_name} onChange={handleChange} className="mt-2" />
            </div>
          </div>

          <div>
            <Label htmlFor="last_name">Last Name</Label>
            <Input id="last_name" value={userInfo.last_name} onChange={handleChange} className="mt-2" />
          </div>

          <div>
            <Label>User Type</Label>
            <RadioGroup value={userInfo.user_type} onValueChange={handleRadioChange} className="flex gap-8 p-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={true} id="r1" />
                <Label htmlFor="r1">Admin</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={false} id="r2" />
                <Label htmlFor="r2">Instructor</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>Course</Label>
            <MultipleSelector
              commandProps={{ label: "Select courses" }}
              defaultOptions={coursesData}
              onChange={handleCourseChange}
              placeholder="Select courses to assign"
              hideClearAllButton
              hidePlaceholderWhenSelected
              emptyIndicator={<p className="text-center text-sm">No results found</p>}
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={userInfo.email} onChange={handleChange} className="mt-2" />
          </div>

          <div>
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={userInfo.username} className="mt-2" />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" value={userInfo.password} onChange={handleChange} className="mt-2" />
          </div>
        </div>


        <SheetFooter>
          <div className="flex gap-4">
            <SheetClose asChild className="flex-1">
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <SheetClose asChild className="flex-1" >
            <Button type="submit"  disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Creating
                </>
              ) : (
                "Create"
              )}</Button>
                  </SheetClose>
        
          </div>
        </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
