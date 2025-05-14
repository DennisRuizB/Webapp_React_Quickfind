import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../components/Login/Login";
import Home from "../components/MainPages/Home/Home";
import Perfil from "../components/Profiles/Perfil/Perfil";
import Services from "../components/MainPages/NavBar_Services/NavBar_Services";
import CompanyPerfil from "../components/Profiles/CompamyPerfil/CompanyPerfil";
import PerfilExterno from "../components/Profiles/PerfilExterno/PerfilExterno";
import ReserveProducts from "../components/ReserveProducts/ReserveProducts";
import CartPage from "../components/MainPages/CartPage/CartPage";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/services" element={<Services/>} />
      <Route path="/company/:id" element={<CompanyPerfil />} />
      <Route path="/perfilExterno/:id" element={<PerfilExterno />} />
      <Route path="/ReserveProducts/:id" element={<ReserveProducts />} />
      <Route path="/cart" element={<CartPage />} />

    </Routes>
  );
};

export default AppRoutes;
