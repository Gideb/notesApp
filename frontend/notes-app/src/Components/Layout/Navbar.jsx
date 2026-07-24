import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProfileInfo from "../Cards/ProfileInfo";
import SearchBar from "../SearchBar/SearchBar";
import { GiNotebook } from "react-icons/gi";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const Navbar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
  const [userName, setUserName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
      return;
    }

    const loadUserProfile = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.GET_USER_INFO);
        const nextName = response?.data?.user?.fullName;
        if (nextName) {
          setUserName(nextName);
          localStorage.setItem("userName", nextName);
        }
      } catch (error) {
        console.error("Unable to load user profile", error);
      }
    };

    void loadUserProfile();
  }, []);

  const onLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userName");
    setUserName("");
    navigate("/login");
  };

  const handleSearch = (value = searchQuery) => {
    const trimmedValue = value.trim();
    const nextParams = new URLSearchParams(searchParams.toString());

    if (trimmedValue) {
      nextParams.set("q", trimmedValue);
    } else {
      nextParams.delete("q");
    }

    setSearchParams(nextParams);
  };

  const onClearSearch = () => {
    setSearchQuery("");
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("q");
    setSearchParams(nextParams);
  };

  return (
    <div className="flex items-center bg-white dark:bg-primary justify-between px-6 sm:px-10 py-3 drop-shadow-md  dark:border-b dark:border-white/50 ">
      <div className="flex items-center gap-2 py-3">
        <h2 className="text-2xl font-semibold text-primary dark:text-dark">
          NOTEBOOK
        </h2>
        <GiNotebook className="text-primary dark:text-dark text-2xl" />
      </div>

      <SearchBar
        value={searchQuery}
        onChange={({ target }) => {
          const nextValue = target.value;
          setSearchQuery(nextValue);
          handleSearch(nextValue);
        }}
        handleSearch={() => handleSearch(searchQuery)}
        onClearSearch={onClearSearch}
      />

      <ProfileInfo onLogout={onLogout} userName={userName} />
    </div>
  );
};

export default Navbar;
