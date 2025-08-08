import React, { useEffect, useState } from "react";
import axiosInstance from "../helpers/axiosInstance";
import HomeLayout from "../layouts/HomeLayout";
import { useNavigate } from "react-router-dom";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar:{
    public_id: string;
    secure_url: string;
  }
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/api/v1/admin/users");
        setUsers(res.data.users);
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Handler for deleting a user
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axiosInstance.delete(`/api/v1/admin/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  // Handler for editing a user (navigate to edit page)
  const handleEdit = (id: string) => {
    navigate(`/admin/users/edit/${id}`);
  };

  return (
    <HomeLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-indigo-700">All Users</h1>
          <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={() => navigate('/admin/users/add')}>Add User</button>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
            <table className="w-full mb-4 text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-200 to-indigo-100 text-indigo-800">
                  <th className="px-6 py-3 rounded-tl-xl">Image</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3 rounded-tr-xl">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr
                    key={user._id}
                    className={
                      `transition-colors duration-200 ${idx % 2 === 0 ? 'bg-indigo-50' : 'bg-white'} hover:bg-indigo-100`
                    }
                  >
                    <td className="px-6 py-3 font-semibold text-indigo-900 w-[50px] h-[50px]"><img src={user?.avatar?.secure_url}/></td>
                    <td className="px-6 py-3 font-semibold text-indigo-900">{user.name}</td>
                    <td className="px-6 py-3 text-indigo-700">{user.email}</td>
                    <td className="px-6 py-3">
                      <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wide">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-3 flex gap-2">
                      <button className="px-4 py-1 rounded bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition" onClick={() => handleEdit(user._id)}>Edit</button>
                      <button className="px-4 py-1 rounded bg-red-500 text-white font-semibold shadow hover:bg-red-600 transition" onClick={() => handleDelete(user._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </HomeLayout>
  );
};

export default AdminUsers;
