import { useEffect, useState } from "react";
import VentaService from "../../services/VentaService";
import { Venta } from "../../types/Venta";
import VentaForm from "./VentaForm";

const VentaTable = () => {
  // Estados para manejar la lista de ventas y operaciones
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [ventaToEdit, setVentaToEdit] = useState<Venta | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Cargar ventas al montar el componente
  useEffect(() => {
    fetchVentas();
  }, []);

  // Función para obtener la lista de ventas
  const fetchVentas = async () => {
    try {
      const response = await VentaService.getVentas();
      setVentas(response.data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      // Aquí puedes agregar un toast o algún manejo de errores si es necesario
    }
  };

  // Manejador para añadir un nuevo venta
  const handleVentaAdded = (newVenta: Venta) => {
    setVentas([...ventas, newVenta]);
  };

  // Manejador para actualizar un venta existente
  const handleVentaUpdated = (updatedVenta: Venta) => {
    setVentas(
      ventas.map((est) => (est.id === updatedVenta.id ? updatedVenta : est))
    );
    setVentaToEdit(undefined);
  };

  // Manejador para iniciar el proceso de edición
  const handleEditClick = (venta: Venta) => {
    setVentaToEdit(venta);
  };

  // Manejador para iniciar el proceso de eliminación
  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setShowConfirmDelete(true);
  };

  // Manejador para confirmar la eliminación de un venta
  const handleDeleteConfirm = async () => {
    if (deleteId) {
      try {
        await VentaService.deleteVenta(deleteId);
        setVentas(ventas.filter((venta) => venta.id !== deleteId));
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
      <VentaForm
        onVentaAdded={handleVentaAdded}
        onVentaUpdated={handleVentaUpdated}
        ventaToEdit={ventaToEdit}
      />

      <div className="container mt-4">
        <h2>Lista de Ventas</h2>
        {ventas.length > 0 ? (
          <table id="tablaVentas" className="table table-bordered mb-5">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Vendedor</th>
                <th>Cliente</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Total</th>
                <th>Metodo de pago</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((venta) => (
                <tr key={venta.id}>
                  <td>{venta.id}</td>
                  <td>{venta.fechaVenta}</td>
                  <td>
                    {venta.empleado.nombre} {venta.empleado.apellido}
                  </td>
                  <td>{venta.nombreCliente}</td>
                  <td>{venta.producto.nombre}</td>
                  <td>{venta.cantidad}</td>
                  <td>S/ {venta.total}</td>
                  <td>{venta.metodoPago}</td>
                  <td>
                    <button
                      className="btn"
                      style={{
                        backgroundColor: " rgb(241, 241, 154)",
                        marginRight: "5px",
                      }}
                      onClick={() => handleEditClick(venta)}
                    >
                      <i
                        className="bi bi-pencil"
                        style={{ marginRight: "5px" }}
                      ></i>
                      Editar
                    </button>
                    <button
                      className="btn"
                      onClick={() => handleDeleteClick(venta.id)}
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
          <p>No hay ventas registrados</p>
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
                  <p>¿Estás seguro de que deseas eliminar esta venta?</p>
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

export default VentaTable;
