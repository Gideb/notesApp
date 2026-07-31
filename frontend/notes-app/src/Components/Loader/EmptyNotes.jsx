import React from "react";
import nonotes from "../../assets/images/none.png";
/* import { GoPlus } from "react-icons/go"; */

const EmptyNotes = ({ onAddNote }) => {
  return (
    <div className="flex flex-col items-center justify-center mt-10 text-center px-4">
      <img
        src={nonotes}
        alt="No notes"
        className="w-100 h-100 object-cover mb-6 dark:bg-sky-100 p-4"
      />

      <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-white">
        Create your first note ✨
      </h2>

      <p className="mt-6 max-w-md text-sm sm:text-base text-slate-500 dark:text-slate-400">
        You don't have any notes yet.
        {""}
        <p>Start writing your ideas, tasks, and reminders.</p>
      </p>

      {/* <button
        onClick={onAddNote}
        className="mt-6 flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-white hover:opacity-90 transition"
      >
        <GoPlus size={18} />
        Add New Note
      </button> */}
    </div>
  );
};

export default EmptyNotes;
