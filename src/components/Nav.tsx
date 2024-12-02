import img from "../assets/img.png";
import '../css/nav.css';
import { Link } from 'react-router-dom'; // Importar Link para navegar entre rutas

// Componente Nav
const Nav = () => {
  return (
    <>
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
                  to="/inicio" // Cambiar a Link y especificar la ruta
                >
                  Inicio
                </Link>
              </li>
              <li className="nav-item mx-2">
                <Link className="nav-link" to="/productos"> {/* Cambiar href a to */}
                  Productos
                </Link>
              </li>
              <li className="nav-item mx-2">
                <Link className="nav-link" to="/ventas"> {/* Cambiar href a to */}
                  Venta
                </Link>
              </li>
              <li className="nav-item mx-2">
                <Link className="nav-link" to="/empleados"> {/* Cambiar href a to */}
                  Empleado
                </Link>
              </li>
              <li className="nav-item mx-2">
                <Link className="nav-link" to="/categorias"> {/* Cambiar href a to */}
                  Categoria
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Nav;
