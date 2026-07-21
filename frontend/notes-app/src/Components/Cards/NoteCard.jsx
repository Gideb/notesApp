import React from "react";
import { AiOutlinePushpin } from "react-icons/ai";
import { MdOutlineCreate } from "react-icons/md";
import { GoTrash } from "react-icons/go";

const NoteCard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
  onTapped,
}) => {
  return (
    <div onClick={onTapped} className="cursor-pointer">
      <div className="bg-white dark:bg-[#0c0 c0e] border border-amber-700 shadow-md p-4 space-y-3 dark:border-white rounded hover:shadow-xl dark:shadow-gray-600/20 hover:-translate-y-1 transition-all ease-in-out duration-500">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h6 className="text-sm font-medium text-black dark:text-white">
              {title}
            </h6>
            <span className="text-xs text-slate-500 dark:text-gray-400">
              {date}
            </span>
          </div>

          <AiOutlinePushpin
            className={`cursor-pointer transition-colors duration-300 ${
              isPinned
                ? "text-amber-500"
                : "text-slate-300 hover:text-amber-500"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onPinNote();
            }}
          />
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-xs my-5 mr-2">
          {content?.slice(0, 200)}
        </p>

        <div className="flex items-center justify-between mt-4">
          <div className="text-xs text-slate-400 dark:text-gray-400">
            {tags}
          </div>

          <div className="flex items-center gap-2">
            <MdOutlineCreate
              className="icon-btn hover:text-amber-700! sm:text-black text-amber-700 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            />
            <GoTrash
              className="icon-btn hover:text-amber-700! sm:text-black text-amber-700 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
