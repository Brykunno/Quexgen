import { useEffect } from "react";
import { HiOutlineX } from "react-icons/hi";
import { Toast } from "flowbite-react";
import ErrorIcon from "@mui/icons-material/Error";

function ToastError({ id, message, removeToast, duration = 5000, index }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, removeToast]);

  // Calculate position dynamically based on index, using sufficient spacing
  const topOffset = 16 + index * 90; // Start at 16px, spacing of 80px per toast

  return (
    <div
      style={{ top: `${topOffset}px` }}
      className="fixed right-4 z-50 animate-fade-in"
    >
      <Toast className="bg-black/60 backdrop-blur-md shadow-lg border border-white/20 rounded-lg p-4 flex items-center">
        <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-red-500">
          <ErrorIcon className="h-5 w-5" />
        </div>
        <div className="ml-3 mr-3 text-sm font-normal text-white">{message}</div>
        <button
          className="text-white hover:text-gray-300"
          onClick={() => removeToast(id)}
        >
          <HiOutlineX />
        </button>
      </Toast>
    </div>
  );
}

export default ToastError;
