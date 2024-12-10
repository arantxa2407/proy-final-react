import { useState, useEffect } from "react";
import { Categoria } from "../../types/Categoria";
import CategoriaService from "../../services/CategoriaService";

interface CategoriaFormProps {
  onCategoriaAdded: (categoria: Categoria) => void;
  onCategoriaUpdated: (categoria: Categoria) => void;
  categoriaToEdit?: Categoria;
}

const CategoriaForm: React.FC<CategoriaFormProps> = ({
  onCategoriaAdded,
  onCategoriaUpdated,
  categoriaToEdit,
}) => {
  // Estados para los campos del formulario
  const [nombre, setNombre] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errores, setErrores] = useState<{ [key: string]: string }>({});

  // Efecto para cargar los datos del categoria a editar
  useEffect(() => {
    if (categoriaToEdit) {
      setNombre(categoriaToEdit.nombre);
      setIsEditMode(true);
    }
  }, [categoriaToEdit]);

  // Función para manejar el envío del formulario
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    let valido = true;
    const errores: { [key: string]: string } = {};

    if (nombre.length < 3 || !/^[a-zA-Z\s]+$/.test(nombre)) {
      valido = false;
      errores.nombre = "El nombre debe tener al menos 3 caracteres y solo contener letras.";
    }

    setErrores(errores);

    if (!valido) {
      setIsSubmitting(false);
      return; 
    }

    const categoriaData: Omit<Categoria, "id"> = {
      nombre,
    };

    try {
      if (isEditMode && categoriaToEdit) {
        const response = await CategoriaService.updateCategoria(
          categoriaToEdit.id,
          categoriaData as Categoria
        );
        onCategoriaUpdated(response.data);
      } else {
        const response = await CategoriaService.createCategoria(
          categoriaData as Categoria
        );
        onCategoriaAdded(response.data);
      }
      resetForm();
    } catch (error) {
      console.error("Error al guardar el categoria:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para reiniciar el formulario
  const resetForm = () => {
    setNombre("");
    setIsEditMode(false);
  };

  return (
    <>
      <h2 className="mb-4">
        {isEditMode ? "Editar Categoria" : "Agregar Categoria"}
      </h2>
      <form className="row g-3" onSubmit={handleSubmit} id="categoriasForm">
        <div className="col-md-9">
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
            placeholder="Nombre del categoria"
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

        <div className="col-12">
          <button
            type="submit"
            className="btn w-75"
            style={{ backgroundColor: "#dbebf8" }}
            disabled={isSubmitting}
          >
            <i className="bi bi-plus"></i>
            {isEditMode ? "Actualizar Categoria" : "Agregar Categoria"}
          </button>
        </div>
      </form>
    </>
  );
};

export default CategoriaForm;
