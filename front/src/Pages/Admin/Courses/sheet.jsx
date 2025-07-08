import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { useContext,useState, useEffect ,useId} from "react";
import { AlertTriangleIcon, InfoIcon, Loader2, PlusIcon } from "lucide-react"
import  api  from "@/lib/api"
import {customToast} from "@/components/ui/customToast"
import { DataContext } from "./Courses";


export function AddCourse() {

  const {setRefresh} = useContext(DataContext);
 
  const id = useId();

  const [course_name, setCourseName] = useState("");
  const [course_code, setCourseCode] = useState("");
  const [course_type, setCourseType] = useState("");
  const [course_syllabus, setCourseSyllabus] = useState(null);
  const [loading,setLoading] = useState(false)

 
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

      customToast("success","Course created successfully!")
      setCourseName("");
      setCourseCode("");
      setCourseType("");
      setCourseSyllabus(null);
      setRefresh((prev) => !prev); 
    } catch (error) {
      console.error(error);
      customToast("error","Failed to add course. Please try again.")
    } finally {
      setLoading(false);

  
      
    }
  };



  return (
    <Sheet>
    
      <SheetTrigger asChild>
      <Button className="ml-auto" variant="outline">
        <PlusIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
        Add Course
            </Button>
      </SheetTrigger>
      <SheetContent>
      <form onSubmit={handleSubmit}>
        <SheetHeader>
          <SheetTitle>ADD COURSE</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click add user when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4 mx-4">
          <div >
            <Label htmlFor="course_name" className="text-right">
              Course Name
            </Label>
            <Input
      id="course_name"
      value={course_name}
      onChange={(e) => setCourseName(e.target.value)} // Update state on input change
      className="col-span-3"
    />
          </div>
          <div className="">
            <Label htmlFor="course_code" className="text-right">
              Course Code
            </Label>
            <Input id="course_code"  
            value={course_code}
          onChange={(e) => setCourseCode(e.target.value)}  className="col-span-3" />
          </div>
          <div className="">
            <Label htmlFor="course_type" className="text-right">
              Course Type
            </Label>
            <Input id="course_type" value={course_type}
          onChange={(e) => setCourseType(e.target.value)} className="col-span-3" />
          </div>

          <div className="">
            <Label htmlFor="username" className="text-right">
              Syllabus
            </Label>
            <Input id={id} className="p-0 pe-3 file:me-3 file:border-0 file:border-e" type="file" onChange={handleFileChange} />
          </div>

          

        
       
        </div>
        <SheetFooter>
        <div className=" flex gap-4 ">
        <SheetClose asChild className="flex-1" >
            <Button variant="outline" >Cancel</Button>
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
  )
}
