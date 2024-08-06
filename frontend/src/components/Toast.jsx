import { useState, useEffect } from 'react';
import { HiCheck } from 'react-icons/hi';
import { Toast } from 'flowbite-react'; // Assuming you're using Flowbite for the Toast component

function ToastMessage({ message, duration = 5000 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <div className={`fixed top-4 right-4 z-100 ${isVisible ? 'animate-fade-in' : 'animate-fade-out'}`}>
      {isVisible && (
        <Toast >
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
            <HiCheck className="h-5 w-5" />
          </div>
          <div className="ml-3 mr-3 text-sm font-normal">{message}</div>
          <Toast.Toggle />
        </Toast>
      )}
    </div>
  );
}

export default ToastMessage;
