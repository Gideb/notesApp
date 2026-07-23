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
      <div className="bg-[#1C2541]  dark:bg-[#1E293B] border border-neutral-600 shadow-md p-4 space-y-3 dark:border-dark rounded hover:shadow-xl dark:shadow-gray-600/20 hover:-translate-y-1 transition-all ease-in-out duration-500">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h6 className="text-sm font-medium text-sky-400">{title}</h6>
            <span className="text-xs text-slate-500 dark:text-gray-400">
              {date}
            </span>
          </div>

          <AiOutlinePushpin
            className={`cursor-pointer transition-colors duration-300 ${
              isPinned ? "text-sky-500" : "text-slate-300 hover:text-sky-500"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onPinNote();
            }}
          />
        </div>

        <p className="text-dark/90 text-xs my-5 mr-2">
          {content?.slice(0, 150)}
        </p>

        <div className="flex items-center justify-between mt-4">
          <div className="text-xs text-slate-400 ">{tags}</div>

          <div className="flex items-center gap-2">
            <MdOutlineCreate
              className="text-lg hover:text-sky-400 sm:text-dark/50 text-dark/50 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            />
            <GoTrash
              className="text-lg hover:text-sky-400 sm:text-dark/50 text-dark/50 cursor-pointer"
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
