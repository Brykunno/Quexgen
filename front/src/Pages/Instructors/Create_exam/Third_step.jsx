import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

import React from 'react'


function Third_step() {
  return (
    <div>
      <Card>
        <CardHeader>
            <CardTitle>Generate Exam</CardTitle>
        </CardHeader>
        <CardContent>

          <Card className={"max-w-2xl mx-auto"}>
        <CardContent>

            <div className='flex mb-3'>
                <p className='flex-1'>Items for Multple Choice</p>
                <div>
                         <Input  type="number"/>
                </div>
            </div>

            
            <div className='flex mb-3'>
                <p className='flex-1'>Items for Identification</p>
                <div>
                         <Input  type="number"/>
                </div>
            </div>

            
            <div className='flex mb-3'>
                <p className='flex-1'>Items for True or False</p>
                <div>
                         <Input  type="number"/>
                </div>
            </div>

            
            <div className='flex mb-3'>
                <p className='flex-1'>Items for Subjective Test</p>
                <div>
                         <Input  type="number"/>
                </div>
            </div>

            <Separator></Separator>
            <div className='text-center' >
            <Button className={"mt-3 mx-auto"}>Generate Exam</Button>
            </div>

            

        </CardContent>
      </Card>

        </CardContent>
      </Card>
    </div>
  )
}

export default Third_step
