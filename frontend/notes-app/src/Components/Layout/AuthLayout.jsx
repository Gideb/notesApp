import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-3 py-6 sm:px-4 sm:py-8 lg:px-6 select-none">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top Right Blob */}
        <div
          className="absolute -right-12 -top-12 h-48 w-48 bg-[#FF3366] sm:-right-16 sm:-top-20 sm:h-96 sm:w-96 md:h-130 md:w-130"
          style={{ borderRadius: "42% 58% 70% 30% / 45% 45% 55% 55%" }}
        />

        {/* Bottom Left Blob */}
        <div
          className="absolute -bottom-16 -left-10 h-56 w-56 bg-[#FF3366] sm:-bottom-28 sm:-left-24 sm:h-112 sm:w-112 md:h-145 md:w-145"
          style={{ borderRadius: "50% 50% 30% 70% / 50% 60% 40% 50%" }}
        />
      </div>

      <div className="relative z-10 w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
