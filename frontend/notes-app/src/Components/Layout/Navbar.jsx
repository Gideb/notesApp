import { useNavigate } from "react-router-dom";
import ProfileInfo from "../Cards/ProfileInfo";
import SearchBar from "../SearchBar/SearchBar";
import { useState } from "react";
import { GiNotebook } from "react-icons/gi";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  const handleSearch = () => {};

  const onClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="flex items-center  bg-white dark:bg-[#000000] justify-between px-6 py-3 drop-shadow-md  dark:border-b dark:border-white/30 ">
      <div className="flex items-center gap-2 py-3">
        <h2 className="text-2xl font-semibold text-primary dark:text-dark">
          NOTEBOOK
        </h2>
        <GiNotebook className="text-primary dark:text-dark text-2xl" />
      </div>

      <SearchBar
        value={searchQuery}
        onChange={({ target }) => {
          setSearchQuery(target.value);
        }}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />

      <ProfileInfo onLogout={onLogout} />
    </div>
  );
};

export default Navbar;
