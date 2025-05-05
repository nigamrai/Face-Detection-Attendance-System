import React from "react";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";
const HomeLayout = ({children}: {children: React.ReactNode}) => {
 
  return (
   <>
    <Navbar />
    {children}
    <Footer/></>
  );
};

export default HomeLayout;