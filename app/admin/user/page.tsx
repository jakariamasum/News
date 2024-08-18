"use client";
import axiosPublic from "@/lib/axiosPublic";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { toast, Toaster } from "sonner";
interface IUser {
  _id: string;
  email: string;
  title: string;
  role: string;
  img: string;
}
const IndexPage: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleEdit = (user: IUser) => {
    setCurrentUser(user);
    setEditModalOpen(true);
  };

  const handleDelete = (user: IUser) => {
    setCurrentUser(user);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (currentUser) {
      console.log(currentUser);
      const response = await axiosPublic.delete(`/user/${currentUser._id}`);
      if (response.status === 200) {
        toast.success("User Deleted successfully!");
        setUsers((prevUsers) =>
          prevUsers.filter((u) => u._id !== currentUser._id)
        );
      } else {
        toast.warning("Something went wrong!");
      }
      setDeleteConfirmOpen(false);
      setCurrentUser(null);
    }
  };

  const handleEditSave = async () => {
    if (currentUser) {
      try {
        const response = await axiosPublic.put(
          `/user/${currentUser._id}`,
          currentUser
        );
        if (response.status === 200) {
          toast.success("User updated successfully!");
          setUsers((prevUsers) =>
            prevUsers.map((u) => (u._id === currentUser._id ? currentUser : u))
          );
        } else {
          toast.warning("Something went wrong!");
        }
      } catch (error) {
        toast.error("Failed to update user!");
      }
      setEditModalOpen(false);
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosPublic.get("/user");
        console.log(response.data.data);
        setUsers(response.data.data);
      } catch (err) {
        setError("Failed to fetch videos");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div className="overflow-x-auto mx-2 lg:mx-16 mt-3">
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
          {users.map((user: IUser) => (
            <tr key={user._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <Image
                  src={user.img}
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
              <td className="text-left px-6 py-4 whitespace-nowrap  text-sm font-medium">
                <button
                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                  onClick={() => handleEdit(user)}
                >
                  <FaEdit />
                </button>
                <button
                  className="text-red-600 hover:text-red-900"
                  onClick={() => handleDelete(user)}
                >
                  <FaTrashAlt />
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
            <p>Are you sure you want to delete this news item?</p>
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

      {/* Edit User Modal */}
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
                <input
                  type="text"
                  name="role"
                  value={currentUser?.role || ""}
                  onChange={(e) =>
                    setCurrentUser((prev) =>
                      prev ? { ...prev, role: e.target.value } : null
                    )
                  }
                  className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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

      <Toaster richColors position="top-right" />
    </div>
  );
};
export default IndexPage;
