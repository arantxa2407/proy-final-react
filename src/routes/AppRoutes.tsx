import { Routes, Route, Navigate } from "react-router-dom";
import Empleado from "../components/Empleado/Empleado";
import Index from "../components/Index";
import Productos from "../components/Productos/Productos";
import Ventas from "../components/Ventas/Ventas";
import Categoria from "../components/Categoria/Categoria";
import Login from "../components/Login";
import { Empleado as EmpleadoType } from "../types/Empleado";

// Definir los tipos de las propiedades (props)
interface AppRoutesProps {
  isAuthenticated: boolean;
  handleLoginSuccess: (empleado: EmpleadoType) => void;
  currentUser: EmpleadoType | null; // Usuario actual autenticado
}

const AppRoutes: React.FC<AppRoutesProps> = ({ isAuthenticated, handleLoginSuccess, currentUser }) => {
  // Validar si el usuario no está autenticado
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="*" element={<Login onLoginSuccess={handleLoginSuccess} />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/inicio" />} />

      <Route path="/inicio" element={<Index />} />
      <Route path="/ventas" element={<Ventas />} />

      {currentUser?.roles[0].nombre === "ADMIN" && (
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
