import React, { useEffect, useState } from 'react';
import { Attendance, fetchAttendanceByUser } from '../api/attendanceApi';
import HomeLayout from '../layouts/HomeLayout';

const AttendanceRecord: React.FC = () => {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }
    setIsLoggedIn(true);
    const user = JSON.parse(userStr);
    fetchAttendanceByUser(user.id)
      .then((data) => {
        setAttendance(data);
        setLoading(false);
      })
      .catch(() => {
        setAttendance([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <HomeLayout>
        <div className="attendance-record">
          <h2>Attendance Record</h2>
          <p>Loading...</p>
        </div>
      </HomeLayout>
    );
  }

  if (!isLoggedIn) {
    return (
      <HomeLayout>
        <div className="attendance-record">
          <h2>Attendance Record</h2>
          <p>Please log in to view your attendance record.</p>
        </div>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-br from-blue-50 to-purple-100 py-8">
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700 tracking-tight drop-shadow">
            Attendance Record
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="bg-indigo-100">
                  <th className="py-3 px-6 text-left rounded-tl-xl font-semibold text-indigo-700">
                    SN
                  </th>
                  <th className="py-3 px-6 text-left font-semibold text-indigo-700">Date</th>
                  <th className="py-3 px-6 text-left font-semibold text-indigo-700">
                    Check In Time
                  </th>
                  <th className="py-3 px-6 text-left font-semibold text-indigo-700">
                    Check In Status
                  </th>
                  <th className="py-3 px-6 text-left font-semibold text-indigo-700">
                    Check Out Time
                  </th>
                  <th className="py-3 px-6 text-left rounded-tr-xl font-semibold text-indigo-700">
                    Check Out Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {attendance.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-gray-500">
                      No attendance records found.
                    </td>
                  </tr>
                ) : (
                  attendance.map((record, idx) => {
                    const checkInTime = record.checkIn
                      ? new Date(record.checkIn).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: true,
                        })
                      : '-';
                    const checkOutTime = record.checkOut
                      ? new Date(record.checkOut).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: true,
                        })
                      : '-';
                    const date = record.checkIn
                      ? new Date(record.checkIn).toLocaleDateString('en-CA')
                      : '-';
                    return (
                      <tr
                        key={record.sn}
                        className={
                          idx % 2 === 0
                            ? 'bg-white hover:bg-indigo-50 transition'
                            : 'bg-indigo-50 hover:bg-indigo-100 transition'
                        }
                      >
                        <td className="py-3 px-6 rounded-l-xl font-medium text-gray-700">
                          {record.sn}
                        </td>
                        <td className="py-3 px-6 text-lg text-gray-700 font-semibold min-w-[120px]">{date}</td>
                        <td className="py-3 px-6 text-lg text-blue-700 font-bold min-w-[140px]">{checkInTime}</td>
                        <td
                          className={`py-3 px-6 font-semibold ${record.checkIn ? 'text-green-600' : 'text-red-500'}`}
                        >
                          {record.checkIn ? 'Present' : 'Absent'}
                        </td>
                        <td className="py-3 px-6 text-lg text-purple-700 font-bold min-w-[140px]">{checkOutTime}</td>
                        <td
                          className={`py-3 px-6 rounded-r-xl font-semibold ${record.checkOut ? 'text-green-600' : 'text-red-500'}`}
                        >
                          {record.checkOut ? 'Checked Out' : 'Not Checked Out'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
};

export default AttendanceRecord;
