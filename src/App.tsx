import "./App.css";
import img from "./assets/logo.png";
import "./css/nav.css";
import Login from "./components/Login";
import { Link, BrowserRouter as Router} from "react-router-dom";
import { useState, useEffect } from "react";
import { Usuario } from "./types/Usuario";
import UsuariosService from "./services/UsuarioService";
import "./utils/axiosConfig";
import AppRoutes from "./routes/AppRoutes";


// Componentes para las diferentes rutas
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [nombre, setNombre] = useState<string>("");

  // Efecto para verificar si hay un usuario autenticado al cargar la aplicación
  useEffect(() => {
    const user = UsuariosService.getCurrentUser();
    if (user) {
      setIsAuthenticated(true);
      setNombre(user.nombre);
    }
  }, []);

  // Manejador para cuando el inicio de sesión es exitoso
  const handleLoginSuccess = (user: Usuario) => {
    setIsAuthenticated(true);
    setNombre(user.nombre);
  };

  // Manejador para cerrar sesión
  const handleLogout = () => {
    UsuariosService.logout();
    setIsAuthenticated(false);
    setNombre("");
  };

  return (
    <Router>
      {/* Esto debe envolver toda la aplicación */}
      {!isAuthenticated ? (
        // Mostrar el componente de inicio de sesión si no está autenticado
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <nav className="navbar navbar-expand-lg">
          <div className="container-fluid">
            <Link
              className="navbar-brand d-flex align-items-center"
              to="/inicio" // Cambiar a Link y especificar la ruta
            >
              <img src={img} alt="logo" width="40" className="mx-3" />
              Bodega Tito's
            </Link>
            <button
              className="navbar-toggler border-0 shadow-none"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="justify-content-end navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav">
                <li className="nav-item mx-2">
                  <Link
                    className="nav-link active"
                    aria-current="page"
                    to="/inicio" 
                  >
                    Inicio
                  </Link>
                </li>
                <li className="nav-item mx-2">
                  <Link className="nav-link" to="/productos">
                    Productos
                  </Link>
                </li>
                <li className="nav-item mx-2">
                  <Link className="nav-link" to="/ventas">
                    Venta
                  </Link>
                </li>
                <li className="nav-item mx-2">
                  <Link className="nav-link" to="/empleados">
                    Empleado
                  </Link>
                </li>
                <li className="nav-item mx-2">
                  <Link className="nav-link" to="/categorias">
                    Categoria
                  </Link>
                </li>
        {/* Mostrar el nombre del usuario de manera destacada */}
        <li className="nav-item mx-2">
          <p className="navbar-text  mb-0">Bienvenido, {nombre}</p>
        </li>

        {/* Botón de cerrar sesión estilizado */}
        <li className="nav-item mx-2">
          <button
            className="btn"
            style={{ backgroundColor: "#bebdbd5e" }}
            onClick={handleLogout}
          >
            Cerrar Sesión
          </button>
        </li>
              </ul>
            </div>
          </div>
        </nav>
      )}

      <AppRoutes />

    </Router>
  );
}

export default App;
