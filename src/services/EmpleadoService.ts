import axios from "axios";
import { Empleado } from "../types/Empleado";
import { Rol } from "../types/Rol";

// URL base para las operaciones de API relacionadas con estudiantes
const API_URL = "/api/empleados";

class EmpleadoService {
  // Obtiene todos los estudiantes
  getEmpleados() {
    return axios.get<Empleado[]>(API_URL);
  }

  getEmpleadoById(id: number) {
    return axios.get<Empleado>(`${API_URL}/${id}`);
  }

  createEmpleado(empleado: Omit<Empleado, "id"> & { roleId: number }) {
    const userData = {
      username: empleado.username,
      password: empleado.password,
      nombre: empleado.nombre,
      apellido: empleado.apellido,
      correo: empleado.correo,
      telefono: empleado.telefono,
      direccion: empleado.direccion,
      turno: empleado.turno,
      genero: empleado.genero,
      edad: empleado.edad,
      // Asegúrate de que `roles` se pase correctamente, tal vez un valor por defecto
      roles: [{ id: parseInt(empleado.roleId?.toString() || "2") }],
      // Si es necesario un rol predeterminado
    };

    return axios.post<Empleado>(API_URL, userData);
  }

  updateEmpleado(
    id: number,
    empleado: Partial<Empleado> & { roleId?: string }
  ) {
    const userData: {
      username: string | undefined;
      nombre: string | undefined;
      apellido: string | undefined;
      correo: string | undefined;
      telefono: number | undefined;
      direccion: string | undefined;
      turno: string | undefined;
      genero: string | undefined;
      edad: number | undefined;
      roles: { id: number }[];
      password?: string;
    } = {
      username: empleado.username,
      nombre: empleado.nombre,
      apellido: empleado.apellido,
      roles: [{ id: parseInt(empleado.roleId || "2") }],
      correo: empleado.correo,
      telefono: empleado.telefono,
      direccion: empleado.direccion,
      turno: empleado.turno,
      genero: empleado.genero,
      edad: empleado.edad,
    };

    if (empleado.password) {
      userData["password"] = empleado.password;
    }

    return axios.put<Empleado>(`${API_URL}/${id}`, userData);
  }

  deleteEmpleado(id: number) {
    return axios.delete<void>(`${API_URL}/${id}`);
  }

  getRoles() {
    return axios.get<Rol[]>("/api/roles");
  }

  // Obtiene un empleado específico por su ID
  getRolById(id: number) {
    return axios.get<Rol>(`/api/roles/${id}`);
  }
}

// Exporta una instancia única del servicio para su uso en toda la aplicación
export default new EmpleadoService();
