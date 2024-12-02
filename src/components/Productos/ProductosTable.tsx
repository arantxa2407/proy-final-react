import { useEffect, useState } from "react";
import ProductoService from "../../services/ProductoService";
import ProductosForm from "./ProductosForm";
import { Producto } from "../../types/Producto";

const ProductosTable = () => {
  // Estados para manejar la lista de productos y operaciones
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoToEdit, setProductoToEdit] = useState<Producto | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Cargar productos al montar el componente
  useEffect(() => {
    fetchProductos();
  }, []);

  // Función para obtener la lista de productos
  const fetchProductos = async () => {
    try {
      const response = await ProductoService.getProductos();
      setProductos(response.data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      // Aquí puedes agregar un toast o algún manejo de errores si es necesario
    }
  };

  // Manejador para añadir un nuevo producto
  const handleProductoAdded = (newProducto: Producto) => {
    setProductos([...productos, newProducto]);
  };

  // Manejador para actualizar un producto existente
  const handleProductoUpdated = (updatedProducto: Producto) => {
    setProductos(
      productos.map((producto) =>
        producto.id === updatedProducto.id ? updatedProducto : producto
      )
    );
    setProductoToEdit(undefined);
  };

  // Manejador para iniciar el proceso de edición
  const handleEditClick = (producto: Producto) => {
    setProductoToEdit(producto);
  };

  // Manejador para iniciar el proceso de eliminación
  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setShowConfirmDelete(true);
  };

  // Manejador para confirmar la eliminación de un producto
  const handleDeleteConfirm = async () => {
    if (deleteId) {
      try {
        await ProductoService.deleteProducto(deleteId);
        setProductos(productos.filter((producto) => producto.id !== deleteId));
        setShowConfirmDelete(false);
        // Aquí puedes agregar un toast o algún manejo de éxito si es necesario
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
        // Aquí puedes agregar un toast o algún manejo de error si es necesario
      }
    }
  };

  // Manejador para cancelar la eliminación
  const handleDeleteCancel = () => {
    setShowConfirmDelete(false);
    setDeleteId(null);
  };

  return (
    <>
      <ProductosForm
        onProductoAdded={handleProductoAdded}
        onProductoUpdated={handleProductoUpdated}
        productoToEdit={productoToEdit}
      />

      <div className="container mt-4">
        <h2>Lista de Productos</h2>
        {productos.length > 0 ? (
          <table id="tablaProductos" className="table table-bordered mb-5">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Proveedor</th>
                <th>Fecha ingreso</th>
                <th>Categoria</th>
                <th>Cantidad</th>
                <th>Descripción</th>
                <th>
                  Precio<i className="bi bi-sun ms-2"></i>
                </th>
                <th>
                  Precio<i className="bi bi-moon ms-2"></i>
                </th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.id}</td>
                  <td>{producto.nombre}</td>
                  <td>{producto.proveedor}</td>
                  <td>{producto.fecha_ingreso}</td>
                  <td>{producto.categoria.nombre}</td>
                  <td>{producto.cantidad}</td>
                  <td>{producto.descripcion}</td>
                  <td>S/ {producto.precio_dia}</td>
                  <td>S/ {producto.precio_noche}</td>
                  <td>
                    <button
                      className="btn"
                      style={{
                        backgroundColor: " rgb(241, 241, 154)",
                        marginRight: "5px",
                      }}
                      onClick={() => handleEditClick(producto)}
                    >
                      <i
                        className="bi bi-pencil"
                        style={{ marginRight: "5px" }}
                      ></i>
                      Editar
                    </button>
                    <button
                      className="btn"
                      onClick={() => handleDeleteClick(producto.id)}
                      style={{ backgroundColor: "#ed7e7e" }}
                    >
                      <i
                        className="bi bi-trash"
                        style={{ marginRight: "5px" }}
                      ></i>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay productos registrados</p>
        )}

        {/* Confirmación de eliminación */}
        {showConfirmDelete && (
          <div className="modal show" style={{ display: "block" }} tabIndex={-1}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirmar eliminación</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleDeleteCancel}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <p>¿Estás seguro de que deseas eliminar este producto?</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleDeleteCancel}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDeleteConfirm}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductosTable;
