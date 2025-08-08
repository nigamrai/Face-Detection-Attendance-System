import React from "react";
import HomeLayout from "../layouts/HomeLayout";
import { Link } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  return (
    <HomeLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6 text-indigo-700">Admin Dashboard</h1>
        <div className="flex flex-col gap-6">
          <Link to="/admin/users" className="bg-indigo-600 text-white px-6 py-4 rounded text-xl text-center hover:bg-indigo-700">Manage Users</Link>
          <Link to="/admin/attendances" className="bg-indigo-600 text-white px-6 py-4 rounded text-xl text-center hover:bg-indigo-700">Manage Attendances</Link>
        </div>
      </div>
    </HomeLayout>
  );
};

export default AdminDashboard;
