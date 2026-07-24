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
  const previewText =
    content?.length > 150 ? `${content.slice(0, 150)}...` : content;

  return (
    <div onClick={onTapped} className="h-full cursor-pointer">
      <div className="flex h-full min-h-50 flex-col justify-between rounded border border-sky-400 bg-[#1C2541] p-4 shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl dark:border-dark dark:bg-[#1E293B] dark:shadow-gray-600/20">
        <div>
          <div className="mb-3 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h6 className="text-sm font-medium text-sky-400">{title}</h6>
              <span className="text-xs text-slate-500 dark:text-gray-400">
                {date}
              </span>
            </div>

            <AiOutlinePushpin
              className={`text-2xl cursor-pointer rounded-full p-1 transition-all duration-300 ${
                isPinned
                  ? "bg-sky-500/15 text-sky-400"
                  : "text-slate-300 hover:bg-sky-500/10 hover:text-sky-400"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onPinNote();
              }}
            />
          </div>

          <p
            className="mr-2 text-xs leading-5 text-dark/90"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 5,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {previewText}
          </p>
        </div>

        <div className="mt-4 flex items-end justify-between gap-2">
          <div className="text-xs text-slate-400">{tags}</div>

          <div className="flex items-center gap-2">
            <MdOutlineCreate
              className="cursor-pointer rounded-full p-1 text-2xl text-dark/50 transition hover:bg-slate-700/40 hover:text-sky-400 sm:text-dark/50"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            />
            <GoTrash
              className="cursor-pointer rounded-full p-1 text-2xl text-dark/50 transition hover:bg-rose-500/15 hover:text-rose-400 sm:text-dark/50"
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
