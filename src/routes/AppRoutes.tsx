import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../components/Login/Login';
import Home from '../components/Home/Home';
import Perfil from '../components/Perfil/Perfil';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/perfil" element={<Perfil/>} />
      {/* Aquí puedes añadir más rutas */}
    </Routes>
  );
};

export default AppRoutes;