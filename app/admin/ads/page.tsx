"use client";
import Photo from "@/components/admin/Photo";
import axiosPublic from "@/lib/axiosPublic";
import { IAds } from "@/types/ads.types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { toast, Toaster } from "sonner";

const IndexPage: React.FC = () => {
  const [ads, setAds] = useState<IAds[]>([]);
  const [editAd, setEditAd] = useState<IAds | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchAds = async () => {
      const response = await axiosPublic.get("/ads");
      setAds(response.data.data);
    };
    fetchAds();
  }, []);

  const handleEdit = (ad: IAds) => {
    setEditAd(ad);
    setIsModalOpen(true);
  };
  const [img, setImage] = useState(editAd?.content?.image);

  const handleUpdate = async () => {
    if (editAd) {
      let updatedAd: IAds = { ...editAd };

      if (img && editAd.type !== "code") {
        updatedAd = {
          ...editAd,
          content: {
            ...editAd.content,
            image: img,
          },
        };
      }

      try {
        const response = await axiosPublic.put(
          `/ads/admin/${editAd._id}`,
          updatedAd,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (response.status === 200) {
          toast.success("Updated");

          setAds((prevAds) =>
            prevAds.map((ad) => (ad._id === editAd._id ? updatedAd : ad))
          );
        }
      } catch (error) {
        console.log(error);
        toast.warning("Update failed");
      }

      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-8 mx-8 my-4">
      <div className="w-full max-w-7xl flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold mb-4"></h1>
        <Link
          href="/admin/ads/add"
          className="bg-main text-white py-2 px-4 rounded-lg shadow-md transition duration-300"
        >
          Add New Ads
        </Link>
      </div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Code Ads</h2>

      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads
            .filter((ad) => ad.type === "code")
            .map((ad) => (
              <div
                key={ad._id}
                className="p-6 border rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out relative"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1 items-center">
                    <h2 className="text-lg font-bold text-gray-800">
                      {ad.position.toUpperCase()}
                    </h2>
                    <span className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-200 rounded">
                      {ad.id.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(ad)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                  </div>
                </div>
                <div
                  className="text-sm text-gray-700"
                  dangerouslySetInnerHTML={{ __html: ad.content! }}
                />
              </div>
            ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-gray-800 my-4">Image Ads</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads
            .filter((ad) => ad.type === "images")
            .map((ad) => (
              <div
                key={ad._id}
                className="p-6 border rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out relative"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1 items-center">
                    <h2 className="text-lg font-bold text-gray-800">
                      {ad.position.toUpperCase()}
                    </h2>
                    <span className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-200 rounded">
                      {ad.id.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(ad)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                  </div>
                </div>
                <Link
                  href={ad.content.link!}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={ad.content.image!}
                    alt={`${ad.position} Ad`}
                    className="w-full h-48 object-cover rounded"
                    width={696}
                    height={464}
                  />
                </Link>
                <input
                  type="text"
                  className="w-full p-2 mb-4 border rounded bg-gray-100 cursor-not-allowed"
                  value={ad.content.link}
                  readOnly
                />
              </div>
            ))}
        </div>
      </div>

      {isModalOpen && editAd && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50">
          <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
            <div className="p-6">
              <h2 className="text-lg font-bold mb-4">Edit Ad</h2>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Position (Read-Only)
                </label>
                <input
                  type="text"
                  className="w-full p-2 mb-4 border rounded bg-gray-100 cursor-not-allowed"
                  value={editAd.id}
                  readOnly
                />
                {editAd.type === "code" && (
                  <>
                    <label className="block text-gray-700 font-bold mb-2">
                      HTML code
                    </label>
                    <textarea
                      className="w-full p-2 mb-4 border rounded"
                      rows={6}
                      value={
                        typeof editAd.content === "string" ? editAd.content : ""
                      }
                      onChange={(e) =>
                        setEditAd({
                          ...editAd,
                          content: e.target.value,
                        })
                      }
                    />
                  </>
                )}
              </div>
              {editAd.type === "images" && (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">
                      Image
                    </label>
                    <Photo
                      title=""
                      img={
                        typeof editAd.content === "object"
                          ? editAd.content.image
                          : ""
                      }
                      onChange={(img) =>
                        setEditAd({
                          ...editAd,
                          content: {
                            ...(typeof editAd.content === "object"
                              ? editAd.content
                              : { image: "", link: "" }),
                            image: img,
                          },
                        })
                      }
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">
                      Link URL
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 mb-4 border rounded"
                      value={
                        typeof editAd.content === "object"
                          ? editAd.content.link
                          : ""
                      }
                      onChange={(e) =>
                        setEditAd({
                          ...editAd,
                          content: {
                            ...(typeof editAd.content === "object"
                              ? editAd.content
                              : { image: "", link: "" }),
                            link: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </>
              )}

              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Ad Type
                </label>
                <select
                  value={editAd.type}
                  onChange={(e) =>
                    setEditAd({
                      ...editAd,
                      type: e.target.value,
                      content:
                        e.target.value === "code"
                          ? ""
                          : { image: "", link: "" },
                    })
                  }
                  className="w-full p-2 mb-4 border rounded"
                >
                  <option value="code">Code</option>
                  <option value="images">Images</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleUpdate}
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                >
                  Update
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Toaster richColors position="top-right" />
    </div>
  );
};

export default IndexPage;
