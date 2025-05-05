import React, { useEffect, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAttendance, addAttendance, Attendance } from "../api/attendanceApi";
import HomeLayout from "../layouts/HomeLayout";

const AttendanceRecord: React.FC = () => {
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  // Fetch attendance records
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }
    setIsLoggedIn(true);
    fetchAttendance()
      .then((data) => {
        setAttendance(data);
        setLoading(false);
      })
      .catch(() => {
        setAttendance([]);
        setLoading(false);
      });
  }, []);

  // Add new attendance record
  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!date || !status) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      const newRecord = await addAttendance({ date, status });
      setAttendance((prev) => [...prev, newRecord]);
      setDate("");
      setStatus("");
    } catch {
      setError("Failed to add record.");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <HomeLayout>
     
      {isLoggedIn ? (
        <div className="p-8">
          <h2 className="text-xl font-semibold mb-4">Attendance Record</h2>
          <form onSubmit={handleAdd} className="mb-6 flex gap-4 items-end">
            <div>
              <label className="block mb-1 font-medium">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border rounded px-3 py-2"
                required
              >
                <option value="">Select</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </div>
            <button
              type="submit"
              className="py-2 px-6 bg-green-600 text-white rounded font-semibold shadow hover:bg-green-700"
            >
              Add Record
            </button>
          </form>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {attendance.length === 0 ? (
            <p>No attendance records found.</p>
          ) : (
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Date</th>
                  <th className="py-2 px-4 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((record, idx) => (
                  <tr key={record.id || idx}>
                    <td className="py-2 px-4 border-b">{record.date}</td>
                    <td className="py-2 px-4 border-b">{record.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-lg">Please log in to view or add your attendance record.</p>
        </div>
      )}
    </HomeLayout>
  );
};

export default AttendanceRecord;