// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./styles/index.css";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";

// Páginas nuevas (créalas en src/pages/)
import Dashboard from "./pages/Dashboard";
import CashRegister from "./pages/CashRegister";
import Traceability from "./pages/Traceability";
import Security from "./pages/Security";
import Loyalty from "./pages/Loyalty";

function Home() {
  return (
    <section className="hero">
      <div className="hero-card">
        <p className="hero-eyebrow">Gestión Web Segura</p>
        <h1 className="hero-title">Descubre el sabor del café orgánico</h1>
        <p className="hero-sub">
          Plataforma segura para gestionar inventarios, pedidos, ventas y proveedores,
          con trazabilidad de productos orgánicos y control de caja. Seguridad, cifrado
          y control de accesos alineados a ODS 8, 9, 12 y 16.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link to="/login" className="btn btn-primary">Comenzar gestión</Link>
          <a href="#menu" className="btn btn-outline">Ver catálogo</a>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />

        {/* Gestión (de momento sin protección; luego se puede añadir ProtectedRoute) */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/caja" element={<CashRegister />} />
        <Route path="/trazabilidad" element={<Traceability />} />
        <Route path="/seguridad" element={<Security />} />
        <Route path="/fidelizacion" element={<Loyalty />} />
      </Routes>
    </Router>
  );
}
