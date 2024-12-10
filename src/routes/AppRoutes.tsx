import { Routes, Route, Navigate } from "react-router-dom";
import Empleado from "../components/Empleado/Empleado";
import Index from "../components/Index";
import Productos from "../components/Productos/Productos";
import Ventas from "../components/Ventas/Ventas";
import Categoria from "../components/Categoria/Categoria";
import Login from "../components/Login";
import { Empleado as EmpleadoType } from "../types/Empleado";

interface AppRoutesProps {
  isAuthenticated: boolean;
  handleLoginSuccess: (empleado: EmpleadoType) => void;
  currentUser: EmpleadoType | null; // Usuario actual autenticado
}

const AppRoutes: React.FC<AppRoutesProps> = ({ isAuthenticated, handleLoginSuccess, currentUser }) => {
  // Si el usuario no está autenticado, redirigimos a Login
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="*" element={<Login onLoginSuccess={handleLoginSuccess} />} />
      </Routes>
    );
  }

  // Si el usuario está autenticado, gestionamos las rutas
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/inicio" />} />
      
      <Route path="/inicio" element={<Index currentUser={currentUser} />} />
      <Route path="/ventas" element={<Ventas />} />

      {currentUser?.roles?.[0]?.nombre === "ADMIN" && (
        <>
          <Route path="/empleados" element={<Empleado />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/categorias" element={<Categoria />} />
        </>
      )}

      <Route path="*" element={<Navigate to="/inicio" />} />
    </Routes>
  );
};

export default AppRoutes;
