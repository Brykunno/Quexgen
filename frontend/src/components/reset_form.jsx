import React, { useState } from 'react';
import { resetPassword } from '../api';  // The service function
import { useParams } from 'react-router-dom';  // Assuming you're using React Router
import Swal from 'sweetalert2';
import { Card, Button, TextInput } from "flowbite-react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Reset_form = () => {


    const { uid, token } = useParams();  // Extract uid and token from the URL
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);  // State to toggle password visibility
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);
    const [fail, setFail] = useState(false);

    const showSwal = (message, status) => {
        Swal.fire({
            text: message,
            icon: status,
            confirmButtonText: "Proceed",
            confirmButtonColor: '#060164',
            preConfirm: () => {
                if(success === true){
                        window.location.href = "/login"
            
                    
                }
                setSuccess(false);
                setFail(false);
                
            }
        });
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#_])[A-Za-z\d@$!%*?&#_]{8,}$/;
        return regex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);

        if (newPassword !== confirmPassword) {
            showSwal("Passwords don't match.", 'error');
            setSending(false);
            return;
        }

        if (!validatePassword(newPassword)) {
            showSwal("Password must be at least 8 characters long and contain letters, numbers, and special characters.", 'error');
            setSending(false);
            return;
        }

        try {
            await resetPassword(uid, token, newPassword, confirmPassword);
            setSuccess(true);
            setSending(false);
        } catch (error) {
            setFail(true);
            setSending(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);  // Toggle the state to switch between "text" and "password"
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <Card className="w-96 p-6 border rounded-lg shadow-lg">
                <img src="/images/quexgen.png" alt="" className='h-24 w-24 mx-auto' />
                <h1 className='font-bold mx-auto text-2xl'>Quexgen</h1>
                <h2 className="text-center mb-3">Reset Password</h2>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div className="relative mb-3">
                        <TextInput
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-2 top-2"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? <VisibilityIcon className="h-5 w-5 text-gray-500" /> : <VisibilityOffIcon className="h-5 w-5 text-gray-500" />}
                        </button>
                    </div>
                    <div className="relative mb-3">
                        <TextInput
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm your new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-2 top-2"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? <VisibilityIcon className="h-5 w-5 text-gray-500" /> : <VisibilityOffIcon className="h-5 w-5 text-gray-500" />}
                        </button>
                     
                    </div>
                    <Button isProcessing={sending} color={'primary'} type="submit">Reset Password</Button>
                </form>
                {success && showSwal('Password reset successfully.', 'success')}
                {fail && showSwal('Error resetting password.', 'error')}
            </Card>
        </div>
    );
};

export default Reset_form;
