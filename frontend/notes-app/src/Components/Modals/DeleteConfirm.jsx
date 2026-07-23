import { BsFillTrash3Fill } from "react-icons/bs";

const DeleteConfirm = ({ note, onCancel, onConfirm }) => {
  return (
    <div className="p-4">
      <div className="flex gap-1 items-center mb-4">
        <h2 className="text-xl font-semibold mb-3 dark:text-sky-400 text-sky-700">
          Delete Note
        </h2>
        <BsFillTrash3Fill className="text-sky-700 dark:text-sky-500 text-lg mb-3" />
      </div>
      <div className="border-t border-slate-400 dark:border-slate-600 -mt-4 mb-5" />

      <p className="text-slate-600 dark:text-slate-300">
        Are you sure you want to delete
        <span className="font-semibold"> "{note?.title}"</span>?
      </p>

      <p className="text-sm text-red-500 mt-2">This action cannot be undone.</p>

      
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600 cursor-pointer"
        >
          Cancel
        </button>

        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer "
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirm;
