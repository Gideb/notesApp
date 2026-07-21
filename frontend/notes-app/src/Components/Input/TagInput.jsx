import React, { useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";

const TagInput = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const addNewtag = () => {
    if (inputValue.trim() !== "") {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addNewtag();
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div>
      {tags?.length > 0 && (
        <div className=" flex items-center gap-2 flex-wrap mt-2">
          {tags?.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-300/50 text-black dark:bg-gray-700 dark:text-white text-xs p-2 rounded flex items-center gap-2 "
            >
              #{tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 text-white/70 group"
              >
                <MdClose
                  size={16}
                  className="group-hover:text-slate-800 group-hover:dark:text-white text-gray-500 dark:text-slate-400 cursor-pointer"
                />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 my-3">
        <input
          type="text"
          value={inputValue}
          className="text-slate-950 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/70 outline-none text-sm p-2 rounded border"
          placeholder="Add a tag"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />

        <button
          className=" hover:bg-primary dark:text-white p-2 rounded focus:outline-none cursor-pointer group border hover:border-none"
          onClick={addNewtag}
        >
          <MdAdd size={20} className="group-hover:text-white " />
        </button>
      </div>
    </div>
  );
};

export default TagInput;
