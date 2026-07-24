import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import TagInput from "../Input/TagInput";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";

const AddEditNotes = ({ noteData, type, onClose, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (type === "edit" && noteData) {
      setTitle(noteData.title || "");
      setContent(noteData.content || "");
      setTags(Array.isArray(noteData.tags) ? noteData.tags : []);
    } else {
      setTitle("");
      setContent("");
      setTags([]);
    }
    setError(null);
  }, [type, noteData]);

  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post(API_PATHS.ADD_NOTE, {
        title,
        content,
        tags,
      });

      const data = response.data;

      onSuccess?.(data.note);
      onClose();
    } catch (error) {
      setError(error.message || "Unable to add the note.");
    }
  };

  //edit note
  const editNote = async () => {
    if (!noteData || !noteData._id) {
      setError("Unable to update this note.");
      return;
    }

    try {
      const response = await axiosInstance.put(
        API_PATHS.EDIT_NOTE(noteData._id),
        {
          title,
          content,
          tags,
        }
      );
      const data = response.data;

      onSuccess?.(data.note);
      onClose();
    } catch (error) {
      setError(error.message || "Unable to update the note.");
    }
  };

  const handleAddNote = () => {
    if (!title) {
      setError("Enter the title");
      return;
    }

    if (!content) {
      setError("Enter the content");
      return;
    }

    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };

  return (
    <div className="p-1 relative ">
      <button
        className="w-7 h-7 rounded flex items-center justify-center hover:bg-[#4c042d] absolute -top-3 -right-3 text-slate-500 cursor-pointer group"
        onClick={onClose}
      >
        <MdClose className="text-md text-slate-400 group-hover:text-white group-dark:hover:text-gray-300 " />
      </button>

      <div className="flex flex-col gap-2">
        <label className="input-label">TITLE</label>

        <input
          type="text"
          className="text-slate-950 dark:text-slate-300 bg-slate-300/50 dark:bg-slate-800/70 outline-none text-xl p-2 rounded placeholder:text-sm "
          placeholder="Note Title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 mt-6">
        <label className="input-label">CONTENT</label>
        <textarea
          placeholder="Note Content"
          className="text-slate-950 dark:text-slate-300 bg-slate-300/50 dark:bg-slate-800/70 outline-none text-sm h-40 resize-none p-2 rounded"
          rows={10}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        />
      </div>

      <div className="mt-3">
        <label className="input-label">TAGS</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>
      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

      <button
        className="btn-primary px-4 py-2 font-medium mt-5 p-3 text-white rounded hover:bg-pink-800 focus:outline-none cursor-pointer"
        onClick={handleAddNote}
      >
        Save Note
      </button>
    </div>
  );
};

export default AddEditNotes;
