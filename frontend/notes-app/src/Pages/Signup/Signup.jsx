import { Link } from "react-router-dom";

import PasswordInput from "../../Components/Input/PasswordInput";
import { useState } from "react";
import { validateEmail } from "../../utils/helper";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

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

    setError(null); //clear any previous error messages

    //signup api call logic here
  };

  return (
    <>
      <div className="flex items-center justify-center mt-38 ">
        <div className="w-130 border rounded bg-[#0B112C] px-15 py-20 text-white  ">
          <form onSubmit={handleSignup} className="w-90 mx-auto">
            <h2 className="text-2xl text-center mb-10">SignUp</h2>

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
