import { useState } from "react";
import NoteCard from "../../Components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "../../Components/Home/AddEditNotes";
import Modal from "react-modal";

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    date: null,
  });

  const onCloseAddNote = () => {
    setOpenAddEditModal({
      isShown: false,
      type: "add",
      date: null,
    });
  };

  return (
    <>
      <div className=" container mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-4 mt-8">
          <NoteCard
            title={"#uck Deladem"}
            date={"Feb 2026"}
            content="hit me like your life depends on it"
            tags="#ucking"
            isPinned={true}
            onEdit={() => {}}
            onDelete={() => {}}
            onPinNote={() => {}}
          />
        </div>
      </div>

      <button
        className="w-15 h-15 flex items-center justify-center bg-primary text-white rounded-full absolute bottom-10 right-10 hover:bg-pink-800 focus:outline-none cursor-pointer"
        onClick={() =>
          setOpenAddEditModal({ isShown: true, type: "add", date: null })
        }
      >
        <MdAdd size={20} className="text-white " />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() =>
          setOpenAddEditModal({ isShown: false, type: "add", date: null })
        }
        style={{ overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" } }}
        contentLabel="Add/Edit Note"
        className="bg-white dark:bg-[#0c0c0e] rounded-lg p-6 w-full max-w-md max-h-3/4 mx-auto mt-20 "
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={onCloseAddNote}
        />
      </Modal>
    </>
  );
};

export default Home;
