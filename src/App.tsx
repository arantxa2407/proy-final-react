import "./App.css";
import img from "./assets/logo.png";
import "./css/nav.css";
import { Link, BrowserRouter as Router } from "react-router-dom";
import { useState, useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { Empleado } from "./types/Empleado";
import Login from "./components/Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<Empleado | null>(null);

  // Efecto para verificar si hay un usuario autenticado al cargar la aplicación
  useEffect(() => {
    // Obtener el empleado desde localStorage
    const storedEmpleado = localStorage.getItem("currentEmpleado");
    if (storedEmpleado) {
      const empleado: Empleado = JSON.parse(storedEmpleado);
      setIsAuthenticated(true);
      setUsername(empleado.username);
      setCurrentUser(empleado);
    }
  }, []);

  // Manejador para cuando el inicio de sesión es exitoso
  const handleLoginSuccess = (empleado: Empleado) => {
    console.log('Empleado autenticado:', empleado); // Verifica los datos
    setIsAuthenticated(true);
    setUsername(empleado.username);
    setCurrentUser(empleado);

    // Guardar empleado en localStorage
    localStorage.setItem("currentEmpleado", JSON.stringify(empleado));
  };

  // Manejador para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("currentEmpleado"); // Eliminar empleado de localStorage
    setIsAuthenticated(false);
    setUsername("");
    setCurrentUser(null);
  };

  return (
    <Router>
      {!isAuthenticated ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
              <Link
                className="navbar-brand d-flex align-items-center"
                to="/inicio"
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
                    <Link className="nav-link active" to="/inicio">
                      Inicio
                    </Link>
                  </li>
                  {/* Mostrar elementos dependiendo del rol */}
                  {currentUser?.roles?.[0]?.nombre === "ADMIN" && (
                    <>
                      <li className="nav-item mx-2">
                        <Link className="nav-link" to="/categorias">
                          Categoria
                        </Link>
                      </li>
                      <li className="nav-item mx-2">
                        <Link className="nav-link" to="/empleados">
                          Empleado
                        </Link>
                      </li>
                      <li className="nav-item mx-2">
                        <Link className="nav-link" to="/productos">
                          Productos
                        </Link>
                      </li>
                    </>
                  )}
                  {/* Mostrar siempre 'Inicio' y 'Venta' */}
                  <li className="nav-item mx-2">
                    <Link className="nav-link" to="/ventas">
                      Venta
                    </Link>
                  </li>


                  {/* Mostrar el nombre del usuario y el botón de logout */}
                  <li className="nav-item mx-2">
                    <p className="navbar-text mb-0">Bienvenido, {currentUser?.nombre || username}</p>
                  </li>
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

          {/* Pasar las propiedades a AppRoutes */}
          <AppRoutes
            isAuthenticated={isAuthenticated}
            handleLoginSuccess={handleLoginSuccess}
            currentUser={currentUser}
          />
        </>
      )}
    </Router>
  );
}

export default App;
