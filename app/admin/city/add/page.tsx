"use client";
import axiosPublic from "@/lib/axiosPublic";
import { useState } from "react";
import { toast, Toaster } from "sonner";

const IndexPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const handlePublish = async () => {
    console.log(title);
    try {
      const response = await axiosPublic.post("/city", { title });

      if (response.status === 200) {
        toast.success("City created successfully!");
        setTitle("");
      }
    } catch (error) {
      toast.error("Failed to create city. Please try again.");
    }
  };
  return (
    <>
      <div className="container my-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-2/3">
            <div className="mb-4">
              <p>Title</p>
              <input
                type="text"
                placeholder="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="p-2 mt-2 w-full outline-none rounded-md"
              />
            </div>
          </div>
          <div className="w-full md:w-1/3">
            <div className="border-2 border-main border-dashed rounded-md p-2 my-8">
              <button
                type="submit"
                onClick={handlePublish}
                className="bg-main flex items-center justify-center w-full text-white px-4 py-2 rounded-md"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-right" richColors closeButton />
    </>
  );
};
export default IndexPage;
