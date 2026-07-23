import { useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

const SearchBar = ({ onChange, onClearSearch, value, handleSearch }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const hasSearchValue = Boolean(value?.toString().trim());

  const handleClear = () => {
    onClearSearch();
    setIsSearchOpen(false);
  };

  const handleSearchSubmit = () => {
    if (typeof handleSearch === "function") {
      handleSearch();
    }
    setIsSearchOpen(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearchSubmit();
    }
  };

  return (
    <>
      <div className="hidden w-80 sm:flex items-center rounded-md bg-slate-100 px-4 dark:bg-dark/20">
        <input
          type="text"
          placeholder="Search Notes..."
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent py-2.75 text-xs outline-none dark:text-white"
        />

        {hasSearchValue && (
          <IoClose
            className="mr-3 text-md text-slate-400 cursor-pointer hover:text-black dark:hover:text-white"
            onClick={handleClear}
          />
        )}

        <FaMagnifyingGlass
          className="cursor-pointer text-slate-400 hover:text-black dark:hover:text-white"
          onClick={handleSearchSubmit}
        />
      </div>

      <div className="flex items-center sm:hidden">
        {!isSearchOpen ? (
          <FaMagnifyingGlass
            className="cursor-pointer text-slate-400 hover:text-black dark:hover:text-white"
            onClick={() => setIsSearchOpen(true)}
          />
        ) : (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px]"
              onClick={() => setIsSearchOpen(false)}
            />

            <div className="fixed inset-x-4 top-4 z-50 flex items-center rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-lg dark:border-gray700 dark:bg-[#161114]">
              <input
                type="text"
                placeholder="Search Notes..."
                value={value}
                onChange={onChange}
                onKeyDown={handleKeyDown}
                autoFocus
                className="w-full bg-transparent text-xs outline-none dark:text-white"
              />

              {hasSearchValue && (
                <IoClose
                  className="ml-2 text-md text-slate-400 cursor-pointer hover:text-black dark:hover:text-white"
                  onClick={handleClear}
                />
              )}

              <button
                type="button"
                onClick={handleSearchSubmit}
                className="ml-2 rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100 cursor-pointer"
              >
                <FaMagnifyingGlass className="text-sm" />
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SearchBar;
