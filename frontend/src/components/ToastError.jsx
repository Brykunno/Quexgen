import { useState, useEffect } from 'react';
import { HiOutlineX } from 'react-icons/hi';
import { Toast } from 'flowbite-react'; // Assuming you're using Flowbite for the Toast component
import ErrorIcon from '@mui/icons-material/Error';

function ToastError({ message, duration = 5000,setToast }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setToast(false)
     
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <div className={`fixed mb-3 top-4 right-4 z-100 ${isVisible ? 'animate-fade-in' : 'animate-fade-out'}`}>
      {isVisible && (
        <Toast className="bg-black/60 backdrop-blur-md shadow-lg border border-white/20 rounded-lg p-4 flex items-center">
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-red-500 dark:bg-red-800 dark:text-red-200">
            <ErrorIcon className="h-5 w-5" />
          </div>
          <div className="ml-3 mr-3 text-sm font-normal text-white">{message}</div>
          <Toast.Toggle />
        </Toast>
      )}
    </div>
  );
}

export default ToastError;
