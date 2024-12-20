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
  const [edad, setEdad] = useState<string>(""); 
  const [telefono, setTelefono] = useState<string>("");
  const [turno, setTurno] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("2");
  const [errores, setErrores] = useState<{ [key: string]: string }>({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  // Función para generar el username automáticamente
  const generateUsername = (nombre: string, apellido: string): string => {
    const firstLetterName = nombre.charAt(0).toLowerCase();
    const firstApellido = apellido.split(" ")[0];
    const formattedApellido =
      firstApellido.charAt(0).toUpperCase() +
      firstApellido.slice(1).toLowerCase();
    return firstLetterName + formattedApellido;
  };

  // Efecto para generar el username cada vez que cambian nombre o apellido
  useEffect(() => {
    if (nombre && apellido) {
      setUsername(generateUsername(nombre, apellido));
    }
  }, [nombre, apellido]);

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const fetchEmpleados = async () => {
    try {
      const response = await EmpleadoService.getEmpleados();
      setEmpleados(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Efecto para cargar los datos del empleado a editar
  useEffect(() => {
    if (empleadoToEdit) {
      setNombre(empleadoToEdit.nombre);
      setApellido(empleadoToEdit.apellido);
      setGenero(empleadoToEdit.genero);
      setEdad(empleadoToEdit.edad.toString());
      setTelefono(empleadoToEdit.telefono.toString()); 
      setTurno(empleadoToEdit.turno);
      setCorreo(empleadoToEdit.correo);
      setDireccion(empleadoToEdit.direccion);
      setUsername(empleadoToEdit.username);
      setPassword("");
      setRoleId(
        empleadoToEdit.roles &&
          empleadoToEdit.roles.some((role) => role.nombre === "ADMIN")
          ? "1"
          : "2"
      );
      setIsEditMode(true);
    }
  }, [empleadoToEdit]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    let valido = true;
    const errores: { [key: string]: string } = {};

    // Validaciones
    if (nombre.length < 3 || !/^[a-zA-Z\s]+$/.test(nombre)) {
      valido = false;
      errores.nombre =
        "El nombre debe tener al menos 3 caracteres y solo contener letras.";
    }

    if (apellido.length < 3 || !/^[a-zA-Z\s]+$/.test(apellido)) {
      valido = false;
      errores.apellido =
        "El apellido debe tener al menos 3 caracteres y solo contener letras.";
    }

    if (edad === "" || parseInt(edad) < 18 || parseInt(edad) > 100) {
      valido = false;
      errores.edad =
        "Por favor, introduce una edad válida mayor de 18 años y menor de 100 años.";
    }

    if (telefono === "" || !/^9\d{8}$/.test(telefono)) {
      valido = false;
      errores.telefono =
        "El teléfono debe tener 9 dígitos y empezar con el número 9.";
    }

    if (direccion.length < 3) {
      valido = false;
      errores.direccion = "La dirección debe tener al menos 3 caracteres.";
    }

    if (
      password.length < 8 ||
      !/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&/+=]).+$/.test(password)
    ) {
      valido = false;
      errores.password =
        "La contraseña debe tener al menos 8 caracteres, un número, una letra minúscula, una letra mayúscula y un carácter especial.";
    }

    //con esta validacion comprobaremos que no se repita el nombre de usuario y le daremos alternativas
    function generateAlternativeUsernames(nombre: string, apellido: string) {
      const usernameBase = generateUsername(nombre, apellido);
      const alternative1 = `${usernameBase}${Math.floor(Math.random() * 100)}`;
      const alternative2 = `${usernameBase}${Math.floor(Math.random() * 100)}`;
      return [alternative1, alternative2];
    }

    if (!isEditMode) {
      if (
        correo ===
        empleados.find((empleado) => empleado.correo === correo)?.correo
      ) {
        valido = false;
        errores.correo = "El correo ya está registrado";
      }

      if (
        empleados.some((empleado) => empleado.username === username)
      ) {
        valido = false;
        const [alt1, alt2] = generateAlternativeUsernames(nombre, apellido);
        errores.username = `El nombre de usuario ya está registrado. Por favor elija otro, como por ejemplo: ${alt1} o ${alt2}.`;
      }
    }
    

    setErrores(errores);

    if (!valido) {
      setIsSubmitting(false);
      return;
    }

    const empleadoData: Omit<Empleado, "id"> & { roleId: number } = {
      nombre,
      apellido,
      genero,
      edad: parseInt(edad),
      telefono: parseInt(telefono),
      turno,
      correo,
      direccion,
      username,
      password,
      roleId: 2,
      roles:
        roleId === "1"
          ? [{ id: 1, nombre: "ADMIN" }]
          : [{ id: 2, nombre: "VENDEDOR" }],
    };

    try {
      if (isEditMode && empleadoToEdit) {
        const response = await EmpleadoService.updateEmpleado(
          empleadoToEdit.id!,
          empleadoData as Empleado
        );
        onEmpleadoUpdated(response.data);
      } else {
        const response = await EmpleadoService.createEmpleado(empleadoData);
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
    setUsername("");
    setPassword("");
    setRoleId("2");
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
            className={`text-danger error ${
              errores.apellido ? "d-block" : "d-none"
            }`}
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
            className={`text-danger error ${
              errores.edad ? "d-block" : "d-none"
            }`}
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
            className={`text-danger error ${
              errores.telefono ? "d-block" : "d-none"
            }`}
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
          <small
            className={`text-danger error ${
              errores.correo ? "d-block" : "d-none"
            }`}
            id="errorCorreo"
          >
            <i className="bi bi-exclamation-lg"></i>
            <span>{errores.correo}</span>
          </small>
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
            className={`text-danger error ${
              errores.direccion ? "d-block" : "d-none"
            }`}
            id="errorDireccion"
          >
            <i className="bi bi-exclamation-lg"></i>
            <span>{errores.direccion}</span>
          </small>
        </div>

        <div className="col-md-4">
          <label htmlFor="direccion" className="form-label">
            Rol
          </label>
          <select
            className="form-select"
            id="rol"
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            disabled
            required
          >
            <option value="" disabled>
              Selecciona una categoría
            </option>
            <option value="1">ADMIN</option>
            <option value="2">VENDEDOR</option>
          </select>
          <small
            className={`text-danger error ${
              errores.rol ? "d-block" : "d-none"
            }`}
            id="errorRol"
          >
            <i className="bi bi-exclamation-lg"></i>
            <span>{errores.rol}</span>
          </small>
        </div>

        <div className="col-md-4">
          <label htmlFor="direccion" className="form-label">
            Nombre usuario
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <small
            className={`text-danger error ${
              errores.username ? "d-block" : "d-none"
            }`}
            id="errorUsername"
          >
            <i className="bi bi-exclamation-lg"></i>
            <span>{errores.username}</span>
          </small>
        </div>

        <div className="col-md-4">
          <label htmlFor="direccion" className="form-label">
            Contraseña
          </label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"} 
              className="form-control"
              id="password"
              placeholder="Contraseña del empleado"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              id="button-addon1"
              onClick={() => setShowPassword(!showPassword)} 
            >
              <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
            </button>
          </div>
          <small
            className={`text-danger error ${errores.password ? "d-block" : "d-none"}`}
            id="errorPassword"
          >
            <i className="bi bi-exclamation-lg"></i>
            <span>{errores.password}</span>
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
