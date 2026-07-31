import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
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
  const [isLoading, setIsLoading] = useState(false);
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
      setIsLoading(true);
      const response = await axiosInstance.post(API_PATHS.CREATE_ACCOUNT, {
        fullName,
        email,
        password,
      });

      const data = response.data;

      if (data.error || !data.accessToken) {
        toast.error(data.message || "Unable to create your account.");
        return;
      }

      localStorage.setItem("accessToken", data.accessToken);

      if (data.user?.fullName) {
        localStorage.setItem("userName", data.user.fullName);
      }

      toast.success("Account created successfully!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

      
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to reach the server. Please try again."
      );
    }
    finally {
      setIsLoading(false);
    }

  };

  return (
    <>
      <div className="flex items-center justify-center px-2 py-4 sm:px-4">
        <div className="w-full max-w-104 rounded border border-white/80 bg-[#0B112C] px-5 py-8 text-white shadow-lg sm:max-w-120 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
          <form onSubmit={handleSignup} className="mx-auto w-full max-w-88">
            <h2 className="mb-8 text-center text-2xl sm:mb-10">Sign Up</h2>

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

            <button
              type="submit"
              className="btn-primary mt-2"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>

            <p className="text-sm text-center mt-8">
              Already registered?{" "}
              <Link
                to="/login"
                className="font-medium text-[#ff277e] dark:text-pink-400 underline "
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
