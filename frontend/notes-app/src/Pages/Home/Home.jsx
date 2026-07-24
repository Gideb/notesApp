import { useEffect, useMemo, useState } from "react";
import NoteCard from "../../Components/Cards/NoteCard";
import { AiOutlinePushpin } from "react-icons/ai";
import { GoTrash } from "react-icons/go";
import { MdAdd, MdClose, MdOutlineCreate } from "react-icons/md";
import AddEditNotes from "../../Components/Home/AddEditNotes";
import Modal from "react-modal";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_PATHS } from "../../utils/apiPaths";
import DeleteConfirm from "../../Components/Modals/DeleteConfirm";
import axiosInstance from "../../utils/axiosInstance";

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  });
  const [deleteModal, setDeleteModal] = useState({
    isShown: false,
    note: null,
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = (searchParams.get("q") || "").trim().toLowerCase();

  const sortNotes = (notesList) => {
    return [...notesList].sort((firstNote, secondNote) => {
      if (Number(secondNote.isPinned) !== Number(firstNote.isPinned)) {
        return Number(secondNote.isPinned) - Number(firstNote.isPinned);
      }

      const firstTime = new Date(
        firstNote.createdOn || firstNote.updatedOn || 0
      ).getTime();
      const secondTime = new Date(
        secondNote.createdOn || secondNote.updatedOn || 0
      ).getTime();

      return secondTime - firstTime;
    });
  };

  //show notes on homescreen
  const getNotes = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.GET_ALL_NOTES);
      const data = response.data;
      setNotes(sortNotes(data.notes || []));
    } catch (error) {
      if (
        error.message.toLowerCase().includes("token") ||
        !localStorage.getItem("accessToken")
      ) {
        localStorage.removeItem("accessToken");
        navigate("/login");
        return;
      }
      setError(error.message || "Unable to load notes.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(getNotes);
  }, []);

  const filteredNotes = useMemo(() => {
    if (!searchQuery) return notes;

    return notes.filter((note) => {
      const searchableText = [note.title, note.content, ...(note.tags || [])]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(searchQuery);
    });
  }, [notes, searchQuery]);

  const onCloseAddNote = () => {
    setOpenAddEditModal({
      isShown: false,
      type: "add",
      data: null,
    });
  };

  const closeViewModal = () => {
    setOpenViewModal({
      isShown: false,
      data: null,
    });
  };

  const openEditModal = (note) => {
    setOpenAddEditModal({
      isShown: true,
      type: "edit",
      data: note,
    });
    closeViewModal();
  };

  const openDeleteModal = (note) => {
    closeViewModal();
    setDeleteModal({
      isShown: true,
      note,
    });
  };

  //note delete button
  const handleDeleteNote = async (noteId) => {
    try {
      await axiosInstance.delete(API_PATHS.DELETE_NOTE(noteId));
      setNotes((currentNotes) =>
        currentNotes.filter((note) => note._id !== noteId)
      );
    } catch (error) {
      setError(error.message || "Unable to delete the note.");
    }
  };

  //note pin button
  const handlePinNote = async (note) => {
    try {
      const response = await axiosInstance.put(
        API_PATHS.UPDATE_PINNED_NOTE(note._id),
        {
          isPinned: !note.isPinned,
        }
      );

      const data = response.data;
      setNotes((currentNotes) =>
        sortNotes(
          currentNotes.map((currentNote) =>
            currentNote._id === note._id ? data.note : currentNote
          )
        )
      );
      if (openViewModal.data?._id === note._id) {
        setOpenViewModal((currentModal) => ({
          ...currentModal,
          data: data.note,
        }));
      }
    } catch (error) {
      setError(error.message || "Unable to update the note.");
    }
  };

  return (
    <>
      <div className="container mx-auto p-3 sm:px-4 sm:py-6 lg:px-6">
        {error && <p className="mt-8 text-sm text-red-500">{error}</p>}

        {isLoading ? (
          <p className="mt-8 text-sm text-slate-500">Loading notes...</p>
        ) : filteredNotes.length === 0 ? (
          <p className="mt-8 text-sm text-slate-500">
            {searchQuery
              ? "No notes match your search."
              : "No notes yet. Create your first one."}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 mt-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note._id}
                title={note.title}
                date={new Date(note.createdOn).toLocaleDateString()}
                content={note.content}
                tags={note.tags.map((tag) => `#${tag}`).join(" ")}
                isPinned={note.isPinned}
                onTapped={() =>
                  setOpenViewModal({
                    isShown: true,
                    data: note,
                  })
                }
                onEdit={() =>
                  setOpenAddEditModal({
                    isShown: true,
                    type: "edit",
                    data: note,
                  })
                }
                onDelete={() =>
                  setDeleteModal({
                    isShown: true,
                    note,
                  })
                }
                onPinNote={() => handlePinNote(note)}
              />
            ))}
          </div>
        )}
      </div>
      <button
        className="w-17 h-17 flex items-center justify-center bg-linear-to-br from-pink-600 to-rose-500 rounded-full absolute bottom-10 right-10 hover:scale-105 focus:outline-none cursor-pointer transition-all"
        onClick={() =>
          setOpenAddEditModal({ isShown: true, type: "add", data: null })
        }
      >
        <MdAdd size={20} className="text-white  font-bold" />
      </button>

      {/* add or edit note */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() =>
          setOpenAddEditModal({ isShown: false, type: "add", data: null })
        }
        style={{ overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" } }}
        contentLabel="Add/Edit Note"
        className=" bg-white dark:bg-[#0c0c0e] rounded-lg p-6 w-full max-w-md max-h-[85vh] overflow-y-auto outline-none"
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      >
        <AddEditNotes
          key={`${openAddEditModal.type}-${openAddEditModal.data?._id || "new"}`}
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={onCloseAddNote}
          onSuccess={(updatedNote) => {
            setNotes((currentNotes) => {
              if (openAddEditModal.type === "edit") {
                return sortNotes(
                  currentNotes.map((note) =>
                    note._id === updatedNote._id ? updatedNote : note
                  )
                );
              }
              return sortNotes([updatedNote, ...currentNotes]);
            });
          }}
        />
      </Modal>

      {/*  view note modal */}
      <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={closeViewModal}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
        className="w-full mx-4 sm:mx-0 max-w-2xl rounded-2xl bg-white p-0 outline-none shadow-[0_20px_60px_rgba(0,0,0,0.25)] dark:bg-[#121214]"
      >
        {openViewModal.data && (
          <div className="overflow-hidden rounded-2xl">
            <div className="border-b border-slate-200 bg-slate-100 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/80">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {openViewModal.data.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {new Date(
                      openViewModal.data.createdOn
                    ).toLocaleDateString()}
                  </p>
                </div>

                <button
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-white"
                  onClick={closeViewModal}
                  aria-label="Close note"
                >
                  <MdClose size={18} />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  className={`flex items-center gap-2 cursor-pointer rounded-full px-3 py-2 text-sm transition ${
                    openViewModal.data.isPinned
                      ? "bg-sky-600 text-white"
                      : "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  }`}
                  onClick={() => handlePinNote(openViewModal.data)}
                >
                  <AiOutlinePushpin size={16} />
                  {openViewModal.data.isPinned ? "Pinned" : "Pin"}
                </button>

                <button
                  className="flex items-center gap-2 cursor-pointer rounded-full bg-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  onClick={() => openEditModal(openViewModal.data)}
                >
                  <MdOutlineCreate size={16} />
                  Edit
                </button>

                <button
                  className="flex items-center gap-2 cursor-pointer rounded-full bg-rose-600 px-3 py-2 text-sm text-white transition hover:bg-rose-700"
                  onClick={() => openDeleteModal(openViewModal.data)}
                >
                  <GoTrash size={16} />
                  Delete
                </button>
              </div>
            </div>

            <div className="max-h-[65vh] overflow-y-auto bg-white py-5 px-2 dark:bg-[#121214]">
              <div className="rounded-xl border border-slate-200 bg-linear-to-br from-slate-50 to-slate-100 p-4 text-sm leading-7 whitespace-pre-wrap text-slate-700 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-950 dark:text-slate-300">
                {openViewModal.data.content}
              </div>

              {openViewModal.data.tags?.length > 0 && (
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                  <span className="font-medium">Tags:</span>{" "}
                  {openViewModal.data.tags.join(", ")}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/*  delete modal */}
      <Modal
        isOpen={deleteModal.isShown}
        onRequestClose={() => setDeleteModal({ isShown: false, note: null })}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
        className="bg-white dark:bg-[#121214] rounded-lg p-6 w-full max-w-sm outline-none"
      >
        <DeleteConfirm
          note={deleteModal.note}
          onCancel={() => setDeleteModal({ isShown: false, note: null })}
          onConfirm={async () => {
            await handleDeleteNote(deleteModal.note._id);

            setDeleteModal({
              isShown: false,
              note: null,
            });
          }}
        />
      </Modal>
    </>
  );
};

export default Home;
