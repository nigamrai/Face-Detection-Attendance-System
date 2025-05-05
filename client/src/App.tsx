import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Attendance from "./pages/Attendance";
import Login from "./pages/Login";
import AttendanceRecord from "./pages/AttendanceRecord";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Attendance />} />
        <Route path="/login" element={<Login />} />
        <Route path="/attendance" element={<AttendanceRecord />} />
      </Routes>
    </Router>
  );
}

export default App;
