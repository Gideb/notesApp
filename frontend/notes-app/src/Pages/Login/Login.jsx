import { Link } from "react-router-dom";
import PasswordInput from "../../Components/Input/PasswordInput";
import { useState } from "react";
import { validateEmail } from "../../utils/helper";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

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

    setError(null); //clear any previous error messages

    //login api call logic here
  };

  return (
    <div className="flex items-center justify-center mt-38">
      <div className="w-130 shadow-lg dark:border-white dark:border rounded bg-[#0B112C] px-15 py-20 text-white ">
        <form onSubmit={handleLogin} className="w-90 mx-auto">
          <h2 className="text-2xl text-center mb-10">Login</h2>

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
            Login
          </button>

          <p className="text-sm text-center mt-8">
            Not regsitered yet?{" "}
            <Link
              to="/signup"
              className="font-medium text-primary dark:text-pink-400 underline "
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
