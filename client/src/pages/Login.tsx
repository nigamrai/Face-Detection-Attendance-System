import React, { useState } from "react";
import { login } from '../api/authApi';
import { useNavigate } from "react-router-dom";
import HomeLayout from "../layouts/HomeLayout";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate=useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const response = await login({ email: username, password });
      setSuccess("Login successful!");
      // Optionally store token or user info here
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      navigate('/attendances');
      // Redirect or update UI as needed
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
 <HomeLayout>
     <div className="min-h-[700px] flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-gray-100 p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-10 min-w-[340px] flex flex-col items-center gap-5 relative w-[500px]">
        {/* <h1 className="text-2xl font-bold text-blue-600 mb-1 tracking-wide">Face Detection Attendance System</h1> */}
        <p className="text-gray-800 text-base tracking-wide mb-3">Please login to continue</p>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="py-3 px-4 border border-blue-100 rounded-lg text-base focus:outline-none focus:border-blue-600 transition mb-1 shadow-sm"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="py-3 px-4 border border-blue-100 rounded-lg text-base focus:outline-none focus:border-blue-600 transition mb-1 shadow-sm"
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <button
            type="submit"
            className="py-3 px-5 bg-gradient-to-r from-blue-600 to-blue-400 text-white border-none rounded-lg font-semibold text-lg cursor-pointer mt-2 shadow-md tracking-wide transition hover:from-blue-700 hover:to-blue-500"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
 </HomeLayout>
  );
};

export default Login;