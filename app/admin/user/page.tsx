"use client";
import {
  handleChangeUserPassword,
  handleChangeUserStatus,
  handleUserDelete,
  handleUserEdit,
} from "@/app/services/admin/UserServices";
import Loader from "@/components/Loader";
import axiosPublic from "@/lib/axiosPublic";
import { IAuthor } from "@/types/author.types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiBlock, BiCheck } from "react-icons/bi";
import { FaEdit, FaTrashAlt, FaKey } from "react-icons/fa";
import { Toaster } from "sonner";

const IndexPage: React.FC = () => {
  const [users, setUsers] = useState<IAuthor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<IAuthor | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [passwordChangeModalOpen, setPasswordChangeModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleEdit = (user: IAuthor) => {
    setCurrentUser(user);
    setEditModalOpen(true);
  };

  const handleDelete = (user: IAuthor) => {
    setCurrentUser(user);
    setDeleteConfirmOpen(true);
  };

  const handlePasswordChange = (user: IAuthor) => {
    setCurrentUser(user);
    setPasswordChangeModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (currentUser) {
      const success = await handleUserDelete(currentUser._id);
      if (success) {
        setUsers((prevUsers) =>
          prevUsers.filter((u) => u._id !== currentUser._id)
        );
      }
      setDeleteConfirmOpen(false);
      setCurrentUser(null);
    }
  };

  const handleEditSave = async () => {
    if (currentUser) {
      const success = await handleUserEdit(currentUser);
      if (success) {
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u._id === currentUser._id ? currentUser : u))
        );
      }
      setEditModalOpen(false);
      setCurrentUser(null);
    }
  };

  const handlePasswordChangeSave = async () => {
    if (currentUser && newPassword === confirmPassword) {
      await handleChangeUserPassword(currentUser._id, newPassword);

      setPasswordChangeModalOpen(false);
      setNewPassword("");
      setConfirmPassword("");
      setCurrentUser(null);
    }
  };
  const handleChangeStatus = async (id: string, isActive: boolean) => {
    const success = await handleChangeUserStatus(id, isActive);
    if (success) {
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u._id === id ? { ...u, isActive } : u))
      );
    }
    setEditModalOpen(false);
    setCurrentUser(null);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosPublic.get("/user/admin", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setUsers(response.data.data);
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="overflow-x-auto mx-2 lg:mx-16 mt-3">
      <div className="text-right my-4">
        <Link
          href="/admin/user/add"
          className="bg-main text-white py-2 px-4 rounded-lg shadow-md transition duration-300"
        >
          Add New User
        </Link>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Image
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user: IAuthor) => (
            <tr
              key={user._id}
              className={`${user.isActive ? "" : "bg-red-50"}`}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <Image
                  src={user.img as string}
                  alt={user.title}
                  className="w-12 h-12 object-cover rounded-full"
                  width={400}
                  height={400}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.title}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.role}
              </td>
              <td className="text-left px-6 py-4 whitespace-nowrap text-sm font-medium">
                {user.isActive ? (
                  <button
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                    onClick={() => handleChangeStatus(user._id, false)}
                  >
                    <BiBlock size={18} />
                  </button>
                ) : (
                  <button
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                    onClick={() => handleChangeStatus(user._id, true)}
                  >
                    <BiCheck size={18} />
                  </button>
                )}
                <button
                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                  onClick={() => handleEdit(user)}
                >
                  <FaEdit size={18} />
                </button>
                <button
                  className="text-red-600 hover:text-red-900 mr-3"
                  onClick={() => handleDelete(user)}
                >
                  <FaTrashAlt size={18} />
                </button>
                <button
                  className="text-yellow-600 hover:text-yellow-900"
                  onClick={() => handlePasswordChange(user)}
                >
                  <FaKey size={15} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {deleteConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this user?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setDeleteConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {editModalOpen && currentUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Edit User
            </h2>
            <form className="space-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={currentUser?.title || ""}
                  onChange={(e) =>
                    setCurrentUser((prev) =>
                      prev ? { ...prev, title: e.target.value } : null
                    )
                  }
                  className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={currentUser?.email || ""}
                  onChange={(e) =>
                    setCurrentUser((prev) =>
                      prev ? { ...prev, email: e.target.value } : null
                    )
                  }
                  className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  name="role"
                  value={currentUser?.role || ""}
                  onChange={(e) =>
                    setCurrentUser((prev) =>
                      prev ? { ...prev, role: e.target.value } : null
                    )
                  }
                  className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="reporter">Reporter</option>
                </select>
              </div>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  name="preApproved"
                  checked={currentUser?.preApproved || false}
                  onChange={(e) =>
                    setCurrentUser((prev) =>
                      prev ? { ...prev, preApproved: e.target.checked } : null
                    )
                  }
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm font-medium text-gray-700">
                  Pre-approved
                </label>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  onClick={() => setEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={handleEditSave}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {passwordChangeModalOpen && currentUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 text-center">
              Change Password
            </h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
                  placeholder="Enter your new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
                  placeholder="Confirm your new password"
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  className="px-5 py-2 text-sm font-medium bg-gray-200 text-gray-800 rounded-lg shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-150 ease-in-out"
                  onClick={() => {
                    setPasswordChangeModalOpen(false);
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-5 py-2 text-sm font-medium bg-main text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-main transition duration-150 ease-in-out"
                  onClick={handlePasswordChangeSave}
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toaster richColors position="top-right" />
    </div>
  );
};

export default IndexPage;
