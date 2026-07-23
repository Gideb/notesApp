import { useEffect, useState } from "react";
import NoteCard from "../../Components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "../../Components/Home/AddEditNotes";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../../utils/apiPaths";
import DeleteConfirm from "../../Components/Modals/DeleteConfirm";

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

  const request = async (path, options = {}) => {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(path, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...options.headers,
      },
    });
    const data = await response.json();
    if (!response.ok || data.error) {
      throw new Error(data.message || "Unable to complete the request.");
    }
    return data;
  };

  //show notes on homescreen
  const getNotes = async () => {
    try {
      const data = await request(API_PATHS.GET_ALL_NOTES);
      setNotes(data.notes || []);
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

  const onCloseAddNote = () => {
    setOpenAddEditModal({
      isShown: false,
      type: "add",
      data: null,
    });
  };

  //note delete button
  const handleDeleteNote = async (noteId) => {
    try {
      await request(API_PATHS.DELETE_NOTE(noteId), { method: "DELETE" });
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
      const data = await request(API_PATHS.UPDATE_PINNED_NOTE(note._id), {
        method: "PUT",
        body: JSON.stringify({ isPinned: !note.isPinned }),
      });
      setNotes((currentNotes) =>
        currentNotes
          .map((currentNote) =>
            currentNote._id === note._id ? data.note : currentNote
          )
          .sort(
            (firstNote, secondNote) =>
              Number(secondNote.isPinned) - Number(firstNote.isPinned)
          )
      );
    } catch (error) {
      setError(error.message || "Unable to update the note.");
    }
  };

  return (
    <>
      <div className=" container mx-auto p-4">
        {error && <p className="mt-8 text-sm text-red-500">{error}</p>}

        {isLoading ? (
          <p className="mt-8 text-sm text-slate-500">Loading notes...</p>
        ) : notes.length === 0 ? (
          <p className="mt-8 text-sm text-slate-500">
            No notes yet. Create your first one.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 mt-8 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
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
        className="w-17 h-17 flex items-center justify-center bg-primary dark:bg-dark  rounded-full absolute bottom-10 right-10 hover:bg-primary/90 dark:hover:bg-dark/90 focus:outline-none cursor-pointer"
        onClick={() =>
          setOpenAddEditModal({ isShown: true, type: "add", data: null })
        }
      >
        <MdAdd size={20} className="text-white dark:text-primary font-bold" />
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
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={onCloseAddNote}
          onSuccess={(updatedNote) => {
            setNotes((currentNotes) => {
              if (openAddEditModal.type === "edit") {
                return currentNotes.map((note) =>
                  note._id === updatedNote._id ? updatedNote : note
                );
              }
              return [updatedNote, ...currentNotes];
            });
          }}
        />
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
        className="bg-white dark:bg-[#0c0c0e] rounded-lg p-6 w-full max-w-sm outline-none"
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
