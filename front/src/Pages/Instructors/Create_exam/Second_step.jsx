import { useContext,useEffect,useState } from "react"
 
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertCircleIcon, PaperclipIcon, UploadIcon, XIcon } from "lucide-react"
import {
  formatBytes,
  useFileUpload,
} from "@/hooks/use-file-upload"
import { Separator } from "react-aria-components";
import { Hourglass } from 'lucide-react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { DataContext } from "./Create_exam";
import api from '@/lib/api';
function second_step() {
  const {lessonsDataInitial} = useContext(DataContext);
  const {handleTotalItemsChange,totalItems,setLessonsDatainitial,handleInnerLessonDataChange,handleLessonDataChange,handleOneAllocation,Remembering,setRemembering,Understanding,setUnderstanding,Applying,setApplying,Analyzing,setAnalyzing,Evaluating,setEvaluating,Creating,setCreating} = useContext(DataContext);

  const [value, setValue] = useState([25])
  const [fileStatus, setFileStatus] = useState(Array(lessonsDataInitial.length).fill(false));
  const [fileInfo,setFileInfo] = useState([])
 
  const initialFiles = [

  ]

  const maxSize = 10 * 1024 * 1024 // 10MB default

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    maxSize,
    initialFiles,
  })

  const file = files[0]

  const tabs = [1,2,3,4,5]




  const addLesson = (newLesson) => {
    setLessonsDatainitial(prevLessons => [...prevLessons, newLesson]);
  };

  const handleValidateFile = async (value,index) => {
    setFileStatus((prev) => {
      const newStatus = [...prev];
      newStatus[index] = true; // Set the specific index to true
      return newStatus;
    });
  
    const formData = new FormData();
    formData.append('file', value); // Append the selected file
  
    try {
      // Make an asynchronous request to Django to process the file and JSON data
      const response = await api.post('/api/validate-pdf/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
 
      const fileStats = response.data.file_status[0]
      // Process the response to get the lessonsDataInitial info
 
      const newData = [...lessonsDataInitial]
  
  
        newData[index]['file_status'] = fileStats 
   
      
      setLessonsDatainitial(newData);
      setFileStatus((prev) => {
        const newStatus = [...prev];
        newStatus[index] = false; // Reset the specific index in case of error
        return newStatus;
      });
    
    } catch (error) {
      // Handle errors that may occur during the request
      console.error('Error processing the file and data:', error);
      setFileStatus((prev) => {
        const newStatus = [...prev];
        newStatus[index] = false; // Reset the specific index in case of error
        return newStatus;
      });
    }
  
    
    
  };

  const [read,setRead] = useState(false)

  const handleReadOneFile = async (value,index) => {
    setRead(true)
    const updatedFileInfo = []; // Initialize an array to store file information
      const formData = new FormData();
      formData.append('file', value); // Append the selected file
  
      try {
        // Make a request to Django to process the file and JSON data
        const response = await api.post('/api/lesson-info/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        // Process the response to get the lessonsDataInitial info
        const dataques = response.data.lesson_info;
    
  
        // Add the lessonsDataInitial info object to the updated fileInfo array
        updatedFileInfo.push(dataques);
  
      } catch (error) {
        console.error('Error processing the file and data:', error);
      }
    
  
    // Update the state with the accumulated fileInfo as an array of objects
    setFileInfo(updatedFileInfo);
  
    // Update lessons data and save it to localStorage
  
    
   
    updatedFileInfo.forEach( async (data) => {
      const newData = [...lessonsDataInitial];
  
      // Update the specific fields in the corresponding lessonsDataInitial object
      newData[index]['topic'] = data[0].lesson_topic;
      
    const response_out = await api.post('/api/count_outcomes/', {
      objectives: data[0].learning_outcomes,
    });
  
    let outArray = response_out.data.outcomes;
  
   
      newData[index]['learning_outcomes'] = outArray;
      newData[index]['teachingHours'] = Array(outArray?.length || 0).fill(0);
      newData[index]['allocation'] = Array(outArray?.length || 0).fill(0);
      newData[index]['items'] = Array(outArray?.length || 0).fill(0);
      newData[index]['remembering'] = Array(outArray?.length || 0).fill(0);
      newData[index]['understanding'] = Array(outArray?.length || 0).fill(0);
      newData[index]['applying'] = Array(outArray?.length || 0).fill(0);
      newData[index]['analyzing'] = Array(outArray?.length || 0).fill(0);
      newData[index]['evaluating'] = Array(outArray?.length || 0).fill(0);
      newData[index]['creating'] = Array(outArray?.length || 0).fill(0);
      newData[index]['total'] = Array(outArray?.length || 0).fill(0);
      newData[index]['placement'] = Array(outArray?.length || '').fill('');
      newData[index]['totalItems'] = Array(outArray?.length || 0).fill(0);
      newData[index]['taxonomy_levels']['Remembering'] = Array(outArray?.length || 0).fill(0);
      newData[index]['taxonomy_levels']['Understanding'] = Array(outArray?.length || 0).fill(0);
      newData[index]['taxonomy_levels']['Analyzing'] = Array(outArray?.length || 0).fill(0);
      newData[index]['taxonomy_levels']['Applying'] = Array(outArray?.length || 0).fill(0);
      newData[index]['taxonomy_levels']['Evaluating'] = Array(outArray?.length || 0).fill(0);
      newData[index]['taxonomy_levels']['Creating'] = Array(outArray?.length || 0).fill(0);
      
     handleOneAllocation(newData[index]['learning_outcomes'],index)
  

      setLessonsDatainitial(newData);
      setRead(false)
      
    });
   
  };

  const removeSG = (index) => {
    setLessonsDatainitial(prevTopics => {
      const updated = [...prevTopics];
      if (updated[index]) {
        updated[index].study_guide = null;
      }
      return updated;
    });
  };

  const [taxCap,setTaxCap] = useState(false)

  useEffect(()=>{

    const total = Number(Remembering)+Number(Understanding)+Number(Applying)+Number(Analyzing)+Number(Evaluating)+Number(Creating)
    setTaxCap(total)

  },[Remembering,Understanding,Applying,Analyzing,Evaluating,Creating])


  
  
  
  return (
    <Card >
    <CardHeader>
      <CardTitle>Taxonomy Allocation</CardTitle>
      <CardDescription>Deploy your new project in one-click.</CardDescription>
    </CardHeader>
    <CardContent>

    <Tabs
      defaultValue="tab-0"
 
      className="w-full flex"
    >
        <ScrollArea>
      <TabsList className="flex gap-1 bg-transparent py-0">

        {
          lessonsDataInitial.map((data,idx)=>{
            return (
              <TabsTrigger key={idx}
              value={`tab-${idx}`}
              className="data-[state=active]:bg-muted w-full justify-start data-[state=active]:shadow-none"
            >
              Lesson {idx+1}
            </TabsTrigger>
            )
          })
        }
        
        <Button
        variant={'outline'}
          value="tab-5"
          className="data-[state=active]:bg-muted w-full justify-start data-[state=active]:shadow-none"
          onClick={() => addLesson({ 
            topic: '',
            learning_outcomes: [],
            teachingHours: [],
            allocation: [],
            items: [],
            remembering: [],
            understanding: [],
            applying: [],
            analyzing: [], 
            evaluating: [],
            creating: [],
            total: [],
            placement: [],
            totalItems:[],
            max:0,
            study_guide:null,
            tos_teacher: 0,
            file_status:'',
            taxonomy_levels: {
              Remembering:0,
              Understanding:0,
              Applying:0,
              Analyzing:0,
              Evaluating:0,
              Creating:0
            }
            })}
        >
         <Plus/> Add Lesson
        </Button>
      </TabsList>

      <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="grow rounded-md border text-start">

        {
          lessonsDataInitial.map((data,idx)=>{
            return (
              <TabsContent key={idx}
              value={`tab-${idx}`}>
                 <p className="text-muted-foreground px-4 pt-3 text-xs">
            Lesson {idx+1}
          </p>
             <div className="p-3">

       <div className="flex flex-col gap-2">
      {/* Drop area */}

      <div
        role="button"
        onClick={openFileDialog}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[input:focus]:ring-[3px]"
      >
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload file"
          disabled={Boolean(data.study_guide)}
          onChange={(e) => {
            handleLessonDataChange(idx, 'study_guide', e.target.files[0]);
            handleValidateFile(e.target.files[0], idx);
            handleReadOneFile(e.target.files[0], idx);
          }}
        />

        <div className="flex flex-col items-center justify-center text-center">
          <div
            className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <UploadIcon className="size-4 opacity-60" />
          </div>
          <p className="mb-1.5 text-sm font-medium">Upload file</p>
          <p className="text-muted-foreground text-xs">
            Drag & drop or click to browse (max. {formatBytes(maxSize)})
          </p>
        </div>
      </div>

      {errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-1 text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}

      {/* File list */}
      {data.study_guide && (
        <div className="space-y-2">
          <div
            key={`sg-${idx}`}
            className="flex items-center justify-between gap-2 rounded-xl border px-4 py-2"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <PaperclipIcon
                className="size-4 shrink-0 opacity-60"
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium">
                  {data.study_guide}
                </p>
              </div>
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent"
              onClick={() => removeSG(idx)}
              aria-label="Remove file"
            >
              <XIcon className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}

    </div>
    <div className="p-3">
      <div>
      <Label>Lesson Summary</Label>
    <Textarea className={'mt-2'} placeholder="Enter lessonsDataInitial summary." value={data.topic} ></Textarea>

    
    </div>

    <div className="mt-3 flex gap-3">

 <div className="flex-1">
     
            <Card className={'mb-3'}>
        
        <CardContent>
          <div className="flex">
              <div className="flex-1">
                <p className="mt-1">
               Overall Total Exam Items
                </p>
             
              </div>
              <div>
                <Input type='number' value={totalItems} min={'0'} onChange={handleTotalItemsChange}></Input>
              </div>
          </div>
        
        </CardContent>
      </Card>
     <Card>
        <CardHeader>
          <CardTitle>Overall Taxonomy Levels</CardTitle>  
        </CardHeader>
        <CardDescription>
        <div className="px-3">
        <div className="space-y-4 mb-3">
      <div className="flex items-center justify-between gap-2">
        <Label className="leading-6">Remembering</Label>
        <output className="text-sm font-medium tabular-nums bg-">{Remembering}%</output>
      </div>
      <Slider
        value={[Remembering]}
        onValueChange={(val) => setRemembering(val[0])}
        aria-label="Slider with output"
        rangeColor="bg-purple-600"
        className={"cursor-pointer"}
        min={0}
        max={100}

        
      />
    </div>

    <div className="space-y-4 mb-3">
      <div className="flex items-center justify-between gap-2">
        <Label className="leading-6">Understanding</Label>
        <output className="text-sm font-medium tabular-nums bg-">{Understanding}%</output>
      </div>
      <Slider
        value={[Understanding]}
        onValueChange={(val) => setUnderstanding(val[0])}
        aria-label="Slider with output"
        rangeColor="bg-blue-600"
        className={"cursor-pointer"}
        min={0}
        max={100}

        
      />
    </div>

    
    <div className="space-y-4 mb-3">
      <div className="flex items-center justify-between gap-2">
        <Label className="leading-6">Applying</Label>
        <output className="text-sm font-medium tabular-nums bg-">{Applying}%</output>
      </div>
      <Slider
        value={[Applying]}
        onValueChange={(val) => setApplying(val[0])}
        aria-label="Slider with output"
        rangeColor="bg-green-600"
        className={"cursor-pointer"}
        min={0}
        max={100}

        
      />
    </div>

    
    <div className="space-y-4 mb-3">
      <div className="flex items-center justify-between gap-2">
        <Label className="leading-6">Analyzing</Label>
        <output className="text-sm font-medium tabular-nums bg-">{Analyzing}%</output>
      </div>
      <Slider
        value={[Analyzing]}
        onValueChange={(val) => setAnalyzing(val[0])}
        aria-label="Slider with output"
        rangeColor="bg-yellow-600"
        className={"cursor-pointer"}
        min={0}
        max={100}

        
      />
    </div>
    
    <div className="space-y-4 mb-3">
      <div className="flex items-center justify-between gap-2">
        <Label className="leading-6">Evaluating</Label>
        <output className="text-sm font-medium tabular-nums bg-">{Evaluating}%</output>
      </div>
      <Slider
        value={[Evaluating]}
        onValueChange={(val) => setEvaluating(val[0])}
        aria-label="Slider with output"
        rangeColor="bg-orange-600"
        className={"cursor-pointer"}
        min={0}
        max={100}

        
      />
    </div>

    
    <div className="space-y-4 mb-3">
      <div className="flex items-center justify-between gap-2">
        <Label className="leading-6">Creating</Label>
        <output className="text-sm font-medium tabular-nums bg-">{Creating}%</output>
      </div>
      <Slider
        value={[Creating]}
        onValueChange={(val) => setCreating(val[0])}
        aria-label="Slider with output"
        rangeColor="bg-red-600"
        className={"cursor-pointer"}
        min={0}
        max={100}

        
      />
    </div>
          </div>
          <Separator></Separator>

        </CardDescription>
        <CardContent>

        <div className="flex">
            <div className="flex-1">
              Overall Total
            </div>
            <div>
{taxCap}%
            </div>

          </div>
        </CardContent>
     </Card>
     </div>

      <div className="flex-1">
         <Card className={'mb-3'}>
        
        <CardContent>
          <div className="flex">
              <div className="flex-1">
                <p className="mt-1">
                Maximum teaching hours for Lesson {idx+1}
                </p>
             
              </div>
              <div>
                <Input type='number'></Input>
              </div>
          </div>
        
        </CardContent>
      </Card>
     <Card>
        <CardHeader>
          <CardTitle>Learning Outcomes</CardTitle>  
        </CardHeader>
        <CardDescription>


        <Tabs defaultValue="tab-0-1">
        <ScrollArea>
      <TabsList className="mx-auto flex w-full max-w-xs bg-transparent">
        {data.learning_outcomes.map((outcome,idxsub)=>{
          return(
          <TabsTrigger
          value={`tab-${idxsub}-1`} key={`tab-${idxsub}-1`}
          className="group data-[state=active]:bg-muted flex-1 flex-col p-3 text-xs data-[state=active]:shadow-none"
        >
          <Badge className="mb-1. min-w-5 px-1 transition-opacity group-data-[state=inactive]:opacity-50">
            {idxsub+1}
          </Badge>
        </TabsTrigger>)
        })}
        
        

      </TabsList>

      <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {data.learning_outcomes.map((outcome,idxsub)=>{
          return(
            <TabsContent value={`tab-${idxsub}-1`} key={`tab-${idxsub}-1`}> 
            <div className="px-3">
                  <Textarea >{outcome}</Textarea>
                </div>
                <Separator className="my-3"></Separator>
                <div className="px-3 mt-3">
                  <div className="flex w-full">
                    <div className="flex-1">
                    <p className="font-bold text-white pt-2 flex">Number of teaching hours: </p>
                    </div>
                    <div>
         
                    <Input
  type="number"
  value={data.teachingHours[idxsub] ?? 0} // fallback to empty string to avoid uncontrolled warning
  onChange={(e) =>
    handleInnerLessonDataChange(idx, idxsub, 'teachingHours', Number(e.target.value))
  }
/>

                    </div>
                  
                  </div>
                 
                </div>
                <Separator className="my-3"></Separator>
                <div className="px-3">
                    <Card>
                      <CardHeader> 
                        <CardTitle>
                        Taxonomy Levels Concentration for Learning Outcome {idxsub+1}
                        </CardTitle>
              </CardHeader>
                      <CardContent>

                        <div className="px-3 mt-3">
                                <div className="flex w-full">
                                  <div className="flex-1">
                                  <p className="font-bold text-white pt-2">Remembering: </p>
                                  </div>
                                  <div>
                                  <Input type={'number'} value={data.taxonomy_levels[idxsub]?.Remembering} ></Input>
                                  </div>
                                
                                </div>
                              
                              </div>
                              <Separator className="mt-3"></Separator>
                              
                              <div className="px-3 mt-3">
                                <div className="flex w-full">
                                  <div className="flex-1">
                                  <p className="font-bold text-white pt-2">Understanding: </p>
                                  </div>
                                  <div>
                                  <Input type={'number'} value={data.taxonomy_levels[idxsub]?.Understanding}></Input>
                                  </div>
                                
                                </div>
                              
                              </div>
                              <Separator className="mt-3"></Separator>
                              
                              <div className="px-3 mt-3">
                                <div className="flex w-full">
                                  <div className="flex-1">
                                  <p className="font-bold text-white pt-2">Applying: </p>
                                  </div>
                                  <div>
                                  <Input type={'number'} value={data.taxonomy_levels[idxsub]?.Applying} ></Input>
                                  </div>
                                
                                </div>
                              
                              </div>
                              <Separator className="mt-3"></Separator>
                              
                              <div className="px-3 mt-3">
                                <div className="flex w-full">
                                  <div className="flex-1">
                                  <p className="font-bold text-white pt-2" >Analyzing: </p>
                                  </div>
                                  <div>
                                  <Input type={'number'} value={data.taxonomy_levels[idxsub]?.Analyzing} ></Input>
                                  </div>
                                
                                </div>
                              
                              </div>
                              <Separator className="mt-3"></Separator>
                              
                              <div className="px-3 mt-3">
                                <div className="flex w-full">
                                  <div className="flex-1">
                                  <p className="font-bold text-white pt-2">Evaluating: </p>
                                  </div>
                                  <div>
                                  <Input type={'number'} value={data.taxonomy_levels[idxsub]?.Evaluating}></Input>
                                  </div>
                                
                                </div>
                              
                              </div>
                              <Separator className="mt-3"></Separator>
                                    
                              <div className="px-3 mt-3">
                                <div className="flex w-full">
                                  <div className="flex-1">
                                  <p className="font-bold text-white pt-2">Creating: </p>
                                  </div>
                                  <div>
                                  <Input type={'number'} value={data.taxonomy_levels[idxsub]?.Creating}></Input>
                                  </div>
                                
                                </div>
                              
                              </div>
                      </CardContent>
                    </Card>
                        
                </div>


                
            </TabsContent>)
        })}
      
    </Tabs>
        
        </CardDescription>
    
     </Card>
     </div>

    
     {/* <div className="flex-[0_0_300px]">

     <Card>
        <CardHeader>
          <CardTitle>Number of Teaching Hours</CardTitle>  
        </CardHeader>
        <CardDescription>
        <div className="px-3">
            <Input type={'number'}></Input>
          </div>
        </CardDescription>
        <CardContent>

        </CardContent>
     </Card>
     </div> */}





    </div>
    </div>
       </div>
            </TabsContent>
            )
          })
        }
      </div>
    </Tabs>
    </CardContent>
    <CardFooter className="flex justify-between">
      
    </CardFooter>
  </Card>
  )
}

export default second_step
