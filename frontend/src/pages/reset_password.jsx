import React, { useState } from 'react';
import { requestPasswordReset } from '../api';  // The service function
import Swal from 'sweetalert2'

import {
  Card,
  Button,
  TextInput
} from "flowbite-react";

const Reset_password = () => {
  const [email, setEmail] = useState('');

  const [sending, setSending] = useState(false);
  const [swal,setSwal] = useState(false);
  const [fail,setFail] = useState(false);


  const showSwal = (message,status) => {
    Swal.fire({
      text: message,
     
      icon: status,
      confirmButtonText: "Proceed",
      confirmButtonColor: '#060164',
      preConfirm: () => {
        setSwal(false); 
        setFail(false)
      }
    });
  }


  const handleSubmit = async (e) => {
    setSending(true)
    e.preventDefault();
    try {
      await requestPasswordReset(email);
      setSwal(true)
 
      setSending(false)
    } catch (error) {
    setFail(true)

      setSending(false)
      console.error('Error during reset:', error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-96 p-4">
    
        <img src="/images/quexgen.png" alt="" className='h-24 w-24 mx-auto' />
        <h1 className='font-bold mx-auto text-2xl'>Quexgen</h1>
        <h2 className="text-center  mb-4">Request Password Reset</h2>
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <TextInput
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mb-3"
          />
          <Button isProcessing={sending} color={'primary'} type="submit">Send Reset Link</Button>
        </form>
      
        {swal && showSwal('Password reset link sent to your email.','success')}
        {fail && showSwal('Error sending password reset link.','error')}
      </Card>
    </div>
  );
};

export default Reset_password;
