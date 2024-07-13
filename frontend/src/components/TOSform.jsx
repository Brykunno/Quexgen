import React from 'react'
import { Button, Checkbox, Label, TextInput,  Select } from "flowbite-react";

function TOSform() {
  return (
    <div className='mb-5'> 
     <div className="flex w-full flex-col gap-4">

        <div className='flex w-full gap-4'>

        <div className='w-full'>
        <div className="mb-2 block">
          <Label htmlFor="email1" value="TITLE" />
        </div>
        <TextInput id="email1" type="email"  />
      </div>

      <div className="w-full">
      <div className="mb-2 block">
        <Label htmlFor="countries" value="SEMESTER" />
      </div>
      <Select id="countries" required>
        <option>United States</option>
        <option>Canada</option>
        <option>France</option>
        <option>Germany</option>
      </Select>
    </div>

    <div className="w-full">
      <div className="mb-2 block">
        <Label htmlFor="countries" value="ALUMNI YEAR" />
      </div>
      <Select id="countries" required>
        <option>United States</option>
        <option>Canada</option>
        <option>France</option>
        <option>Germany</option>
      </Select>
    </div>


      <div className="w-full">
      <div className="mb-2 block">
        <Label htmlFor="countries" value="CAMPUS" />
      </div>
      <Select id="countries" required>
        <option>United States</option>
        <option>Canada</option>
        <option>France</option>
        <option>Germany</option>
      </Select>
    </div>


      </div>



      
      <div className='flex w-full gap-4'>

<div className='w-full'>
<div className="mb-2 block">
  <Label htmlFor="email1" value="COURSE CODE" />
</div>
<TextInput id="email1" type="email"  />
</div>

<div className="w-full">
<div className="mb-2 block">
<Label htmlFor="countries" value="DEPARTMENT" />
</div>
<Select id="countries" required>
<option>United States</option>
<option>Canada</option>
<option>France</option>
<option>Germany</option>
</Select>
</div>

<div className="w-full">
<div className="mb-2 block">
<Label htmlFor="countries" value="TYPE OF EXAMINATION" />
</div>
<Select id="countries" required>
<option>United States</option>
<option>Canada</option>
<option>France</option>
<option>Germany</option>
</Select>
</div>


<div className='w-full'>
<div className="mb-2 block">
  <Label htmlFor="email1" value="COURSE TYPE" />
</div>
<TextInput id="email1" type="email"  />
</div>

<div className='w-full'>
<div className="mb-2 block">
  <Label htmlFor="email1" value="DATE OF EXAMINATION" />
</div>
<TextInput id="email1" type="date"  />
</div>

</div>





    </div>
    </div>
  )
}

export default TOSform
