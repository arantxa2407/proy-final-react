import { useEffect, useState } from "react";
import EmpleadoService from "../../services/EmpleadoService";
import EmpleadosForm from "./EmpleadoForm";
import { Empleado } from "../../types/Empleado";

const EmpleadoTable = () => {
  // Estados para manejar la lista de empleados y operaciones
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [empleadoToEdit, setEmpleadoToEdit] = useState<Empleado | undefined>(
    undefined
  );
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);


  // Cargar empleados al montar el componente
  useEffect(() => {
    fetchEmpleados();
  }, []);

  // Función para obtener la lista de empleados
  const fetchEmpleados = async () => {
    try {
      const response = await EmpleadoService.getEmpleados();
      setEmpleados(response.data);
    } catch (error) {
      console.error("Error al cargar los empleados", error);
      // Aquí podrías mostrar un mensaje de error si lo deseas
    }
  };

  // Manejador para añadir un nuevo empleado
  const handleEmpleadoAdded = (newEmpleado: Empleado) => {
    setEmpleados([...empleados, newEmpleado]);
  };

  // Manejador para actualizar un empleado existente
  const handleEmpleadoUpdated = (updatedEmpleado: Empleado) => {
    setEmpleados(
      empleados.map((est) =>
        est.id === updatedEmpleado.id ? updatedEmpleado : est
      )
    );
    setEmpleadoToEdit(undefined); // Resetear modo de edición
  };

    // Manejador para iniciar el proceso de edición
    const handleEditClick = (empleado: Empleado) => {
      setEmpleadoToEdit(empleado);
    };
  

  // Manejador para iniciar el proceso de eliminación
  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setShowConfirmDelete(true);
  };

  // Manejador para confirmar la eliminación de un empleado
  const handleDeleteConfirm = async () => {
    if (deleteId) {
      try {
        await EmpleadoService.deleteEmpleado(deleteId);
        setEmpleados(empleados.filter((empleado) => empleado.id !== deleteId));
        setShowConfirmDelete(false);
      } catch (error) {
        console.error("Error al eliminar el empleado", error);
        // Aquí podrías mostrar un mensaje de error si lo deseas
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
        {/* Formulario para agregar o editar un empleado */}
        <EmpleadosForm
          onEmpleadoAdded={handleEmpleadoAdded}
          onEmpleadoUpdated={handleEmpleadoUpdated}
          empleadoToEdit={empleadoToEdit}
        />
      <div className="container mt-4">
        <h2>Lista de Empleados</h2>
        

        {empleados.length > 0 ? (
          <table id="tablaEmpleados" className="table table-bordered mb-5">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Genero</th>
                <th>Edad</th>
                <th>Teléfono</th>
                <th>Turno</th>
                <th>Correo</th>
                <th>Direccion</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empleados.map((empleado) => (
                <tr key={empleado.id}>
                  <td>{empleado.id}</td>
                  <td>{empleado.nombre}</td>
                  <td>{empleado.apellido}</td>
                  <td>{empleado.genero}</td>
                  <td>{empleado.edad}</td>
                  <td>{empleado.telefono}</td>
                  <td>{empleado.turno}</td>
                  <td>{empleado.correo}</td>
                  <td>{empleado.direccion}</td>
                  <td>
                    <button
                      className="btn"
                      style={{ backgroundColor: "rgb(241, 241, 154)", marginRight: "5px" }}
                      onClick={() => handleEditClick(empleado)}
                    >
                      <i className="bi bi-pencil" style={{ marginRight: "5px" }}></i>
                      Editar
                    </button>
                    <button
                      className="btn"
                      onClick={() => handleDeleteClick(empleado.id)}
                      style={{ backgroundColor: "#ed7e7e" }}
                    >
                      <i className="bi bi-trash" style={{ marginRight: "5px" }}></i>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay empleados registrados</p>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      {showConfirmDelete && (
        <div className="modal" style={{ display: "block" }} tabIndex={-1}>
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
                <p>¿Estás seguro de que deseas eliminar este empleado?</p>
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
    </>
  );
};

export default EmpleadoTable;
