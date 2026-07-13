import { useEffect, useRef, useState } from "react";
import { getInitials } from "../../utils/helper";

const ProfileInfo = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const closeTimerRef = useRef(null);

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
        className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-sm font-medium text-slate-950 transition hover:scale-105 dark:bg-slate-800 dark:text-white"
      >
        {getInitials("Papa Smith")}
      </button>

      <div
        onMouseEnter={clearCloseTimer}
        onMouseLeave={scheduleClose}
        className={`absolute right-0 top-full z-50 mt-2 w-48 rounded border border-slate-200 bg-white p-3 shadow-lg transition-all duration-300 ease-out dark:border-gray-700 dark:bg-[#0f0d0e] ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <div className="text-sm font-medium text-slate-900 dark:text-white">
          Papa Smith
        </div>
        <button
          className="mt-2 cursor-pointer text-sm text-red-500 underline transition hover:text-red-700 dark:text-red-400 dark:hover:text-red-600"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
