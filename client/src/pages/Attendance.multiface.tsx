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
  attendance?: any;
}

const Attendance: React.FC<AttendanceProps> = () => {
  const webcamRef = useRef<Webcam>(null);
  const [message, setMessage] = useState<string>('');
  const [hasCamera, setHasCamera] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [action, setAction] = useState<'checkin' | 'checkout'>('checkin');

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => setHasCamera(true))
      .catch(() => setHasCamera(false));
  }, []);

  // Helper to extract faces from an image using face-api.js (browser-side)
  // This requires face-api.js to be installed and models loaded
  // For demo, we assume only one face per image (as before)
  // To support multiple faces, you need to use face-api.js or similar
  // Here, we just send the same image multiple times for demo

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
      // For real multi-face support, you would use face-api.js to detect faces and crop them
      // Here, we just send the same image as a single face for demo
      // Replace this with actual face detection and cropping for production
      const blobs = [await fetch(imageSrc).then((res) => res.blob())];
      let foundAny = false;
      for (let i = 0; i < blobs.length; i++) {
        const formData = new FormData();
        formData.append('image', blobs[i], `webcam_face_${i}.jpg`);
        formData.append('action', action);
        try {
          const response = await axiosInstance.post<WebcamResponse>('/api/v1/attendance', formData);
          if (response.data.success) {
            foundAny = true;
            toast.success(`${response.data.attendance?.userId?.name || 'User'} marked ${action === 'checkin' ? 'Checked In' : 'Checked Out'}`);
          } else {
            // Do nothing for not matched
          }
        } catch (error: any) {
          // Do nothing for not matched
        }
      }
      setIsLoading(false);
      if (!foundAny) {
        setMessage('No faces matched.');
        toast.info('No faces matched.');
      } else {
        setMessage('Attendance processed.');
      }
    } catch (error: any) {
      setIsLoading(false);
      let errMsg = 'Error recognizing face(s)';
      if (error && error.response && error.response.data) {
        errMsg = error.response.data.result || error.response.data.error || errMsg;
      } else if (error && error.message) {
        errMsg = error.message;
      }
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
