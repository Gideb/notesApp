import { Link } from "react-router-dom";
import PasswordInput from "../../Components/Input/PasswordInput";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import LoginLoader from "../../Components/Loader/LoginLoader";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setError(null);

    setLoading(true);

    try {
      const response = await axiosInstance.post(API_PATHS.LOGIN, {
        email,
        password,
      });

      const data = response.data;

      if (data.error || !data.accessToken) {
        toast.error(data?.message || "Unable to log in. Please try again.");
        return;
      }

      localStorage.setItem("accessToken", data.accessToken);
      if (data.user?.fullName) {
        localStorage.setItem("userName", data.user.fullName);
      }

      toast.success("Logged in successfully!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 800);


    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to reach the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-2 py-4 sm:px-4">
      <div className="w-full max-w-104 rounded border border-white/80 bg-[#0B112C] px-5 py-8 text-white shadow-lg sm:max-w-120 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
        <form onSubmit={handleLogin} className="mx-auto w-full max-w-88">
          <h2 className="mb-8 text-center text-2xl sm:mb-10">Login</h2>

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

          {loading ? (
            <LoginLoader />
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-2 flex items-center justify-center"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          )}

          <p className="text-sm text-center mt-8">
            Not registered yet?{" "}
            <Link
              to="/signup"
              className="font-medium text-[#ff277e] dark:text-pink-400 underline "
            >
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
