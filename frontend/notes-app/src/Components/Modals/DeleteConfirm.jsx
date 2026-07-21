import React from "react";

const DeleteConfirm = ({ note, onCancel, onConfirm }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-3 dark:text-white">
        Delete Note
      </h2>

      <p className="text-slate-600 dark:text-slate-300">
        Are you sure you want to delete
        <span className="font-semibold"> "{note?.title}"</span>?
      </p>

      <p className="text-sm text-red-500 mt-2">This action cannot be undone.</p>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded bg-slate-200 dark:bg-slate-700"
        >
          Cancel
        </button>

        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirm;
