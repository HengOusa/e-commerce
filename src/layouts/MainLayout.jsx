import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/header/Header";
import NavBar from "../components/navbar/NavBar";

const MainLayout = () => {
  return (
    <>
      <Header />
      <NavBar />
      {/* Add padding top to avoid overlap with fixed navbar */}
      <div >
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;
