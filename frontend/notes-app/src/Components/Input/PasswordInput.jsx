import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className="flex items-center bg-transparent border-[1.5px] px-5 rounded mb-4 ">
      <input
        value={value}
        placeholder={placeholder || "password"}
        onChange={onChange}
        type={isShowPassword ? "text" : "password"}
        className="text-sm py-3 w-full outline-none mr-3 bg-transparent"
      />

      {isShowPassword ? (
        <FaRegEye
          size={20}
          className="cursor-pointer text-primary "
          onClick={() => toggleShowPassword()}
        />
      ) : (
        <FaRegEyeSlash
          size={20}
          className="text-slate-400 cursor-pointer "
          onClick={() => toggleShowPassword()}
        />
      )}
    </div>
  );
};

export default PasswordInput;
