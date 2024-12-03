import { Routes, Route, Navigate } from "react-router-dom";
import Empleado from "../components/Empleado/Empleado";
import Index from "../components/Index";
import Productos from "../components/Productos/Productos";
import Ventas from "../components/Ventas/Ventas";
import Categoria from "../components/Categoria/Categoria";
import Login from "../components/Login";

// Definir los tipos de las propiedades (props)
interface AppRoutesProps {
  isAuthenticated: boolean; // Es un booleano
  handleLoginSuccess: (empleado: any) => void; // Función que recibe un empleado y no retorna nada
}

const AppRoutes: React.FC<AppRoutesProps> = ({ isAuthenticated, handleLoginSuccess }) => {
  return (
    <Routes>
      {/* Si el usuario está autenticado, redirige a /inicio */}
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/inicio" /> : <Login onLoginSuccess={handleLoginSuccess} />}
      />
      <Route path="/inicio" element={<Index />} />
      <Route path="/empleados" element={<Empleado />} />
      <Route path="/productos" element={<Productos />} />
      <Route path="/ventas" element={<Ventas />} />
      <Route path="/categorias" element={<Categoria />} />
      <Route path="*" element={<Index />} />
    </Routes>
  );
};

export default AppRoutes;
