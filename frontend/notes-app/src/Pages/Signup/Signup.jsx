import { Link } from "react-router-dom";

import PasswordInput from "../../Components/Input/PasswordInput";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import { API_PATHS } from "../../utils/apiPaths";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!fullName) {
      setError("Please enter your Name.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setError(null);

    try {
      const response = await fetch(API_PATHS.CREATE_ACCOUNT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      });
      const data = await response.json();

      if (!response.ok || data.error || !data.accessToken) {
        setError(data.message || "Unable to create your account.");
        return;
      }

      localStorage.setItem("accessToken", data.accessToken);
      navigate("/dashboard");
    } catch {
      setError("Unable to reach the server. Please try again.");
    }
  };

  return (
    <>
      <div className="flex items-center justify-center px-2 py-4 sm:px-4">
        <div className="w-full max-w-104 rounded border border-white/80 bg-[#0B112C] px-5 py-8 text-white shadow-lg sm:max-w-120 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
          <form onSubmit={handleSignup} className="mx-auto w-full max-w-88">
            <h2 className="mb-8 text-center text-2xl sm:mb-10">SignUp</h2>

            <input
              type="text"
              placeholder="Full Name"
              className="input-box"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
              }}
            />
            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />

            <PasswordInput
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />

            {error && (
              <p className="text-red-500 dark:text-red-400 text-xs pb-1">
                {error}
              </p>
            )}

            <button type="submit" className="btn-primary mt-2">
              SignUp
            </button>

            <p className="text-sm text-center mt-8">
              Already regsitered?{" "}
              <Link
                to="/login"
                className="font-medium text-primary dark:text-pink-400 underline "
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
