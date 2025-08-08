import React, { useEffect, useState } from "react";
import axiosInstance from "../helpers/axiosInstance";
import HomeLayout from "../layouts/HomeLayout";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Attendance {
  _id: string;
  userId: User;
  checkIn: string;
  checkOut: string;
  status: string;
}

const AdminAttendances: React.FC = () => {
  const [allAttendances, setAllAttendances] = useState<Attendance[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchDate, setSearchDate] = useState<string>("");

  useEffect(() => {
    fetchAllAttendances();
    // eslint-disable-next-line
  }, []);

  const fetchAllAttendances = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/v1/admin/attendances");
      setAllAttendances(res.data.attendances);
      setAttendances(res.data.attendances);
    } catch (err) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date: string) => {
    setSearchDate(date);
    if (!date) {
      setAttendances(allAttendances);
      return;
    }
    // Filter and sort attendances by checkIn date
    const filtered = allAttendances.filter(att => {
      if (!att.checkIn) return false;
      const checkInDate = new Date(att.checkIn);
      const yyyy = checkInDate.getFullYear();
      const mm = String(checkInDate.getMonth() + 1).padStart(2, '0');
      const dd = String(checkInDate.getDate()).padStart(2, '0');
      const formatted = `${yyyy}-${mm}-${dd}`;
      return formatted === date;
    });
    // Sort by checkIn ascending
    filtered.sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());
    setAttendances(filtered);
  };

  return (
    <HomeLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-indigo-700">All Attendances</h1>
          <div className="flex gap-2 items-center">
            <input
              type="date"
              value={searchDate}
              onChange={e => handleDateChange(e.target.value)}
              className="border border-indigo-200 rounded px-3 py-2 text-indigo-700 focus:outline-none focus:border-indigo-500 shadow-sm"
            />
            {searchDate && (
              <button
                className="ml-2 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
                onClick={() => handleDateChange("")}
              >
                All Attendances
              </button>
            )}
          </div>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : attendances.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center text-lg text-gray-500">No record of attendances.</div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
            <table className="w-full mb-4 text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-200 to-indigo-100 text-indigo-800">
                  <th className="px-6 py-3 rounded-tl-xl">User</th>
                  <th className="px-6 py-3">Check In</th>
                  <th className="px-6 py-3">Check Out</th>
                  <th className="px-6 py-3">Check In Status</th>
                  <th className="px-6 py-3">Check Out Status</th>
                  
                </tr>
              </thead>
              <tbody>
                {attendances.map((att, idx) => (
                  <tr
                    key={att._id}
                    className={`transition-colors duration-200 ${idx % 2 === 0 ? 'bg-indigo-50' : 'bg-white'} hover:bg-indigo-100`}
                  >
                    <td className="px-6 py-3 font-semibold text-indigo-900">{att.userId?.name || "Unknown"}</td>
                    <td className="px-6 py-3 text-indigo-700">{att.checkIn ? new Date(att.checkIn).toLocaleString() : "-"}</td>
                    <td className="px-6 py-3 text-indigo-700">{att.checkOut ? new Date(att.checkOut).toLocaleString() : "-"}</td>
                    {/* Check In Status */}
                    <td className="px-6 py-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${att.checkIn ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {att.checkIn ? 'Present' : 'Absent'}
                      </span>
                    </td>
                    {/* Check Out Status */}
                    <td className="px-6 py-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${att.checkOut ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {att.checkOut ? 'Checked Out' : 'No Check Out'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
  {/* Removed Add Attendance button */}
      </div>
    </HomeLayout>
  );
};

export default AdminAttendances;
