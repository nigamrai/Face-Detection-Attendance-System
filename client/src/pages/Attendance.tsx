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
      console.error('Webcam not available');
      setMessage('Webcam not detected');
      setIsLoading(false);
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      console.error('Failed to capture image');
      setMessage('Failed to capture image');
      setIsLoading(false);
      return;
    }
    try {
      const blob = await fetch(imageSrc).then((res) => res.blob());
      const formData = new FormData();
      formData.append('image', blob, 'webcam.jpg');

      const response = await axiosInstance.post<WebcamResponse>('/api/v1/attendance', formData);
      console.log('Server Response:', response.data);

      //   if (response.data.error === 'Duplicate attendance') {
      //     setMessage('You have already attended today');
      //     toast.info('Attendance already marked for today');
      //     setIsLoading(false);

      //   }
        console.log(response.data.error);
      if (response.data.error==="Duplicate attendance") {
        setMessage(response.data.error);
        toast.error(response.data.error);
        setIsLoading(false);
        return;
      }

      setMessage(response.data.result);
      setIsLoading(false);

      // Show a toast message for each face based on the recognition result
      if (response.data.results && response.data.results.length > 1) {
        response.data.results.forEach((result, index) => {
          if (result.includes('Present')) {
            toast.success(`Face ${index + 1} matched: Present`);
          } else {
            toast.error(`Face ${index + 1} not matched`);
          }
        });
      } else {
        if (response.data.success) {
          toast.success('Face matched: Present');
        } else {
          toast.error('Face not matched');
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error recognizing face:', error);
      setMessage(error.message || 'Error recognizing face');
      toast.error(error.message || 'Error recognizing face');
    }
  };

  return (
    <HomeLayout>
      <div className="flex flex-col items-center justify-center h-screen">
        {hasCamera ? (
          <>
            <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
            <button
              onClick={capture}
              className="px-4 py-2 text-lg text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {isLoading ? <div className="spinner"></div> : 'Check Attendance'}
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
