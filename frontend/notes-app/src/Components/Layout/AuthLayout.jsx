import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden  p-4 select-none">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top Right Blob */}
        <div
          className="absolute -right-16 -top-20 h-[520px] w-[520px] bg-[#FF3366]"
          style={{ borderRadius: "42% 58% 70% 30% / 45% 45% 55% 55%" }}
        />

        {/* Bottom Left Blob */}
        <div
          className="absolute -bottom-28 -left-24 h-[580px] w-[580px] bg-[#FF3366]"
          style={{ borderRadius: "50% 50% 30% 70% / 50% 60% 40% 50%" }}
        />
      </div>

      <div className="relative z-10 ">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
