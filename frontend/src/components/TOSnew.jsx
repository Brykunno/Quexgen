import React from 'react'
import { Card,Label, Textarea } from "flowbite-react";

function TOSnew() {
  return (
    <div >

<h1 className='text-3xl'>Course content</h1>
      <hr />
      <br />

    <div className="flex gap-4">
      <Card  className="w-full">
      <h5 className="text-2xl tracking-tight text-gray-900 dark:text-white">
        Lesson/Topic
      </h5>
      <div className="max-w-sm">
      <div className="mb-2 block">
      
      </div>
      <Textarea id="comment" placeholder="Leave a comment..." required rows={10} />
    </div>
    </Card>


    </div>
    </div>
  )
}

export default TOSnew
