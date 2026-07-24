import { useEffect, useRef, useState } from "react";
import { getInitials } from "../../utils/helper";
import { IoLogOutOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa6";

const ProfileInfo = ({ onLogout, userName = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const closeTimerRef = useRef(null);
  const displayName = userName?.trim() || "User";

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const openMenu = () => {
    clearCloseTimer();
    setIsOpen(true);
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 180);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
        clearCloseTimer();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      clearCloseTimer();
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      ref={menuRef}
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        onClick={toggleMenu}
        className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary dark:border-dark bg-slate-100 text-sm font-medium text-slate-950 transition hover:scale-105 dark:bg-slate-800 dark:text-white"
        aria-label={displayName}
      >
        {getInitials(displayName)}
      </button>

      <div
        onMouseEnter={clearCloseTimer}
        onMouseLeave={scheduleClose}
        className={`absolute right-0 top-full z-50 mt-2 w-43 min-w-40  rounded border-2 border-gray-200 p-4 shadow-lg transition-all duration-300 ease-out dark:border-gray-700 bg-slate-900 ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <div className="flex items-baseline gap-3 text-sm text-white">
          <FaUser className="text-md" />
          {displayName}
        </div>
        <button
          className="flex items-center gap-2 font-medium mt-1 cursor-pointer text-sm  hover:underline transition hover:text-red-600 text-red-400"
          onClick={onLogout}
        >
          <IoLogOutOutline className="text-lg" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
