import React from "react";
import { FaBullseye, FaGlobe, FaInfoCircle } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="flex gap-6 flex-wrap items-center justify-center border-t border-gray-700 pt-6  my-5 w-fit mx-auto">
      <a
        className="flex items-center gap-2 hover:underline hover:text-blue-400"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaInfoCircle /> About Us
      </a>
      <a
        className="flex items-center gap-2 hover:underline hover:text-blue-400"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaBullseye /> Our Motive
      </a>
      <a
        className="flex items-center gap-2 hover:underline hover:text-blue-400"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaGlobe /> Know About Me
      </a>
    </footer>
  );
};

export default Footer;
