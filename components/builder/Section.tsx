// Section.tsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import Photo from "../admin/Photo";
import { ICategory } from "@/types/category.types";
import { IOption, ISectionData } from "@/types/page.types";
import { MultiValue } from "react-select";
import { MultiSelect } from "../MultiSelect";
const boxStyles = Array.from({ length: 18 }, (_, i) => ({
  id: (i + 1).toString(),
  name: `Box ${i + 1}`,
}));

const gridStyles = Array.from({ length: 12 }, (_, i) => ({
  id: (i + 1).toString(),
  name: `Grid ${i + 1}`,
}));
type SectionProps = {
  section: string;
  categories: ICategory[];
  stories: ICategory[];
  videos: ICategory[];
  setSectionInfo: (data: Partial<ISectionData>) => void;
  index: number;
  moveSection: (dragIndex: number, hoverIndex: number) => void;
  deleteSection: (index: number) => void;
  moveSectionUp: () => void;
  moveSectionDown: () => void;
  defaultData?: Partial<ISectionData>;
};

const Section: React.FC<SectionProps> = ({
  section,
  index,
  moveSection,
  deleteSection,
  moveSectionUp,
  moveSectionDown,
  setSectionInfo,
  categories,
  stories,
  videos,
  defaultData = {},
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>("#ffffff");
  const [color, setColor] = useState<string>("#000000");

  const [, drop] = useDrop({
    accept: "SECTION",
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveSection(item.index, index);
        item.index = index;
      }
    },
  });

  const [, drag, preview] = useDrag({
    type: "SECTION",
    item: { index },
  });

  drag(dragRef);
  drop(preview(ref));

  const [showPopup, setShowPopup] = useState(false);

  const handleBackgroundColorChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBackgroundColor(e.target.value);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  const selectOptions: IOption[] = categories.map((cat) => ({
    value: cat._id,
    label: cat.title,
  }));
  const selectStoryOptions: IOption[] = stories.map((story) => ({
    value: story._id,
    label: story.title,
  }));
  const selectVideoOptions: IOption[] = videos.map((video) => ({
    value: video._id,
    label: video.title,
  }));
  const [sectionInfo, setSectionInfoState] = useState<ISectionData>({
    sectionTitle: defaultData.sectionTitle || "",
    color: defaultData.color || "#000000",
    backgroundColor: defaultData.backgroundColor || "#ffffff",
    desktopGrid: defaultData.desktopGrid || "",
    mobileGrid: defaultData.mobileGrid || "",
    sectionLimit: defaultData.sectionLimit || "",
    imgPosition: defaultData.imgPosition || "",
    width: defaultData.width || "",
    box: defaultData.box || "",
    type: defaultData.type || `${section}`,
    categories: defaultData.categories || [],
  });

  useEffect(() => {
    if (defaultData) {
      setSectionInfoState((prev) => ({
        ...prev,
        ...defaultData,
      }));
    }
  }, [defaultData]);

  const handleSelectionChange = (selected: MultiValue<IOption>) => {
    const selectedCategories = selected.map((cat) => ({
      value: cat.value,
      label: cat.label,
    }));
    setSectionInfoState((prev) => ({
      ...prev,
      categories: selectedCategories,
    }));
    setSectionInfo({ ...sectionInfo, categories: selectedCategories });
  };

  const handleInputChange = (field: keyof ISectionData, value: string) => {
    setSectionInfoState((prev) => ({ ...prev, [field]: value }));
    setSectionInfo({ ...sectionInfo, [field]: value });
  };
  console.log(defaultData);
  return (
    <div
      ref={ref}
      style={{ backgroundColor, color }}
      className="flex items-center text-xs justify-between w-full p-2"
    >
      <div className="flex items-center w-full space-x-3">
        <div ref={dragRef} className="cursor-move hidden md:block">
          <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 24 24"
            height="20"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M11 11V5.82843L9.17157 7.65685L7.75736 6.24264L12 2L16.2426 6.24264L14.8284 7.65685L13 5.82843V11H18.1716L16.3431 9.17157L17.7574 7.75736L22 12L17.7574 16.2426L16.3431 14.8284L18.1716 13H13V18.1716L14.8284 16.3431L16.2426 17.7574L12 22L7.75736 17.7574L9.17157 16.3431L11 18.1716V13H5.82843L7.65685 14.8284L6.24264 16.2426L2 12L6.24264 7.75736L7.65685 9.17157L5.82843 11H11Z"></path>
          </svg>
        </div>

        {defaultData.type === "category" && (
          <div className="">
            <div className="">
              <MultiSelect
                options={selectOptions}
                onChange={handleSelectionChange}
                value={defaultData?.categories}
                placeholder="Select categories"
              />
            </div>
          </div>
        )}
        {defaultData.type === "story" && (
          <div className="">
            <div className="">
              <MultiSelect
                options={selectStoryOptions}
                onChange={handleSelectionChange}
                value={defaultData?.categories}
                placeholder="Select Stories"
              />
            </div>
          </div>
        )}
        {defaultData.type === "video" && (
          <div className="">
            <div className="">
              <MultiSelect
                options={selectVideoOptions}
                onChange={handleSelectionChange}
                value={defaultData?.categories}
                placeholder="Select Videos"
              />
            </div>
          </div>
        )}
        {section === "category" && (
          <div className="">
            <div className="">
              <MultiSelect
                options={selectOptions}
                onChange={handleSelectionChange}
                value={defaultData?.categories}
                placeholder="Select categories"
              />
            </div>
          </div>
        )}
        {section === "story" && (
          <div className="">
            <div className="">
              <MultiSelect
                options={selectStoryOptions}
                onChange={handleSelectionChange}
                value={defaultData?.categories}
                placeholder="Select Stories"
              />
            </div>
          </div>
        )}
        {section === "video" && (
          <div className="">
            <div className="">
              <MultiSelect
                options={selectVideoOptions}
                onChange={handleSelectionChange}
                value={defaultData?.categories}
                placeholder="Select Videos"
              />
            </div>
          </div>
        )}

        <div className="flex md:flex-row flex-col items-center md:space-x-2">
          <button onClick={moveSectionUp}>
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 512 512"
              height="20"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M256 217.9L383 345c9.4 9.4 24.6 9.4 33.9 0 9.4-9.4 9.3-24.6 0-34L273 167c-9.1-9.1-23.7-9.3-33.1-.7L95 310.9c-4.7 4.7-7 10.9-7 17s2.3 12.3 7 17c9.4 9.4 24.6 9.4 33.9 0l127.1-127z"></path>
            </svg>
          </button>
          <button onClick={moveSectionDown}>
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 512 512"
              height="20"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M256 294.1L383 167c9.4-9.4 24.6-9.4 33.9 0s9.3 24.6 0 34L273 345c-9.1 9.1-23.7 9.3-33.1.7L95 201.1c-4.7-4.7-7-10.9-7-17s2.3-12.3 7-17c9.4-9.4 24.6-9.4 33.9 0l127.1 127z"></path>
            </svg>
          </button>
          <svg
            className="cursor-pointer"
            onClick={() => setShowPopup(true)}
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 24 24"
            height="20"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="Settings">
              <g>
                <path d="M12.6,20.936H11.3a.883.883,0,0,1-.852-.654l-.774-2.833-2.5,1.435a.886.886,0,0,1-1.06-.138l-.925-.919a.884.884,0,0,1-.143-1.066l1.469-2.545L6.509,14.2l-2.787-.747a.882.882,0,0,1-.654-.851V11.3a.882.882,0,0,1,.652-.85l2.839-.777L5.12,7.171a.885.885,0,0,1,.141-1.062l.918-.918A.885.885,0,0,1,7.24,5.049L9.792,6.514l.012,0,.745-2.79a.881.881,0,0,1,.851-.655h1.3a.883.883,0,0,1,.852.655l.762,2.838,2.509-1.441a.885.885,0,0,1,1.059.138l.926.919a.882.882,0,0,1,.141,1.067L17.483,9.777l.008.022,2.786.746a.883.883,0,0,1,.653.851v1.3a.883.883,0,0,1-.654.852l-2.837.774,1.439,2.505a.881.881,0,0,1-.141,1.063l-.917.917a.888.888,0,0,1-1.063.141l-2.539-1.462L14.2,17.5l-.745,2.785A.885.885,0,0,1,12.6,20.936Zm-1.21-1h1.119l.738-2.756a.888.888,0,0,1,.528-.592l.134-.052a.873.873,0,0,1,.76.057l2.51,1.445.789-.789-1.423-2.478a.881.881,0,0,1-.048-.78l.052-.125a.875.875,0,0,1,.584-.51l2.8-.749v-1.12l-2.755-.737a.885.885,0,0,1-.592-.529l-.052-.132a.882.882,0,0,1,.057-.763L18.04,6.818l-.8-.79-2.48,1.425a.878.878,0,0,1-.772.052l-.115-.047a.888.888,0,0,1-.518-.588l-.748-2.806H11.492l-.738,2.762a.883.883,0,0,1-.539.6l-.12.045a.874.874,0,0,1-.751-.058L6.822,5.962l-.789.789L7.455,9.227a.886.886,0,0,1,.046.785l-.051.12a.876.876,0,0,1-.579.5l-2.8.758v1.121l2.757.738a.889.889,0,0,1,.591.525l.048.121a.874.874,0,0,1-.055.77L5.958,17.181l.8.791,2.47-1.419a.878.878,0,0,1,.787-.045l.106.044a.874.874,0,0,1,.526.591ZM9.75,17.482l.008,0ZM9.6,17.421l.007,0ZM6.487,14.147h0Zm.044-4.411h0Zm7.724-3.2Z"></path>
                <path d="M12,15a3,3,0,1,1,3-3A3,3,0,0,1,12,15Zm0-5a2,2,0,1,0,2,2A2,2,0,0,0,12,10Z"></path>
              </g>
            </g>
          </svg>

          {showPopup && (
            <div className="fixed right-0 top-0 bottom-0 bg-white w-full md:w-96 z-[1000]">
              <div className="flex items-center justify-between p-2 bg-main/10">
                <h1 className="leading-none font-bold text-black">Builder</h1>
                <svg
                  className="cursor-pointer text-red-500"
                  onClick={() => setShowPopup(false)}
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 512 512"
                  height="20"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="32"
                    d="M368 368 144 144m224 0L144 368"
                  ></path>
                </svg>
              </div>
              <div className="bg-white text-black p-4 block divide-y h-auto overflow-y-auto">
                <div className="flex items-center justify-between py-1.5">
                  <p>Title BG Color</p>
                  <input
                    type="color"
                    className="h-6 border max-w-sm text-xs leading-none outline-none rounded-md"
                    defaultValue={backgroundColor}
                    onChange={handleBackgroundColorChange}
                    placeholder="Enter background color"
                  />
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <p>Title Text Color</p>
                  <input
                    type="color"
                    className="h-6 border max-w-sm text-xs leading-none outline-none rounded-m"
                    value={color}
                    onChange={handleColorChange}
                    placeholder="Enter text color"
                  />
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <p>Category BG Color</p>
                  <input
                    type="color"
                    className="h-6 border max-w-sm text-xs leading-none outline-none rounded-md"
                    value={backgroundColor}
                    onChange={(e) =>
                      handleInputChange("backgroundColor", e.target.value)
                    }
                    placeholder="Enter background color"
                  />
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <p>Category Text Color</p>
                  <input
                    type="color"
                    className="h-6 border max-w-sm text-xs leading-none outline-none rounded-m"
                    value={color}
                    onChange={(e) => handleInputChange("color", e.target.value)}
                    placeholder="Enter text color"
                  />
                </div>

                <div className="mb-6 w-full my-2">
                  <div className="relative">
                    <select
                      value={sectionInfo.desktopGrid}
                      onChange={(e) =>
                        handleInputChange("desktopGrid", e.target.value)
                      }
                      className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                    >
                      <option value="" className="text-gray-400">
                        Select Desktop Grids
                      </option>
                      {gridStyles?.map((grid) => (
                        <option
                          key={grid?.id}
                          value={grid?.id}
                          className="text-gray-700"
                        >
                          {grid?.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="mb-6 w-full my-2">
                  <div className="relative">
                    <select
                      value={sectionInfo.mobileGrid}
                      onChange={(e) =>
                        handleInputChange("mobileGrid", e.target.value)
                      }
                      className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                    >
                      <option value="" className="text-gray-400">
                        Select Mobile Grids
                      </option>
                      {gridStyles?.map((grid) => (
                        <option
                          key={grid?.id}
                          value={grid?.id}
                          className="text-gray-700"
                        >
                          {grid?.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="mb-6 w-full my-2">
                  <div className="relative">
                    <select
                      value={sectionInfo.box}
                      onChange={(e) => handleInputChange("box", e.target.value)}
                      className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                    >
                      <option value="" className="text-gray-400">
                        Select Box Style
                      </option>
                      {boxStyles?.map((box) => (
                        <option
                          key={box?.id}
                          value={box?.id}
                          className="text-gray-700"
                        >
                          {box?.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 py-1">
                  <p className="text-sm font-medium text-gray-700">
                    Section Name
                  </p>
                  <input
                    type="text"
                    className="w-96 px-2 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                    placeholder="Enter name"
                    value={sectionInfo.sectionTitle}
                    onChange={(e) =>
                      handleInputChange("sectionTitle", e.target.value)
                    }
                  />
                </div>
                <div className="flex items-center gap-2 py-1">
                  <p className="text-sm font-medium text-gray-700">
                    Category Limit
                  </p>
                  <input
                    type="number"
                    className="w-32 px-2 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                    placeholder="Enter number"
                    value={sectionInfo.sectionLimit}
                    onChange={(e) =>
                      handleInputChange("sectionLimit", e.target.value)
                    }
                  />
                </div>
                <div className="flex items-center gap-2 py-1">
                  <p className="text-sm font-medium text-gray-700">
                    Category Width
                  </p>
                  <input
                    type="number"
                    className="w-32 px-2 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                    placeholder="Enter number"
                    value={sectionInfo.width}
                    onChange={(e) => handleInputChange("width", e.target.value)}
                  />
                </div>
                <div className="mb-6 w-full my-1">
                  <div className="relative">
                    <select
                      value={sectionInfo.imgPosition}
                      onChange={(e) =>
                        handleInputChange("imgPosition", e.target.value)
                      }
                      className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                    >
                      <option value="" className="text-gray-400">
                        Photo Position{" "}
                      </option>
                      <option value="1">Left</option>
                      <option value="2">Right</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <svg
            className="cursor-pointer"
            onClick={() => deleteSection(index)}
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 1024 1024"
            height="20"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Section;
