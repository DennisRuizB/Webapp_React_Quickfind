import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../components/Login/Login";
import Home from "../components/Home/Home";
import Perfil from "../components/Perfil/Perfil";
import Services from "../components/NavBar_Services/NavBar_Services";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/services" element={<Services />} />
      {/* Aquí puedes añadir más rutas */}
    </Routes>
  );
};

export default AppRoutes;
