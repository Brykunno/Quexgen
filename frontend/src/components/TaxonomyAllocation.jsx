import { React, useState,useEffect } from "react";
import { Breadcrumb,Card,Progress,Label, Textarea, TextInput,Button,RangeSlider,Modal,Select } from "flowbite-react";

function TaxonomyAllocation(props) {

 
  return (
    <div>
        <Card>
        <Breadcrumb aria-label="Default breadcrumb example">
      <Breadcrumb.Item >
      Exams
      </Breadcrumb.Item>
      <Breadcrumb.Item >
      Course content
      </Breadcrumb.Item>
      <Breadcrumb.Item >
      Taxonomy Allocation
      </Breadcrumb.Item>
      
    </Breadcrumb>
<div className="flex gap-3"> 
        <div className=" max-w-md">
      <div>
        <div className="mb-2 block">
          <Label htmlFor="totalItems" value="Total of Items" />
        </div>
        <TextInput id="totalItems" type="number" required value={props.totalItems} onChange={props.handleTotalItemsChange} />
      </div>

      </div>

      <Card className=" gap-4 mb-5  w-full p-3"> 
      <div>
        <div className="flex gap-3">
        <div className="mt-2 block w-32">
          <Label htmlFor="md-range" value="Remembering" />
        </div>
        <RangeSlider id="md-range" sizing="md" className="mt-2 w-full" value={props.Remembering} onChange={props.handleRememberingChange} />
        <div className="flex">
        <input type="number" className="border-0 border-b-2 border-black w-10 bg-transparent focus:outline-none p-0" value={props.Remembering}  onChange={props.handleRememberingChange} /><span className="mt-2">%</span>
        </div>
        </div>
      </div>


      <div>
        <div className="flex gap-3">
        <div className="mt-2 block w-32">
          <Label htmlFor="md-range" value="Understanding" />
        </div>
        <RangeSlider id="md-range" sizing="md" className="mt-2 w-full" value={props.Understanding} onChange={props.handleUnderstandingChange} />
        <div className="flex">
        <input type="number" className="border-0 border-b-2 border-black w-10 bg-transparent focus:outline-none p-0" value={props.Understanding}  onChange={props.handleUnderstandingChange} /><span className="mt-2">%</span>
        </div>
        </div>
      </div>


      <div>
        <div className="flex gap-3">
        <div className="mt-2 block w-32">
          <Label htmlFor="md-range" value="Applying" />
        </div>
        <RangeSlider id="md-range" sizing="md" className="mt-2 w-full" value={props.Applying} onChange={props.handleApplyingChange} />
        <div className="flex">
        <input type="number" className="border-0 border-b-2 border-black w-10 bg-transparent focus:outline-none p-0" value={props.Applying}  onChange={props.handleApplyingChange} /><span className="mt-2">%</span>
        </div>
        </div>
      </div>


      <div>
        <div className="flex gap-3">
        <div className="mt-2 block w-32">
          <Label htmlFor="md-range" value="Analyzing" />
        </div>
        <RangeSlider id="md-range" sizing="md" className="mt-2 w-full" value={props.Analyzing} onChange={props.handleAnalyzingChange} />
        <div className="flex">
        <input type="number" className="border-0 border-b-2 border-black w-10 bg-transparent focus:outline-none p-0" value={props.Analyzing}  onChange={props.handleAnalyzingChange} /><span className="mt-2">%</span>
        </div>
        </div>
      </div>



      <div>
        <div className="flex gap-3">
        <div className="mt-2 block w-32">
          <Label htmlFor="md-range" value="Evaluating" />
        </div>
        <RangeSlider id="md-range" sizing="md" className="mt-2 w-full" value={props.Evaluating} onChange={props.handleEvaluatingChange} />
        <div className="flex">
        <input type="number" className="border-0 border-b-2 border-black w-10 bg-transparent focus:outline-none p-0" value={props.Evaluating}  onChange={props.handleEvaluatingChange} /><span className="mt-2">%</span>
        </div>
        </div>
      </div>


      <div>
        <div className="flex gap-3">
        <div className="mt-2 block w-32">
          <Label htmlFor="md-range" value="Creating" />
        </div>
        <RangeSlider id="md-range" sizing="md" className="mt-2 w-full" value={props.Creating} onChange={props.handleCreatingChange} />
        <div className="flex">
        <input type="number" className="border-0 border-b-2 border-black w-10 bg-transparent focus:outline-none p-0" value={props.Creating}  onChange={props.handleCreatingChange} /><span className="mt-2">%</span>
        </div>
        </div>
      </div>
      <hr  />
      <div className=" flex justify-between"> 
      <span className="max-w-96 mr-20">Total:</span>
      <span className="w-full text-center">
      <Progress
      
      progress={props.getTotalTaxonomy}
      progressLabelPosition="inside"
  
      color={'primary'}
      size="lg"
     
    
    />
   
      {props.checkTaxonomy(props.getTotalTaxonomy)} </span>
      <span className="max-w-96 ml-6 flex justify-end ">
        <div className="w-10 font-bold">
        {props.getTotalTaxonomy}%</div></span> 
      
      </div>
      </Card>

      </div>
      </Card>
    </div>
  )
}

export default TaxonomyAllocation
