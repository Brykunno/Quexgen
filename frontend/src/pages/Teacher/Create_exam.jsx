import React, { useState,useEffect } from 'react';
import TOS from '../../components/TOS';
import TOSform from '../../components/TOSform';
import { Button,Card } from "flowbite-react";
import api from "../../api";

function Create_exam() {



  return (
    <div className='content'>
  
  <Card>
        {/* <TOSform /> */}

        
 
      <TOS />
    
      </Card>
    </div>
  );
}

export default Create_exam;
