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
import { PlusIcon } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useId, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "sonner"
import { CircleCheckIcon, XIcon } from "lucide-react";


export function AddUser() {
 
  const id = useId();

  const [course_name, setCourseName] = useState("");
  const [course_code, setCourseCode] = useState("");
  const [course_type, setCourseType] = useState("");
  const [course_syllabus, setCourseSyllabus] = useState(null);


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

      alert("Course added successfully!");
      setCourseName("");
      setCourseCode("");
      setCourseType("");
      setCourseSyllabus(null);
    } catch (error) {
      console.error(error);
      alert("Failed to add course. Please try again.");
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

          

          <Button
      variant="outline"
      onClick={() => {
        toast({
          title: "We couldn't complete your request!",
          description: "There was a problem with your request.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }}
    >
      Show toast
    </Button>
       
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit"  onClick={() => {
        toast.custom((t) => (
          <div className="bg-background text-foreground w-full rounded-md border px-4 py-3 shadow-lg sm:w-[var(--width)]">
            <div className="flex gap-2">
              <div className="flex grow gap-3">
                <CircleCheckIcon
                  className="mt-0.5 shrink-0 text-emerald-500"
                  size={16}
                  aria-hidden="true"
                />
                <div className="flex grow justify-between gap-12">
                  <p className="text-sm">Message sent</p>
                  <div className="text-sm whitespace-nowrap">
                    <button className="text-sm font-medium hover:underline">View</button>{" "}
                    <span className="text-muted-foreground mx-1">·</span>{" "}
                    <button
                      className="text-sm font-medium hover:underline"
                      onClick={() => toast.dismiss(t)}
                    >
                      Undo
                    </button>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
                onClick={() => toast.dismiss(t)}
                aria-label="Close banner"
              >
                <XIcon
                  size={16}
                  className="opacity-60 transition-opacity group-hover:opacity-100"
                  aria-hidden="true"
                />
              </Button>
            </div>
          </div>
        ));
      }}>Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
