import { useState, useEffect } from "react";
import VentaService from "../../services/VentaService";
import { Venta } from "../../types/Venta";
import { Empleado } from "../../types/Empleado";
import { Producto } from "../../types/Producto";
import EmpleadoService from "../../services/EmpleadoService";
import ProductoService from "../../services/ProductoService";
import "../../css/productos.css";

interface VentaFormProps {
  onVentaAdded: (venta: Venta) => void;
  onVentaUpdated: (venta: Venta) => void;
  ventaToEdit?: Venta;
}

const VentaForm: React.FC<VentaFormProps> = ({
  onVentaAdded,
  onVentaUpdated,
  ventaToEdit,
}) => {
  const [fechaVenta, setFechaVenta] = useState("");
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<
    number | string
  >("");

  const [nombreCliente, setNombreCliente] = useState("");
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<
    number | string
  >("");
  const [cantidad, setCantidad] = useState<number | string>(""); 
  const [total, setTotal] = useState<number | string>(""); 
  const [metodoPago, setMetodoPago] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errores, setErrores] = useState<{ [key: string]: string }>({});
  const [horaActual, setHoraActual] = useState<number>(new Date().getHours());
  const [searchProducto, setSearchProducto] = useState(""); 

  useEffect(() => {
    const intervalo = setInterval(() => {
      setHoraActual(new Date().getHours());
    }, 36000000);

    return () => clearInterval(intervalo);
  }, []);

  const esHoraDeNoche = horaActual >= 22 || horaActual < 5;

  useEffect(() => {
    fetchEmpleados();
    fetchProductos();
  }, []);

  const fetchEmpleados = async () => {
    try {
      const response = await EmpleadoService.getEmpleados();
      setEmpleados(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProductos = async () => {
    try {
      const response = await ProductoService.getProductos();
      setProductos(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (ventaToEdit) {
      setEmpleadoSeleccionado(ventaToEdit.empleado.id!);
      setNombreCliente(ventaToEdit.nombreCliente);
      setProductoSeleccionado(ventaToEdit.producto.id);
      setCantidad(ventaToEdit.cantidad);
      setTotal(ventaToEdit.total);
      setMetodoPago(ventaToEdit.metodoPago);
      setIsEditMode(true);
    }
  }, [ventaToEdit]);

  const handleProductoChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setProductoSeleccionado(Number(event.target.value)); 
  };

  const handleEmpleadoChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setEmpleadoSeleccionado(Number(event.target.value)); 
  };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchProducto(event.target.value); 
    };
  
    const filteredProductos = productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(searchProducto.toLowerCase())
    );
  
  useEffect(() => {
    if (productoSeleccionado) {
      setTotal( 
        esHoraDeNoche 
          ? Number(cantidad) * productos.find((prod) => prod.id === productoSeleccionado)?.precio_noche! 
          : Number(cantidad) * productos.find((prod) => prod.id === productoSeleccionado)?.precio_dia! 
      );
    }
  }, [cantidad, productoSeleccionado]);

  useEffect(() => {
    const now = new Date();
    const fechaFormateada = now.toISOString(); 
    setFechaVenta(fechaFormateada);
  }, []);
  

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    let valido = true;
    const errores: { [key: string]: string } = {};
  
    if (nombreCliente.length < 3 || !/^[a-zA-Z\s]+$/.test(nombreCliente)) {
      valido = false;
      errores.nombreCliente = 'El nombre debe tener al menos 3 caracteres y solo contener letras.';
    }
  
    if (Number(cantidad) <= 0 || Number(cantidad) > productos.find((prod) => prod.id === productoSeleccionado)?.cantidad!) {
      valido = false;
      errores.cantidad = 'La cantidad debe ser mayor que cero y tampoco debe de sobrepasar el stock disponible.';
    }
  
    if (Number(total) <= 0) {
      valido = false;
      errores.total = 'El total debe ser mayor que cero.';
    }
  
    setErrores(errores);
  
    if (!valido) {
      setIsSubmitting(false);
      return; 
    }
  
    const ventaData: Omit<Venta, "id"> = {
      fechaVenta: fechaVenta, 
      empleado: empleados.find((empleado) => empleado.id === empleadoSeleccionado)!,
      nombreCliente,
      producto: productos.find((producto) => producto.id === productoSeleccionado)!,
      cantidad: Number(cantidad),
      total: Number(total),
      metodoPago,
    };
  
    try {
      if (isEditMode && ventaToEdit) {
        const response = await VentaService.updateVenta(
          ventaToEdit.id,
          ventaData as Venta
        );
        onVentaUpdated(response.data);
      } else {
        const response = await VentaService.createVenta(ventaData as Venta);
        onVentaAdded(response.data);
      }
      resetForm();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const resetForm = () => {
    setEmpleadoSeleccionado("");
    setNombreCliente("");
    setProductoSeleccionado("");
    setCantidad("");
    setTotal("");
    setMetodoPago("");
    setIsEditMode(false);
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">Agregar Venta</h2>
      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-md-4">
          <label htmlFor="vendedor" className="form-label">
            Vendedor
          </label>
          <select
            className="form-select"
            id="vendedor"
            required
            value={empleadoSeleccionado}
            onChange={handleEmpleadoChange}
          >
            <option value="" disabled>
              Selecciona un vendedor
            </option>
            {empleados.map((empleado) => (
              <option key={empleado.id} value={empleado.id}>
                {empleado.apellido}, {empleado.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <label htmlFor="cliente" className="form-label">
            Cliente
          </label>
          <input
            type="text"
            className="form-control"
            id="cliente"
            placeholder="Nombre del cliente"
            value={nombreCliente}
            onChange={(e) => setNombreCliente(e.target.value)}
            required
          />
          <small
            className={`text-danger error ${errores.nombreCliente ? "d-block" : "d-none"}`}
            id="errorNombre"
          >
            <i className="bi bi-exclamation-lg"></i>
            <span>{errores.nombreCliente}</span>
          </small>
        </div>

        <div className="col-md-4">
          <label htmlFor="producto" className="form-label">
            Producto
          </label>
          <div className="input-group">

          <input
              type="text"
              className="form-control"
              id="searchProducto"
              placeholder="Buscar producto"
              value={searchProducto}
              onChange={handleSearchChange}
            />
          <select
            className="form-select"
            id="producto"
            required
            value={productoSeleccionado}
            onChange={handleProductoChange}
          >
              <option value="">Seleccione un producto</option>
              {filteredProductos.map((producto) => (
                <option key={producto.id} value={producto.id}>
                  {producto.nombre}
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
            placeholder="Cantidad de productos"
            required
          />
          <small
            className={`text-danger error ${errores.cantidad ? "d-block" : "d-none"}`}
            id="errorCantidad"
          >
            <i className="bi bi-exclamation-lg"></i>
            <span>{errores.cantidad}</span>
          </small>
        </div>

        <div className="col-md-4">
          <label htmlFor="total" className="form-label">
            Total
          </label>
          <div className="input-group">
            <span className="input-group-text">S/</span>
            <input
              type="number"
              className="form-control"
              id="total"
              value={total}
              readOnly
              placeholder="Total de la venta"
              disabled
            />
          </div>
            <small
              className={`text-danger error ${errores.total ? "d-block" : "d-none"}`}
              id="errorCantidad"
            >
              <i className="bi bi-exclamation-lg"></i>
              <span>{errores.total}</span>
            </small>
        </div>

        <div className="col-md-4">
          <label htmlFor="metodo_pago" className="form-label">
            Método de Pago
          </label>
          <select
            className="form-select"
            id="metodoPago"
            required
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
          >
            <option value="" disabled>
              Selecciona un método
            </option>
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>

        <div className="col-12">
          <button
            type="submit"
            className="btn w-100"
            style={{ backgroundColor: "#dbebf8" }}
            disabled={isSubmitting}
          >
            <i className="bi bi-plus"></i>
            {isEditMode ? "Actualizar Venta" : "Agregar Venta"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VentaForm;
