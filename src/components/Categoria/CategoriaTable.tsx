import { useEffect, useState } from "react";
import CategoriaService from "../../services/CategoriaService";
import CategoriaForm from "./CategoriaForm";
import { Categoria } from "../../types/Categoria";

const CategoriaTable = () => {
  // Estados para manejar la lista de categoria y operaciones
  const [categoria, setCategoria] = useState<Categoria[]>([]);
  const [categoriaToEdit, setCategoriaToEdit] = useState<Categoria | undefined>(
    undefined
  );
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Cargar categoria al montar el componente
  useEffect(() => {
    fetchCategoria();
  }, []);

  // Función para obtener la lista de categoria
  const fetchCategoria = async () => {
    try {
      const response = await CategoriaService.getCategorias();
      setCategoria(response.data);
    } catch (error) {
      console.error("Error al cargar categoria:", error);
      // Aquí puedes agregar un toast o algún manejo de errores si es necesario
    }
  };

  // Manejador para añadir un nuevo categoria
  const handleCategoriaAdded = (newCategoria: Categoria) => {
    setCategoria([...categoria, newCategoria]);
  };

  // Manejador para actualizar un categoria existente
  const handleCategoriaUpdated = (updatedCategoria: Categoria) => {
    setCategoria(
      categoria.map((categoria) =>
        categoria.id === updatedCategoria.id ? updatedCategoria : categoria
      )
    );
    setCategoriaToEdit(undefined);
  };

  // Manejador para iniciar el proceso de edición
  const handleEditClick = (categoria: Categoria) => {
    setCategoriaToEdit(categoria);
  };

  // Manejador para iniciar el proceso de eliminación
  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setShowConfirmDelete(true);
  };

  // Manejador para confirmar la eliminación de un categoria
  const handleDeleteConfirm = async () => {
    if (deleteId) {
      try {
        await CategoriaService.deleteCategoria(deleteId);
        setCategoria(
          categoria.filter((categoria) => categoria.id !== deleteId)
        );
        setShowConfirmDelete(false);
        // Aquí puedes agregar un toast o algún manejo de éxito si es necesario
      } catch (error) {
        console.error("Error al eliminar el categoria:", error);
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
      <div className="container my-5">
        <div className="row d-flex justify-content-center">
          <div className="col-5">
            {" "}
            {/* Esto ocupa la mitad de la pantalla */}
            <CategoriaForm
              onCategoriaAdded={handleCategoriaAdded}
              onCategoriaUpdated={handleCategoriaUpdated}
              categoriaToEdit={categoriaToEdit}
            />{" "}
          </div>
          <div className="col-5">
            {" "}
            {/* Esto ocupa la mitad de la pantalla (mitad derecha) */}
            <h2>Lista de Categoria</h2>
            {categoria.length > 0 ? (
              <table id="tablaCategoria" className="table table-bordered mb-5">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categoria.map((categoria) => (
                    <tr key={categoria.id}>
                      <td>{categoria.id}</td>
                      <td>{categoria.nombre}</td>
                      <td>
                        <button
                          className="btn"
                          style={{
                            backgroundColor: " rgb(241, 241, 154)",
                            marginRight: "5px",
                          }}
                          onClick={() => handleEditClick(categoria)}
                        >
                          <i
                            className="bi bi-pencil"
                            style={{ marginRight: "5px" }}
                          ></i>
                          Editar
                        </button>
                        <button
                          className="btn"
                          onClick={() => handleDeleteClick(categoria.id)}
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
              <p>No hay categoria registrados</p>
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
                      <p>
                        ¿Estás seguro de que deseas eliminar este categoria?
                      </p>
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
        </div>
      </div>
    </>
  );
};

export default CategoriaTable;
