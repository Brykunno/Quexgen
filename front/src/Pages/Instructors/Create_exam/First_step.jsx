import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import React, { useContext,useEffect, useState } from 'react';
import MultipleSelector from "@/components/ui/multiselect";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import api from '@/lib/api';
import { Label } from '@radix-ui/react-dropdown-menu';
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { getLocalTimeZone, today } from "@internationalized/date"
import { useLocale } from "react-aria"
import { RangeCalendar } from "@/components/ui/calendar-rac"
import { DataContext } from "./Create_exam";


function First_step() {

    const [data, setData] = useState([]);
    const now = today(getLocalTimeZone());
    const {setFormData,formData} = useContext(DataContext);


    const frameworks = [
      {
        value: "Multiple Choice",
        label: "Multiple Choice",
      },
      {
        value: "Identification",
        label: "Identification",
      },
      {
        value: "True or False",
        label: "True or False",
      },
            {
        value: "Subjective",
        label: "Subjective",
      },
    ]

   
    
    const handleChange = (name,value) => {
      const updatedFormData = {
        ...formData,
        [name]: value
      };
      setFormData(updatedFormData);
    };

    useEffect(() => {
      api
        .get(`/api/user/account/`)
        .then((res) => res.data)
        .then((data) => {

          const fullName = getFullNames(data); // Get full name of the user
    setFormData(prevFormData => ({
      ...prevFormData,
      Faculty: fullName // Update formData with the full name
    }));
        })
        .catch((err) => alert(err));
    }, []);
 
    function getFullNames(users) {
      let fname = users[0]?.first_name || ''; // Use optional chaining to avoid errors
      let lname = users[0]?.last_name || '';
      
      return `${fname} ${lname}`.trim();
    }

useEffect(() => {


  api.get(`/api/settings/`)
  .then((res) => {
  
    setFormData(
      (prevFormData => ({
        ...prevFormData,
        Chairperson: res.data[0].chairperson,
        Dean: res.data[0].dean,
        Director: res.data[0].director,
        AcademicYear: res.data[0].academic_year,
      }))
    );
  })
  .catch((err) => {
    alert(err);
  });


}, []); 

const [officials,setOfficials] = useState([])

useEffect(()=>{

  setOfficials([
    {
      id: 1,
      title: "Campus Executive Director",
      description:
        formData.Director,
    },
    {
      id: 2,
      title: "College Dean",
      description:
      formData.Dean,
    },
    {
      id: 3,
      title: "Department Chairperson",
      description:
      formData.Chairperson,
    },
    {
      id: 4,
      title: "Instructor",
      description:
      formData.Faculty,
    },
  ])


},[formData]);





  return (
      <Card className={'max-w-4xl mx-auto'}>
        <CardHeader>
          <CardTitle className="text-2xl">Table of Specification Information</CardTitle>
          <CardDescription>
            Fill out the fields below to proceed to the next step
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className='px-3'> 

      <div className="grid w-full items-center gap-1.5">
      <Label htmlFor="Semester">Course</Label>
      <Select id="title" name="Title" value={formData.CourseCode} onValueChange={(value) => {
  const selectedCourse = data.find(course => course.course_code === value);
  if (selectedCourse) {
    setFormData({
      ...formData,
      CourseCode: selectedCourse.course_code,
      Title: selectedCourse.course_name
    });
}}}>

      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a course" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Courses</SelectLabel>

          {data.map((course, index) => (
  <SelectItem key={index} value={course.course_code} >
    {course.course_name} - {course.course_code} - {course.course_type}
  </SelectItem>
))}

      
        </SelectGroup>
      </SelectContent>
    </Select>
      
    </div>
      
    <div className='flex gap-3 my-3'>
    <div className="grid w-full items-center gap-1.5 flex-1">
      <Label htmlFor="Semester">Semester</Label>
      <Select value={formData.Semester} onValueChange={(value) => handleChange("Semester",value)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a semester" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Semester</SelectLabel>
          <SelectItem value="1st Semester">1st Semester</SelectItem>
          <SelectItem value="2nd Semester">2nd Semester</SelectItem>
      
        </SelectGroup>
      </SelectContent>
    </Select>
    </div>
    <div className="grid w-full items-center gap-1.5 flex-1">
      <Label htmlFor="Term">Term</Label>
      <Select value={formData.Term} onValueChange={(value) => handleChange("Term",value)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a term" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Term</SelectLabel>
          <SelectItem value="1st Semester">Midterm</SelectItem>
          <SelectItem value="2nd Semester">Finals</SelectItem>
      
        </SelectGroup>
      </SelectContent>
    </Select>
    </div>
    </div>

    <div className='flex gap-3 my-3'>
    <div className="grid w-full items-center gap-1.5 flex-1">
      <Label htmlFor="Campus">Campus</Label>
      <Select value={formData.Campus} onValueChange={(value) => handleChange("Campus",value)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a Campus" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Campus</SelectLabel>
          <SelectItem value="1st Semester">San Carlos Campus</SelectItem>
          <SelectItem value="2nd Semester">Lingayen Campus</SelectItem>
      
        </SelectGroup>
      </SelectContent>
    </Select>
    </div>
    <div className="grid w-full items-center gap-1.5 flex-1">
      <Label htmlFor="Department">Department</Label>
      <Select value={formData.Department} onValueChange={(value) => handleChange("Department",value)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a department" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Department</SelectLabel>
          <SelectItem value="IT Department">IT Department</SelectItem>
          <SelectItem value="Business Administration">Business Administration</SelectItem>
      
        </SelectGroup>
      </SelectContent>
    </Select>
    </div>

    </div>

    <div className='flex gap-3 my-3'>
    <div className="grid w-full items-center gap-1.5 flex-1">
      <Label htmlFor="Academic Year">Academic Year</Label>
      <Input
    type="text"
    value={formData.AcademicYear}
    onChange={(e) => handleChange("AcademicYear", e.target.value)} 
  />
    </div>
    <div className="grid w-full items-center gap-1.5 flex-1">
  <Label htmlFor="Date of Examination">Date of Examination</Label>
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant={"outline"}
        className={cn(
          "justify-start text-left font-normal",
          !formData.ExaminationDate && "text-muted-foreground"
        )}
      >
        <CalendarIcon />
        {formData.ExaminationDate ? format(formData.ExaminationDate, "PPP") : <span>Pick a date</span>}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0" align="start">
      <Calendar
        mode="single"
        selected={formData.ExaminationDate ? new Date(formData.ExaminationDate) : new Date()}
        onSelect={(selectedDate) => {
          handleChange("ExaminationDate", format(selectedDate, "yyyy-MM-dd")); // Update form data with the selected date
        }}
        initialFocus
        disabled={(date) => date < new Date()}
      />
    </PopoverContent>
  </Popover>
</div>


    </div>

{/*     
    <div className='flex gap-3 my-3'>
    <div className="grid w-full items-center gap-1.5 flex-1">
      <Label htmlFor="Academic Year">Campus Executive Director</Label>
    <Input></Input>
    </div>
    <div className="grid w-full items-center gap-1.5 flex-1">
      <Label htmlFor="Date of Examination">College Dean</Label>
    <Input></Input>
    </div>

    </div>
    

    <div className='flex gap-3 my-3'>
    <div className="grid w-full items-center gap-1.5 flex-1">
      <Label htmlFor="Academic Year">Department Chairperson</Label>
    <Input></Input>
    </div>
    <div className="grid w-full items-center gap-1.5 flex-1">
      <Label htmlFor="Date of Examination">Instructor</Label>
    <Input></Input>
    </div>

    </div> */}
    <div className=' gap-3 my-3'>
    <div className="grid w-full items-center gap-1.5">
  <Label htmlFor="Exam Type">Exam Type</Label>
  <MultipleSelector
    commandProps={{
      label: "Select exam type",
    }}
    value={formData.ExaminationType.map(type => {
      const framework = frameworks.find(f => f.label === type); // Find the framework with matching type
      return framework ? framework : ''; // Return the value or an empty string if not found
    })}
    defaultOptions={frameworks}  // The available options
    placeholder="Select exam type"
    emptyIndicator={<p className="text-center text-sm">No results found</p>}
    
    onChange={(selectedValues) => {
      const selectedValueArray = selectedValues?.map(option => option.value);  // Map over the selected values to get the "value" property
      handleChange("ExaminationType", selectedValueArray); // Updates the form data with selected values (array)
    }}
  />
</div>


    </div>
    <div className="">
    <Timeline defaultValue={4} className={"my-3 mt-5 max-w-md"}>
      {officials.map((item) => (
        <TimelineItem key={item.id} step={item.id}>
          <TimelineHeader>
            <TimelineSeparator />
            <TimelineTitle className="-mt-0.5">{item.title}</TimelineTitle>
            <TimelineIndicator />
          </TimelineHeader>
          <TimelineContent>
            {item.description}
            <TimelineDate className="mt-2 mb-0">{item.date}</TimelineDate>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
    </div>

  
    </div>

        </CardContent>
      </Card>

  )
}

export default First_step
