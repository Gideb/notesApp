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
}) => {
  return (
    <div className="bg-white dark:bg-[#0c0c0e] shadow-md p-4 border dark:border-white rounded hover:shadow-xl dark:shadow-gray-600/20 hover:-translate-y-1 transition-all ease-in-out duration-500">
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
          className={`icon-btn ${isPinned ? "text-primary" : "text-slate-300"}`}
          onClick={onPinNote}
        />
      </div>

      <p className="text-gray-600 dark:text-gray-300 text-xs mt-2">
        {content?.slice(0, 60)}
      </p>

      <div className="flex items-center justify-between mt-4">
        <div className="text-xs text-slate-500 dark:text-gray-400">{tags}</div>

        <div className="flex items-center gap-2">
          <MdOutlineCreate
            className="icon-btn hover:text-green-500! sm:text-black text-green-500 cursor-pointer"
            onClick={onEdit}
          />
          <GoTrash
            className="icon-btn hover:text-red-500! sm:text-black text-red-500 cursor-pointer"
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
