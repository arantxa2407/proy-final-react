import EmpleadoService from "../../services/EmpleadoService";
import { Empleado } from "../../types/Empleado";
import { useState, useEffect } from "react";

interface EmpleadoFormProps {
  onEmpleadoAdded: (empleado: Empleado) => void;
  onEmpleadoUpdated: (empleado: Empleado) => void;
  empleadoToEdit?: Empleado;
}

const EmpleadoForm: React.FC<EmpleadoFormProps> = ({
  onEmpleadoAdded,
  onEmpleadoUpdated,
  empleadoToEdit,
}) => {
  // Estados para los campos del formulario
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [genero, setGenero] = useState<string>("");
  const [edad, setEdad] = useState<string>("");  // Cambié el tipo de número a cadena
  const [telefono, setTelefono] = useState<string>("");  // Cambié el tipo de número a cadena
  const [turno, setTurno] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [errores, setErrores] = useState<{ [key: string]: string }>({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Efecto para cargar los datos del empleado a editar
  useEffect(() => {
    if (empleadoToEdit) {
      setNombre(empleadoToEdit.nombre);
      setApellido(empleadoToEdit.apellido);
      setGenero(empleadoToEdit.genero);
      setEdad(empleadoToEdit.edad.toString());  // Convierte la edad a string
      setTelefono(empleadoToEdit.telefono.toString());  // Convierte el teléfono a string
      setTurno(empleadoToEdit.turno);
      setCorreo(empleadoToEdit.correo);
      setDireccion(empleadoToEdit.direccion);
      setIsEditMode(true);
    }
  }, [empleadoToEdit]);

  // Función para manejar el envío del formulario
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    let valido = true;
    const errores: { [key: string]: string } = {};

    // Validaciones
    if (nombre.length < 3 || !/^[a-zA-Z\s]+$/.test(nombre)) {
      valido = false;
      errores.nombre = "El nombre debe tener al menos 3 caracteres y solo contener letras.";
    }

    if (apellido.length < 3 || !/^[a-zA-Z\s]+$/.test(apellido)) {
      valido = false;
      errores.apellido = "El apellido debe tener al menos 3 caracteres y solo contener letras.";
    }

    if (edad === "" || parseInt(edad) < 18) {
      valido = false;
      errores.edad = "Por favor, introduce una edad válida mayor de 18 años.";
    }

    if (telefono === "" || !/^9\d{8}$/.test(telefono)) {
      valido = false;
      errores.telefono = "El teléfono debe tener 9 dígitos y empezar con el número 9.";
    }

    if (direccion.length < 3) {
      valido = false;
      errores.direccion = "La dirección debe tener al menos 3 caracteres.";
    }

    setErrores(errores);

    if (!valido) {
      setIsSubmitting(false);
      return; // Prevenir el envío si hay errores
    }

    const empleadoData: Omit<Empleado, "id"> = {
      nombre,
      apellido,
      genero,
      edad: parseInt(edad),
      telefono: parseInt(telefono),
      turno,
      correo,
      direccion,
    };

    try {
      if (isEditMode && empleadoToEdit) {
        // Actualizar empleado existente
        const response = await EmpleadoService.updateEmpleado(
          empleadoToEdit.id,
          empleadoData as Empleado
        );
        onEmpleadoUpdated(response.data);
      } else {
        // Crear nuevo empleado
        const response = await EmpleadoService.createEmpleado(
          empleadoData as Empleado
        );
        onEmpleadoAdded(response.data);
      }
      resetForm();
    } catch (error) {
      console.error("Error al procesar el formulario", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para reiniciar el formulario
  const resetForm = () => {
    setNombre("");
    setApellido("");
    setGenero("");
    setEdad("");
    setTelefono("");
    setTurno("");
    setCorreo("");
    setDireccion("");
    setIsEditMode(false);
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">
        {isEditMode ? "Editar Empleado" : "Agregar Empleado"}
      </h2>
      <form className="row g-3" id="empleadoForm" onSubmit={handleSubmit}>
        <div className="col-md-4">
          <label htmlFor="nombre" className="form-label">
            Nombres
          </label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            placeholder="Nombres del empleado"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <small
            className={`text-danger error ${errores.nombre ? "d-block" : "d-none"}`}
            id="errorNombre"
          >
            <i className="bi bi-exclamation-lg"></i>
            <span>{errores.nombre}</span>
          </small>
        </div>

        <div className="col-md-4">
          <label htmlFor="apellido" className="form-label">
            Apellidos
          </label>
          <input
            type="text"
            className="form-control"
            id="apellido"
            placeholder="Apellidos del empleado"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            required
          />
          <small
            className={`text-danger error ${errores.apellido ? "d-block" : "d-none"}`}
            id="errorApellido"
          >
            <i className="bi bi-exclamation-lg"></i>
            <span>{errores.apellido}</span>
          </small>
        </div>

        <div className="col-md-4">
          <label className="form-label">Género</label>
          <div className="d-flex align-items-center">
            <div className="form-check me-3">
              <input
                type="radio"
                id="masculino"
                name="genero"
                value="masculino"
                className="form-check-input"
                checked={genero === "masculino"}
                onChange={(e) => setGenero(e.target.value)}
                required
              />
              <label htmlFor="masculino" className="form-check-label">
                Masculino
              </label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                id="femenino"
                name="genero"
                value="femenino"
                className="form-check-input"
                checked={genero === "femenino"}
                onChange={(e) => setGenero(e.target.value)}
              />
              <label htmlFor="femenino" className="form-check-label">
                Femenino
              </label>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <label htmlFor="edad" className="form-label">
            Edad
          </label>
          <input
            type="number"
            className="form-control"
            id="edad"
            placeholder="Edad del empleado"
            value={edad || ""}
            onChange={(e) => setEdad(e.target.value)}
            required
          />
          <small
            className={`text-danger error ${errores.edad ? "d-block" : "d-none"}`}
            id="errorEdad"
          >
            <i className="bi bi-exclamation-lg"></i>
            <span>{errores.edad}</span>
          </small>
        </div>

        <div className="col-md-4">
          <label htmlFor="telefono" className="form-label">
            Teléfono
          </label>
          <input
            type="tel"
            className="form-control"
            id="telefono"
            placeholder="Teléfono del empleado"
            value={telefono || ""}
            onChange={(e) => setTelefono(e.target.value)}
            required
          />
          <small
            className={`text-danger error ${errores.telefono ? "d-block" : "d-none"}`}
            id="errorTelefono"
          >
            <i className="bi bi-exclamation-lg"></i>
            <span>{errores.telefono}</span>
          </small>
        </div>

        <div className="col-md-4">
          <label htmlFor="turno" className="form-label">
            Turno
          </label>
          <select
            id="turno"
            className="form-select"
            value={turno}
            onChange={(e) => setTurno(e.target.value)}
            required
          >
            <option value="" disabled>
              Selecciona un turno
            </option>
            <option value="mañana">Mañana</option>
            <option value="tarde">Tarde</option>
            <option value="noche">Noche</option>
          </select>
        </div>

        <div className="col-md-4">
          <label htmlFor="correo" className="form-label">
            Correo
          </label>
          <input
            type="email"
            className="form-control"
            id="correo"
            placeholder="Correo del empleado"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>

        <div className="col-md-4">
          <label htmlFor="direccion" className="form-label">
            Dirección
          </label>
          <input
            type="text"
            className="form-control"
            id="direccion"
            placeholder="Dirección del empleado"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
          />
          <small
            className={`text-danger error ${errores.direccion ? "d-block" : "d-none"}`}
            id="errorDireccion"
          >
            <i className="bi bi-exclamation-lg"></i>
            <span>{errores.direccion}</span>
          </small>
        </div>

        <div className="col-12">
          <button
            type="submit"
            className="btn w-100"
            style={{ backgroundColor: "#dbebf8" }}
            disabled={isSubmitting}
          >
            <i className="bi bi-plus"></i>
            {isEditMode ? "Actualizar empleado" : "Agregar nuevo empleado"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmpleadoForm;
