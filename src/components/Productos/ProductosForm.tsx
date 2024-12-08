import { useState, useEffect } from "react";
import { Producto } from "../../types/Producto";
import ProductoService from "../../services/ProductoService";
import CategoriaService from "../../services/CategoriaService";
import { Categoria } from "../../types/Categoria";

interface ProductosFormProps {
  onProductoAdded: (producto: Producto) => void;
  onProductoUpdated: (producto: Producto) => void;
  productoToEdit?: Producto;
}

const ProductosForm: React.FC<ProductosFormProps> = ({
  onProductoAdded,
  onProductoUpdated,
  productoToEdit,
}) => {
  // Estados para los campos del formulario
  const [nombre, setNombre] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [fecha_ingreso, setFecha_ingreso] = useState("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<
    number | string
  >(""); // Estado para la categoría seleccionada
  const [cantidad, setCantidad] = useState<string>("");
  const [descripcion, setDescripcion] = useState("");
  const [precioDia, setPrecioDia] = useState<string>("");
  const [precioNoche, setPrecioNoche] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [precioNocheVisible, setPrecioNocheVisible] = useState(false);
  const [errores, setErrores] = useState<{ [key: string]: string }>({});
  const [searchCategoria, setSearchCategoria] = useState(""); // Estado para la búsqueda



  // Efecto para cargar los datos del producto a editar
  useEffect(() => {
    if (productoToEdit) {
      setNombre(productoToEdit.nombre);
      setProveedor(productoToEdit.proveedor);
      setFecha_ingreso(productoToEdit.fecha_ingreso);
      setCategoriaSeleccionada(productoToEdit.categoria.id); // Establecer la categoría seleccionada
      setCantidad(productoToEdit.cantidad.toString());
      setDescripcion(productoToEdit.descripcion);
      setPrecioDia(productoToEdit.precio_dia.toString());
      setPrecioNoche(productoToEdit.precio_noche.toString());
      // Activar el checkbox de Precio de Noche si el precio de noche es diferente al precio de día
      setPrecioNocheVisible(
        productoToEdit.precio_noche !== productoToEdit.precio_dia
      );
      setIsEditMode(true);
    }
  }, [productoToEdit]);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const response = await CategoriaService.getCategorias();
      setCategorias(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Función para manejar el cambio del checkbox de precio de noche
  const handlePrecioNocheChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPrecioNocheVisible(event.target.checked);
    if (!event.target.checked) {
      setPrecioNoche(""); // Limpiar el valor cuando el campo se oculta
    }
  };

  // Función para manejar el cambio de la búsqueda de categorías
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCategoria(event.target.value); // Actualiza el valor del estado con la cadena completa
  };

  // Filtrar las categorías según el texto de búsqueda (cualquier parte del nombre)
  const filteredCategorias = categorias.filter((categoria) =>
    categoria.nombre.toLowerCase().includes(searchCategoria.toLowerCase()) // Se filtran las categorías
  );

  // Función para manejar el cambio de la categoría seleccionada
  const handleCategoriaChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCategoriaSeleccionada(Number(event.target.value)); // Guardar el id de la categoría seleccionada
  };


  // Función para manejar el envío del formulario
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    let valido = true;
    const errores: { [key: string]: string } = {};

    // Validaciones
    if (nombre.length < 3) {
      valido = false;
      errores.nombre = "El nombre debe tener al menos 3 caracteres.";
    }

    if (proveedor.length < 3) {
      valido = false;
      errores.proveedor = "El proveedor debe tener al menos 3 caracteres.";
    }

    if (descripcion.length < 3) {
      valido = false;
      errores.descripcion = "La descripción debe tener al menos 3 caracteres.";
    }

    if (Number(cantidad) < 1) {
      valido = false;
      errores.cantidad = "La cantidad minima es 1.";
    }

    if (Number(precioDia) < 0.2) {
      valido = false;
      errores.precioDia = "El precio de día debe ser mayor o igual a 0.1";
    }

    if (precioNocheVisible && Number(precioNoche) < 0.2) {
      valido = false;
      errores.precioNoche = "El precio de noche debe ser mayor o igual a 0.1";
    }

    setErrores(errores);

    if (!valido) {
      setIsSubmitting(false);
      return; // Prevenir el envío si hay errores
    }

    const productoData: Omit<Producto, "id"> = {
      nombre,
      proveedor,
      fecha_ingreso,
      categoria: categorias.find((cat) => cat.id === categoriaSeleccionada)!, // Buscar la categoría por id
      cantidad: Number(cantidad),
      descripcion,
      precio_dia: Number(precioDia),
      precio_noche: precioNocheVisible
        ? Number(precioNoche)
        : Number(precioDia), // Solo asignar precio de noche si es visible
    };

    try {
      if (isEditMode && productoToEdit) {
        // Actualizar producto existente
        const response = await ProductoService.updateProducto(
          productoToEdit.id,
          productoData as Producto
        );
        onProductoUpdated(response.data);
      } else {
        // Crear nuevo producto
        const response = await ProductoService.createProducto(
          productoData as Producto
        );
        onProductoAdded(response.data);
      }
      resetForm();
    } catch (error) {
      console.error("Error al guardar el producto:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para reiniciar el formulario
  const resetForm = () => {
    setNombre("");
    setProveedor("");
    setFecha_ingreso("");
    setCategoriaSeleccionada(""); // Limpiar la categoría seleccionada
    setCantidad("");
    setDescripcion("");
    setPrecioDia("");
    setPrecioNoche("");
    setPrecioNocheVisible(false);
    setIsEditMode(false);
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">
        {isEditMode ? "Editar Producto" : "Agregar Producto"}
      </h2>
      <form className="row g-3" onSubmit={handleSubmit} id="productosForm">
        <div className="col-md-4">
          <label htmlFor="nombre" className="form-label">
            Nombre
          </label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            placeholder="Nombre del producto"
          />
          <small
            className={`text-danger error ${
              errores.nombre ? "d-block" : "d-none"
            }`}
            id="errorNombre"
          >
            <i className="bi bi-exclamation-lg"></i>
            <span>{errores.nombre}</span>
          </small>
        </div>

        <div className="col-md-4">
          <label htmlFor="proveedor" className="form-label">
            Proveedor
          </label>
          <input
            type="text"
            className="form-control"
            id="proveedor"
            value={proveedor}
            onChange={(e) => setProveedor(e.target.value)}
            required
            placeholder="Proveedor del producto"
          />
          <small
            className={`text-danger error ${
              errores.proveedor ? "d-block" : "d-none"
            }`}
            id="errorProveedor"
          >
            <i className="bi bi-exclamation-lg"></i>
            <span>{errores.proveedor}</span>
          </small>
        </div>

        <div className="col-md-4">
          <label htmlFor="fecha_ingreso" className="form-label">
            Fecha de Ingreso
          </label>
          <input
            type="date"
            className="form-control"
            id="fecha_ingreso"
            value={fecha_ingreso}
            onChange={(e) => setFecha_ingreso(e.target.value)}
            required
            min={
              new Date(new Date().setDate(new Date().getDate() - 7))
                .toISOString()
                .split("T")[0]
            } // No permitir fechas de más de una semana atrás
            max={new Date().toISOString().split("T")[0]} // No permitir fechas futuras
          />
          <small
            className={`text-danger error ${
              errores.fecha_ingreso ? "d-block" : "d-none"
            }`}
            id="errorFechaIngreso"
          >
            <i className="bi bi-exclamation-lg"></i>
            <span>{errores.fecha_ingreso}</span>
          </small>
        </div>

        {/* Campo de categoría */}
        <div className="col-md-4">
          <label htmlFor="categoria" className="form-label">
            Categoría
          </label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              id="searchCategoria"
              placeholder="Buscar categoría"
              value={searchCategoria}
              onChange={handleSearchChange}
            />
            <select
              id="categoria"
              className="form-select"
              value={categoriaSeleccionada}
              onChange={handleCategoriaChange}
              required
            >
              <option value="">Seleccione una categoría</option>
              {filteredCategorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="col-md-4">
          <label htmlFor="cantidad" className="form-label">
            Cantidad
          </label>
          <input
            type="number"
            className="form-control"
            id="cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            required
            placeholder="Cantidad de productos"
          />
          <small
            className={`text-danger error ${
              errores.cantidad ? "d-block" : "d-none"
            }`}
            id="errorCantidad"
          >
            <i className="bi bi-exclamation-lg"></i>
            <span>{errores.cantidad}</span>
          </small>
        </div>

        <div className="col-md-4">
          <label htmlFor="descripcion" className="form-label">
            Descripción
          </label>
          <input
            className="form-control"
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
            placeholder="Descripción del producto"
          />
          <small
            className={`text-danger error ${
              errores.descripcion ? "d-block" : "d-none"
            }`}
            id="errorDescripcion"
          >
            <i className="bi bi-exclamation-lg"></i>
            <span>{errores.descripcion}</span>
          </small>
        </div>

        <div className="col-md-4">
          <label htmlFor="precio_dia" className="form-label">
            Precio de Día
          </label>
          <div className="input-group">
            <span className="input-group-text">S/</span>
            <input
              type="number"
              className="form-control"
              id="precio_dia"
              value={precioDia}
              onChange={(e) => setPrecioDia(e.target.value)}
              required
              placeholder="Precio de día"
              step="0.01"
            />
          </div>
          <small
            className={`text-danger error ${
              errores.precioDia ? "d-block" : "d-none"
            }`}
            id="errorPrecioDia"
          >
            <i className="bi bi-exclamation-lg"></i>
            <span>{errores.precioDia}</span>
          </small>
        </div>

        <div className="col-md-4 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="precio_noche"
            checked={precioNocheVisible}
            onChange={handlePrecioNocheChange}
            placeholder="Precio de noche"
          />
          <label className="form-check-label" htmlFor="precio_noche">
            Precio de Noche
          </label>
        </div>

        {precioNocheVisible && (
          <div className="col-md-4">
            <label htmlFor="noche" className="form-label">
              Precio de Noche
            </label>
            <div className="input-group">
              <span className="input-group-text">S/</span>
              <input
                type="number"
                className="form-control"
                id="noche"
                value={precioNoche}
                onChange={(e) => setPrecioNoche(e.target.value)}
                step="0.01"
                placeholder="Precio de noche" // Placeholder agregado
              />
            </div>
            <small
              className={`text-danger error ${
                errores.precioNoche ? "d-block" : "d-none"
              }`}
              id="errorPrecioNoche"
            >
              <i className="bi bi-exclamation-lg"></i>
              <span>{errores.precioNoche}</span>
            </small>
          </div>
        )}

        <div className="col-12">
          <button
            type="submit"
            className="btn w-100"
            style={{ backgroundColor: "#dbebf8" }}
            disabled={isSubmitting}
          >
            <i className="bi bi-plus"></i>
            {isEditMode ? "Actualizar Producto" : "Agregar Producto"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductosForm;
