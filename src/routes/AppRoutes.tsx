import { Routes, Route } from "react-router-dom";
import Empleado from "../components/Empleado/Empleado";
import Login from "../components/Login";
import Index from "../components/Index";
import Productos from "../components/Productos/Productos";
import Ventas from "../components/Ventas/Ventas";
import Categoria from "../components/Categoria/Categoria";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        {/* Contenedor de las rutas */}
        <Route path="/" element={<Login onLoginSuccess={(user) => console.log(user)} />} />
        {/* Ruta para la página de inicio */}
        <Route path="/inicio" element={<Index />} />{" "}
        {/* Ruta para la página de inicio */}
        <Route path="/empleados" element={<Empleado />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/categorias" element={<Categoria />} />
        {/* Puedes añadir otras rutas aquí */}
        <Route path="*" element={<Index />} />{" "}
        {/* Ruta por defecto para páginas no encontradas */}
      </Routes>
    </>
  );
};

export default AppRoutes;
