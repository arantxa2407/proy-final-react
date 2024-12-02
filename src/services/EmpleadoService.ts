import axios from 'axios';
import { Empleado } from '../types/Empleado';

// URL base para las operaciones de API relacionadas con estudiantes
const API_URL = '/api/empleados';

class EmpleadoService {
  // Obtiene todos los estudiantes
  getEmpleados() {
    return axios.get<Empleado[]>(API_URL);
  }

  // Obtiene un empleado específico por su ID
  getEmpleadoById(id: number) {
    return axios.get<Empleado>(`${API_URL}/${id}`);
  }

  // Crea un nuevo empleado
  createEmpleado(empleado: Empleado) {
    return axios.post<Empleado>(API_URL, empleado);
  }

  // Actualiza la información de un empleado existente
  updateEmpleado(id: number, empleado: Empleado) {
    return axios.put<Empleado>(`${API_URL}/${id}`, empleado);
  }

  // Elimina un empleado por su ID
  deleteEmpleado(id: number) {
    return axios.delete<void>(`${API_URL}/${id}`);
  }
}

// Exporta una instancia única del servicio para su uso en toda la aplicación
export default new EmpleadoService();