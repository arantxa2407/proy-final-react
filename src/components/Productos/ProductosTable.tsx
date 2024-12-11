import { useEffect, useState } from "react";
import ProductoService from "../../services/ProductoService";
import ProductosForm from "./ProductosForm";
import { Producto } from "../../types/Producto";
import CategoriaService from "../../services/CategoriaService";
import { Categoria } from "../../types/Categoria";

const ProductosTable = () => {
  // Estados para manejar la lista de productos y operaciones
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  // Estados para los filtros
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<
    string | null
  >(null);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<
    string | null
  >(null);
  const [productoToEdit, setProductoToEdit] = useState<Producto | undefined>(
    undefined
  );
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Estado para la búsqueda por nombre de producto
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [isCategoryHovered, setIsCategoryHovered] = useState(false);
  const [isProviderHovered, setIsProviderHovered] = useState(false);

  const [ordenSeleccionado, setOrdenSeleccionado] =
    useState<string>("id_asc");

  // Cargar productos y categorías al montar el componente
  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, []);

  // Función para obtener la lista de productos
  const fetchProductos = async () => {
    try {
      const response = await ProductoService.getProductos();
      setProductos(response.data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  // Función para obtener la lista de categorías
  const fetchCategorias = async () => {
    try {
      const response = await CategoriaService.getCategorias();
      setCategorias(response.data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

  // Función para filtrar productos según la categoría, proveedor y nombre
  const getFilteredProducts = () => {
    return productos.filter((producto) => {
      // Filtramos por categoría
      const isCategoryMatch =
        categoriaSeleccionada === null ||
        producto.categoria.nombre === categoriaSeleccionada;
      // Filtramos por proveedor
      const isProviderMatch =
        proveedorSeleccionado === null ||
        producto.proveedor === proveedorSeleccionado;
      // Filtramos por nombre de producto
      const isNameMatch = producto.nombre
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return isCategoryMatch && isProviderMatch && isNameMatch;
    });
  };

  // Manejadores de cambios de filtros
  const handleCategoriaChange = (categoria: string | null) => {
    setCategoriaSeleccionada(categoria);
  };

  const handleProveedorChange = (proveedor: string | null) => {
    setProveedorSeleccionado(proveedor);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
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
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
      }
    }
  };

  // Manejador para cancelar la eliminación
  const handleDeleteCancel = () => {
    setShowConfirmDelete(false);
    setDeleteId(null);
  };

  // Productos filtrados
  const productosFiltrados = getFilteredProducts();

  const ordenarProductos = (productos: Producto[]) => {
    switch (ordenSeleccionado) {
      case "id_asc":
        return productos.sort((a, b) => a.id - b.id); // Ordenar por ID de menor a mayor
      case "id_desc":
        return productos.sort((a, b) => b.id - a.id); // Ordenar por ID de mayor a menor
      case "fecha_ingreso_asc":
        return productos.sort(
          (a, b) =>
            new Date(a.fecha_ingreso).getTime() -
            new Date(b.fecha_ingreso).getTime()
        );
      case "fecha_ingreso_desc":
        return productos.sort(
          (a, b) =>
            new Date(b.fecha_ingreso).getTime() -
            new Date(a.fecha_ingreso).getTime()
        );
      case "precio_dia_asc":
        return productos.sort((a, b) => a.precio_dia - b.precio_dia);
      case "precio_dia_desc":
        return productos.sort((a, b) => b.precio_dia - a.precio_dia);
      case "precio_noche_asc":
        return productos.sort((a, b) => a.precio_noche - b.precio_noche);
      case "precio_noche_desc":
        return productos.sort((a, b) => b.precio_noche - a.precio_noche);
      case "cantidad_asc":
        return productos.sort((a, b) => a.cantidad - b.cantidad);
      case "cantidad_desc":
        return productos.sort((a, b) => b.cantidad - a.cantidad);
      default:
        return productos;
    }
  };

  const productosFiltradosOrdenados = ordenarProductos(productosFiltrados);

  return (
    <>
      <ProductosForm
        onProductoAdded={handleProductoAdded}
        onProductoUpdated={handleProductoUpdated}
        productoToEdit={productoToEdit}
      />

      <div className="container mt-4">
        <h2>Lista de Productos</h2>
        <div className="mb-3">
          <div className="row d-flex justify-content-between align-items-center">
            {/* Campo de búsqueda */}
            <div className="col-md-3">
              <input
                type="text"
                placeholder="Buscar por nombre de producto"
                value={searchTerm}
                onChange={handleSearchChange}
                className="form-control"
              />
            </div>

            {/* Dropdown para seleccionar categoría */}
            <div className="col-md-2">
              <div
                className="dropdown"
                onMouseEnter={() => setIsCategoryHovered(true)}
                onMouseLeave={() => setIsCategoryHovered(false)}
              >
                <button className="dropdown-button">Categoría</button>
                {isCategoryHovered && (
                  <div className="dropdown-options">
                    <div
                      className="dropdown-option"
                      onClick={() => handleCategoriaChange(null)}
                    >
                      Todos
                    </div>
                    {categorias.map((cat, index) => (
                      <div
                        key={index}
                        className="dropdown-option"
                        onClick={() => handleCategoriaChange(cat.nombre)}
                      >
                        {cat.nombre}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Dropdown para seleccionar proveedor */}
            <div className="col-md-2">
              <div
                className="dropdown"
                onMouseEnter={() => setIsProviderHovered(true)}
                onMouseLeave={() => setIsProviderHovered(false)}
              >
                <button className="dropdown-button">Proveedor</button>
                {isProviderHovered && (
                  <div className="dropdown-options">
                    <div
                      className="dropdown-option"
                      onClick={() => handleProveedorChange(null)}
                    >
                      Todos
                    </div>
                    {productos
                      .map((prod) => prod.proveedor)
                      .filter(
                        (value, index, self) => self.indexOf(value) === index
                      )
                      .map((proveedor, index) => (
                        <div
                          key={index}
                          className="dropdown-option"
                          onClick={() => handleProveedorChange(proveedor)}
                        >
                          {proveedor}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Combobox para seleccionar el orden */}
            <div className="col-md-3">
              <select
                className="form-select w-100"
                value={ordenSeleccionado}
                onChange={(e) => setOrdenSeleccionado(e.target.value)}
              >
                <option value="id_asc">ID (Menor a mayor)</option>
                <option value="id_desc">ID (Mayor a menor)</option>
                <option value="fecha_ingreso_desc">
                  Fecha de Ingreso (Más reciente)
                </option>
                <option value="fecha_ingreso_asc">
                  Fecha de Ingreso (Más antigua)
                </option>
                <option value="precio_dia_desc">
                  Precio de Día (Mayor a menor)
                </option>
                <option value="precio_dia_asc">
                  Precio de Día (Menor a mayor)
                </option>
                <option value="precio_noche_desc">
                  Precio de Noche (Mayor a menor)
                </option>
                <option value="precio_noche_asc">
                  Precio de Noche (Menor a mayor)
                </option>
                <option value="cantidad_desc">Cantidad (Mayor a menor)</option>
                <option value="cantidad_asc">Cantidad (Menor a mayor)</option>
              </select>
            </div>
          </div>
        </div>

        {productosFiltrados.length > 0 ? (
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
              {productosFiltradosOrdenados.map((producto) => (
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
                        backgroundColor: "rgb(241, 241, 154)",
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
          <div
            className="modal show"
            style={{ display: "block" }}
            tabIndex={-1}
          >
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
