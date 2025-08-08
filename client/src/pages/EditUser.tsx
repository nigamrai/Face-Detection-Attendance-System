import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../helpers/axiosInstance";
import HomeLayout from "../layouts/HomeLayout";

const EditUser: React.FC = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(`/api/v1/admin/users/${id}`);
        setName(res.data.user.name);
        setEmail(res.data.user.email);
        setAddress(res.data.user.address || "");
        setPreview(res.data.user.avatar?.secure_url || null);
      } catch (err) {
        setError("Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("address", address);
      if (avatar) formData.append("avatar", avatar);
      await axiosInstance.put(`/api/v1/admin/users/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("User updated successfully!");
      setTimeout(() => navigate("/admin/users"), 1200);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <HomeLayout>
      <div className="min-h-[700px] flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-gray-100 p-8">
        <div className="bg-white rounded-2xl shadow-2xl p-10 min-w-[340px] flex flex-col items-center gap-5 relative w-[420px]">
          <h1 className="text-2xl font-bold text-blue-600 mb-2 tracking-wide">Edit User</h1>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col items-center gap-2">
                <label htmlFor="avatar" className="font-semibold text-indigo-700">Profile Image</label>
                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <label htmlFor="avatar" className="cursor-pointer bg-indigo-100 hover:bg-indigo-200 px-4 py-2 rounded-lg text-indigo-700 font-medium transition mb-2">
                  {preview ? "Change Image" : "Choose Image"}
                </label>
                {preview && <img src={preview} alt="Preview" className="w-20 h-20 rounded-full object-cover border-2 border-indigo-300" />}
              </div>
              <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required className="py-3 px-4 border border-blue-100 rounded-lg text-base focus:outline-none focus:border-blue-600 transition mb-1 shadow-sm" />
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="py-3 px-4 border border-blue-100 rounded-lg text-base focus:outline-none focus:border-blue-600 transition mb-1 shadow-sm" />
              <input type="text" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} className="py-3 px-4 border border-blue-100 rounded-lg text-base focus:outline-none focus:border-blue-600 transition mb-1 shadow-sm" />
              {error && <div className="text-red-500 text-sm">{error}</div>}
              {success && <div className="text-green-600 text-sm">{success}</div>}
              <button type="submit" className="py-3 px-5 bg-gradient-to-r from-blue-600 to-blue-400 text-white border-none rounded-lg font-semibold text-lg cursor-pointer mt-2 shadow-md tracking-wide transition hover:from-blue-700 hover:to-blue-500" disabled={loading}>
                {loading ? "Updating..." : "Update User"}
              </button>
            </form>
          )}
        </div>
      </div>
    </HomeLayout>
  );
};

export default EditUser;
