import React, { useEffect, useState } from "react";
import { fetchAttendanceByUser, Attendance } from "../api/attendanceApi";
import HomeLayout from "../layouts/HomeLayout";

const AttendanceRecord: React.FC = () => {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
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
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700 tracking-tight drop-shadow">Attendance Record</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="bg-indigo-100">
                  <th className="py-3 px-6 text-left rounded-tl-xl font-semibold text-indigo-700">SN</th>
                  <th className="py-3 px-6 text-left font-semibold text-indigo-700">Date</th>
                  <th className="py-3 px-6 text-left font-semibold text-indigo-700">Time</th>
                  <th className="py-3 px-6 text-left rounded-tr-xl font-semibold text-indigo-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-gray-500">No attendance records found.</td>
                  </tr>
                ) : (
                  attendance.map((record, idx) => (
                    <tr key={record.sn} className={idx % 2 === 0 ? "bg-white hover:bg-indigo-50 transition" : "bg-indigo-50 hover:bg-indigo-100 transition"}>
                      <td className="py-3 px-6 rounded-l-xl font-medium text-gray-700">{record.sn}</td>
                      <td className="py-3 px-6 text-gray-600">{new Date(record.dateTime).toLocaleDateString('en-CA')}</td>
                      <td className="py-3 px-6 text-gray-600">{new Date(record.dateTime).toLocaleTimeString('en-GB', { hour12: false })}</td>
                      <td className={`py-3 px-6 rounded-r-xl font-semibold ${record.status === 'Present' ? 'text-green-600' : record.status === 'Absent' ? 'text-red-500' : 'text-yellow-600'}`}>{record.status}</td>
                    </tr>
                  ))
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