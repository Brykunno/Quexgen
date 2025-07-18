import { React, useState,useEffect } from "react";
import { Breadcrumb,Card,Progress,Label, Textarea,ToggleSwitch, TextInput,Button,RangeSlider,Modal,Select } from "flowbite-react";
import Learning_outcomes_update from "./Learning_outcomes_update";

function TaxonomyAllocation(props) {

  const[specific,setSpecific] = useState(true)

 
  return (
    <div>
        <Card>
        <Breadcrumb aria-label="Default breadcrumb example">
      <Breadcrumb.Item href="/exam_bank">
      Exams
      </Breadcrumb.Item>
      <Breadcrumb.Item >
      TOS Information
      </Breadcrumb.Item>
      <Breadcrumb.Item >
      Taxonomy Allocation
      </Breadcrumb.Item>
      
    </Breadcrumb>

    <Learning_outcomes_update files={props.files} setRemembering={props.setRemembering} setUnderstanding={props.setUnderstanding}  setApplying={props.setApplying} setAnalyzing={props.setAnalyzing} setEvaluating={props.setEvaluating} setCreating={props.setCreating} addLesson={props.addLesson} handleLessonDataChange={props.handleLessonDataChange} lessonsData={props.lessonsData} removeLesson={props.removeLesson} formData={props.formData} setFormData={props.setFormData} allocations={props.allocations} Remembering={props.Remembering} Understanding={props.Understanding} Applying={props.Applying} Analyzing={props.Analyzing} Evaluating={props.Evaluating} Creating={props.Creating}   handletaxlevelChange={props.handletaxlevelChange} lessonsDataInitial={props.lessonsDataInitial} setTosModal={props.setTosModal} totalItems={props.totalItems} handleTotalItemsChange={props.handleTotalItemsChange} handleInnerLessonDataChange={props.handleInnerLessonDataChange} handleinnertaxlevelChange={props.handleinnertaxlevelChange}
    
   overallItems={props.totalItems}
 taxonomyRange={
  <div className="flex gap-3"> 
    <Card className=" gap-4 mb-5  w-full p-3"> 
      <div>
        <div className="mb-3">
          {/* <ToggleSwitch checked={true} label={true?'Locked':'Unlocked'} onChange={props.setSpecific} color={"primary"} className="mx-auto" /> */}
        </div>
        <h1 className='text-center font-bold'>Overall Taxonomy Allocation</h1>
      </div>
      <div>
        <div className="flex gap-3">
          <div className="mt-2 block w-32">
            <Label htmlFor="md-range" value="Remembering" />
          </div>
          <RangeSlider id="md-range" sizing="md" className="mt-2 w-full hidden md:block" value={props.Remembering} onChange={props.handleRememberingChange} disabled={true} />
          <div className="flex">
            <input type="number" disabled={true} className="border-0 border-b-2 border-black w-10 bg-transparent focus:outline-none p-0" value={props.Remembering} onChange={props.handleRememberingChange} /><span className="mt-2">%</span>
          </div>
        </div>
      </div>

      <div>
        <div className="flex gap-3">
          <div className="mt-2 block w-32">
            <Label htmlFor="md-range" value="Understanding" />
          </div>
          <RangeSlider id="md-range" sizing="md" className="mt-2 w-full hidden md:block" value={props.Understanding} onChange={props.handleUnderstandingChange} disabled={true} />
          <div className="flex">
            <input type="number" className="border-0 border-b-2 border-black w-10 bg-transparent focus:outline-none p-0" value={props.Understanding} disabled={true} onChange={props.handleUnderstandingChange} /><span className="mt-2">%</span>
          </div>
        </div>
      </div>

      <div>
        <div className="flex gap-3">
          <div className="mt-2 block w-32">
            <Label htmlFor="md-range" value="Applying" />
          </div>
          <RangeSlider id="md-range" sizing="md" className="mt-2 w-full hidden md:block" value={props.Applying} onChange={props.handleApplyingChange} disabled={true} />
          <div className="flex">
            <input type="number" className="border-0 border-b-2 border-black w-10 bg-transparent focus:outline-none p-0" value={props.Applying} disabled={true} onChange={props.handleApplyingChange} /><span className="mt-2">%</span>
          </div>
        </div>
      </div>

      <div>
        <div className="flex gap-3">
          <div className="mt-2 block w-32">
            <Label htmlFor="md-range" value="Analyzing" />
          </div>
          <RangeSlider id="md-range" sizing="md" className="mt-2 w-full hidden md:block" value={props.Analyzing} onChange={props.handleAnalyzingChange} disabled={true} />
          <div className="flex">
            <input type="number" className="border-0 border-b-2 border-black w-10 bg-transparent focus:outline-none p-0" value={props.Analyzing} disabled={true} onChange={props.handleAnalyzingChange} /><span className="mt-2">%</span>
          </div>
        </div>
      </div>

      <div>
        <div className="flex gap-3">
          <div className="mt-2 block w-32">
            <Label htmlFor="md-range" value="Evaluating" />
          </div>
          <RangeSlider id="md-range" sizing="md" className="mt-2 w-full hidden md:block" value={props.Evaluating} onChange={props.handleEvaluatingChange} disabled={true} />
          <div className="flex">
            <input type="number" className="border-0 border-b-2 border-black w-10 bg-transparent focus:outline-none p-0" value={props.Evaluating} disabled={true} onChange={props.handleEvaluatingChange} /><span className="mt-2">%</span>
          </div>
        </div>
      </div>

      <div>
        <div className="flex gap-3">
          <div className="mt-2 block w-32">
            <Label htmlFor="md-range" value="Creating" />
          </div>
          <RangeSlider id="md-range" sizing="md" className="mt-2 w-full hidden md:block" value={props.Creating} onChange={props.handleCreatingChange} disabled={true} />
          <div className="flex">
            <input type="number" className="border-0 border-b-2 border-black w-10 bg-transparent focus:outline-none p-0" value={props.Creating} disabled={true} onChange={props.handleCreatingChange} /><span className="mt-2">%</span>
          </div>
        </div>
      </div>
      <hr />
      <div className=" flex justify-between"> 
        <span className="max-w-96 mr-20">Total:</span>
        <span className="w-full text-center">
          <Progress
            progress={props.getTotalTaxonomy}
            progressLabelPosition="inside"
            color={'primary'}
            className=" hidden md:block"
            size="lg"
          />
          {props.checkTaxonomy(props.getTotalTaxonomy)}
        </span>
        <span className="max-w-96 ml-6 flex justify-end ">
          <div className="w-10 font-bold">
            {props.getTotalTaxonomy}%
          </div>
        </span> 
      </div>
      <div className="my-3">
        {/* <Button color={'primary'} className="mx-auto" onClick={props.submitAllocation}  isProcessing={props.loadingAllocate ? true : false}>
        {props.loadingAllocate ? 'Allocating' : 'Allocate'}
        </Button> */}
      </div>
    </Card>
  </div> 
}
    
    />
<div className=""> 
  
        <div className=" max-w-40 mb-3">
     

      </div>


      </div>
      </Card>
    </div>
  )
}

export default TaxonomyAllocation
