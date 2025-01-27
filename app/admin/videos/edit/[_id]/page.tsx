"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axiosPublic from "@/lib/axiosPublic";
import Content from "@/components/admin/Content";
import Tag from "@/components/admin/Tag";
import { Toaster, toast } from "sonner";
import Image from "next/image";
import Checkbox from "@/components/admin/Checkbox";
import { categoryFormat } from "@/app/utils/categoryFormate";
import { updateNewsItem } from "@/app/services/admin/NewsServices";

const EditVideo: React.FC = () => {
  const router = useRouter();
  const { _id } = useParams();
  const [title, setTitle] = useState("");

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [category, setCategory] = useState<{
    category: string;
    subCategory?: string;
  }>({ category: "" });
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [videoInput, setVideoInput] = useState("");

  const handleVideoInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    const id = extractYouTubeID(url);
    setVideoInput(id || url);
  };

  const extractYouTubeID = (url: string): string | null => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=|shorts\/)|youtu\.be\/|youtube-nocookie\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  useEffect(() => {
    if (_id) {
      const fetchVideoItem = async () => {
        try {
          const response = await axiosPublic.get(`/news/each-news/${_id}`);
          const data = response.data.data;
          setTitle(data.title);
          setDescription(data.content);
          setVideoInput(data.video);
          setTags(data.tags || []);
          setCategory({
            category: data?.category?.category._id,
            subCategory: data?.category?.subcategory,
          });
        } catch (error) {
          console.error("Failed to fetch video item:", error);
        }
      };
      const fetchCategories = async () => {
        const response = await axiosPublic.get(
          `/categories/category/types?type=video`
        );
        setCategories(response.data.data);
      };
      fetchCategories();
      const fetchSubCategories = async () => {
        const response = await axiosPublic.get(`/sub-categories/type=video`);
        setSubCategories(response.data.data);
      };
      fetchSubCategories();

      fetchVideoItem();
    }
  }, [_id]);
  const transformedCategoryData = categoryFormat(subCategories, categories);

  const handlePublish = async () => {
    const payload = {
      title,
      content: description,
      tags,
      video: videoInput,
      img: `https://i.ytimg.com/vi/${videoInput}/mqdefault.jpg`,
      category,
    };

    const success = await updateNewsItem(_id as string, payload, "video");
    if (success) {
      router.push("/admin/videos");
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
            <div className="mb-4">
              <p>YouTube Video</p>
              <input
                type="text"
                placeholder="Paste YouTube URL"
                value={videoInput}
                onChange={handleVideoInputChange}
                className="p-2 mt-2 w-full outline-none rounded-md"
              />
            </div>
            <Content value={description} onChange={setDescription} />
          </div>
          <div className="md:w-1/3">
            <Tag value={tags} onChange={setTags} />
            {videoInput && (
              <div className="mb-4">
                <p>Image Preview</p>
                <div className="bg-white p-2 rounded-md mt-2">
                  <Image
                    src={`https://i.ytimg.com/vi/${videoInput}/mqdefault.jpg`}
                    width={400}
                    height={400}
                    alt="YouTube Video Thumbnail"
                    className="w-full rounded-md"
                  />
                </div>
              </div>
            )}
            <Checkbox
              title="Category"
              items={transformedCategoryData}
              onChange={setCategory}
              initialValue={category}
            />
            <div className="mb-4">
              <button
                onClick={handlePublish}
                className="w-full py-2 px-4 bg-main text-white font-bold rounded-md"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>
      <Toaster richColors position="top-right" />
    </>
  );
};

export default EditVideo;
