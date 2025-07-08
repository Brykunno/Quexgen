import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import React from 'react'
import { BookText,Eye,KeyRound, Save, SendHorizontal,Eraser } from 'lucide-react';


function Fourth_step() {
  return (
    <div>
        <Card>
            <div className='flex'>

                <div className={"m-3 max-w-xl flex-1"}>

                    <Card className={"mb-3"}></Card>
                    <Card ></Card>
                </div>
                
                <Card className={"m-3 flex-1"}>
                    <div className='mx-3'>
                        <Button className={"mr-3"}> <BookText/> TOS</Button>
                        <Button className={"mr-3"}> <Eye/> PREVIEW</Button>
                        <Button className={"mr-3"}> <KeyRound /> ANSWER KEYS</Button>
                        <Button className={"mr-3"}> <Eraser />CLEAR</Button>
                        <Button className={"mr-3"}> <Save /> SAVE</Button>
                        <Button className={"mr-3"}> <SendHorizontal /> SUBMIT</Button>

                    </div>
            
                </Card>

            </div>
        </Card>
    </div>
  )
}

export default Fourth_step
