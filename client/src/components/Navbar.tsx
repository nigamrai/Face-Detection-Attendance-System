import React from 'react'
import {useNavigate} from 'react-router-dom'
const Navbar = () => {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem("token") !== null;
  
    const handleLogout = () => {
      localStorage.removeItem("token");
      navigate("/login");
    };
  
  return (
    <header className="flex justify-between items-center py-6 px-8 bg-white shadow-md">
    <h1 className="m-0 text-2xl font-bold text-blue-600 tracking-wide">
      Face Detection Attendance System
    </h1>
    {isLoggedIn ? (
      <div className="flex gap-4">
        <button
          className="py-2 px-6 bg-blue-600 text-white border-none rounded-md font-semibold text-base cursor-pointer shadow transition hover:bg-blue-700"
          onClick={() => navigate("/profile")}
        >
          Profile
        </button>
        <button
          className="py-2 px-6 bg-red-600 text-white border-none rounded-md font-semibold text-base cursor-pointer shadow transition hover:bg-red-700"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    ) : (
      <button
        className="py-2 px-6 bg-blue-600 text-white border-none rounded-md font-semibold text-base cursor-pointer shadow transition hover:bg-blue-700"
        onClick={() => navigate("/login")}
      >
        Login
      </button>
    )}
  </header>
  )
}

export default Navbar