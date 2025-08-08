import React, { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Webcam from 'react-webcam';
import axiosInstance from '../helpers/axiosInstance';
import HomeLayout from '../layouts/HomeLayout';

interface AttendanceProps {}

interface WebcamResponse {
  result: string;
  results?: string[];
  error?: string;
  success: boolean;
}

const Attendance: React.FC<AttendanceProps> = () => {
  const webcamRef = useRef<Webcam>(null);
  const [message, setMessage] = useState<string>('');
  const [hasCamera, setHasCamera] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [action, setAction] = useState<'checkin' | 'checkout'>('checkin'); // Track selected action

  // Check if webcam is available
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => setHasCamera(true))
      .catch(() => setHasCamera(false));
  }, []);

  const capture = async (): Promise<void> => {
    setIsLoading(true);
    if (!webcamRef.current) {
      setMessage('Webcam not detected');
      setIsLoading(false);
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setMessage('Failed to capture image');
      setIsLoading(false);
      return;
    }
    try {
      const blob = await fetch(imageSrc).then((res) => res.blob());
      const formData = new FormData();
      formData.append('image', blob, 'webcam.jpg');
      formData.append('action', action); // Send action to backend

      const response = await axiosInstance.post<WebcamResponse>('/api/v1/attendance', formData);
      setMessage(response.data.result);
      setIsLoading(false);

      if (response.data.success) {
        toast.success(response.data.result);
      } else {
        toast.error('Face not matched');
      }
    } catch (error:any) {
      setIsLoading(false);
      const errMsg = error?error:'Error recognizing face';
      setMessage(errMsg);
      toast.error(errMsg);
    }
  };

  return (
    <HomeLayout>
      <div className="flex flex-col items-center justify-center h-screen">
        {hasCamera ? (
          <>
            <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
            <div className="flex gap-4 my-4">
              <button
                onClick={() => setAction('checkin')}
                className={`px-4 py-2 rounded ${action === 'checkin' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}
                disabled={isLoading}
              >
                Check In
              </button>
              <button
                onClick={() => setAction('checkout')}
                className={`px-4 py-2 rounded ${action === 'checkout' ? 'bg-green-600 text-white' : 'bg-gray-200 text-black'}`}
                disabled={isLoading}
              >
                Check Out
              </button>
            </div>
            <button
              onClick={capture}
              className="px-4 py-2 text-lg text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
              disabled={isLoading}
            >
              {isLoading ? <div className="spinner"></div> : `Submit ${action === 'checkin' ? 'Check In' : 'Check Out'}`}
            </button>
          </>
        ) : (
          <p>No webcam detected</p>
        )}
        <p>{message}</p>
        <ToastContainer />
      </div>
    </HomeLayout>
  );
};

export default Attendance;
