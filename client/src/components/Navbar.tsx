import React from 'react'
import {useNavigate} from 'react-router-dom'
const Navbar = () => {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem("token") !== null;
    const user = isLoggedIn ? JSON.parse(localStorage.getItem("user") || '{}') : null;

    const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    };
  
  return (
    <header className="flex justify-between items-center py-6 px-8 bg-white shadow-md">
    <h1 className="m-0 text-2xl font-bold text-blue-600 tracking-wide">
      Face Detection Attendance System
    </h1>
    {isLoggedIn ? (
      <div className="flex items-center gap-6">
        {user && user.name && (
          <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-lg shadow-sm">
            {user.avatar && user.avatar.secure_url ? (
              <img
                src={user.avatar.secure_url}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover border border-indigo-200"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-indigo-300 flex items-center justify-center text-white font-bold">
                {user.name.charAt(0)}
              </div>
            )}
            <span className="font-semibold text-indigo-700">{user.name}</span>
          </div>
        )}
        <button
          className="py-2 px-5 bg-green-600 text-white border-none rounded-md font-semibold text-base cursor-pointer shadow transition hover:bg-green-700"
          onClick={() => navigate("/attendances")}
        >
          My Records
        </button>
        <button
          className="py-2 px-5 bg-blue-600 text-white border-none rounded-md font-semibold text-base cursor-pointer shadow transition hover:bg-blue-700"
          onClick={() => navigate("/")}
        >
          Take Attendance
        </button>
        <button
          className="py-2 px-5 bg-red-600 text-white border-none rounded-md font-semibold text-base cursor-pointer shadow transition hover:bg-red-700"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    ) : (
      <div className="flex gap-4">
        <button
          className="py-2 px-5 bg-blue-600 text-white border-none rounded-md font-semibold text-base cursor-pointer shadow transition hover:bg-blue-700"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        <button
          className="py-2 px-5 bg-green-600 text-white border-none rounded-md font-semibold text-base cursor-pointer shadow transition hover:bg-green-700"
          onClick={() => navigate("/")}
        >
          Take Attendance
        </button>
      </div>
    )}
  </header>
  )
}

export default Navbar