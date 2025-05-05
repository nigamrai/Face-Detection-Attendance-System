import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white shadow-inner py-4 px-8 mt-8 text-center text-gray-500 text-sm">
      &copy; {new Date().getFullYear()} Face Detection Attendance System. All rights reserved.
    </footer>
  );
};

export default Footer;
