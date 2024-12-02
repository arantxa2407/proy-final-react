import { Link } from 'react-router-dom'; // Importar Link de react-router-dom
import '../css/index.css'; // Importar estilos

const Index = () => {
  return (
    <>
      <div className="contenedor d-flex flex-column align-items-center justify-content-center">
        <h1 className="bienvenida fw-bold text-center">
          Bienvenido a la Bodega Tito's</h1>
          <h2 className="fw-normal fs-5">¿Qué operación desea realizar?</h2>
        
        <div className="d-flex justify-content-center flex-wrap mt-4">
          {/* Tarjeta para gestión de productos */}
          <div className="card m-3 grande" style={{ width: '18rem' }}>
            <div className="card-body">
              <h5 className="card-title">
                <i className="bi bi-box-seam me-2"></i>Gestión de productos
              </h5>
              <p className="card-text">
                En este apartado puedes ingresar, modificar o eliminar los productos disponibles.
              </p>
              <Link className="icon-link icon-link-hover" to="/productos">
                Gestionar
                <i className="bi bi-arrow-right mb-1"></i>
              </Link>
            </div>
          </div>

          {/* Tarjeta para ventas */}
          <div className="card m-3 grande" style={{ width: '18rem' }}>
            <div className="card-body">
              <h5 className="card-title">
                <i className="bi bi-basket me-2"></i>Realizar ventas
              </h5>
              <p className="card-text">
                En este apartado puedes ingresar, modificar o eliminar los productos disponibles.
              </p>
              <Link className="icon-link icon-link-hover" to="/ventas">
                Gestionar
                <i className="bi bi-arrow-right mb-1"></i>
              </Link>
            </div>
          </div>

          {/* Tarjeta para gestión de empleados */}
          <div className="card m-3 grande" style={{ width: '18rem' }}>
            <div className="card-body">
              <h5 className="card-title">
                <i className="bi bi-people me-2"></i>Gestión de empleados
              </h5>
              <p className="card-text">
                En este apartado puedes ingresar, modificar o eliminar los empleados de la bodega.
              </p>
              <Link className="icon-link icon-link-hover" to="/empleados">
                Gestionar
                <i className="bi bi-arrow-right mb-1"></i>
              </Link>
            </div>
          </div>

          {/* Tarjeta para gestión de categorias */}
          <div className="card m-3 grande" style={{ width: '18rem' }}>
            <div className="card-body">
              <h5 className="card-title">
              <i className="bi bi-tag me-2"></i>Gestión de categorias
              </h5>
              <p className="card-text">
                En este apartado puedes ingresar, modificar o eliminar las categorias de los productos de la bodega.
              </p>
              <Link className="icon-link icon-link-hover" to="/categorias">
                Gestionar
                <i className="bi bi-arrow-right mb-1"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
