import React from 'react'
import { Progress } from "flowbite-react";

function Exam() {
  return (
    <div className='content'>
        <h1 className='text-3xl'>Exam</h1>
         <Progress progress={100} />
         <hr />
      
    </div>
  )
}

export default Exam
