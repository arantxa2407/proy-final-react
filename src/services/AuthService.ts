// src/services/AuthService.ts
import axios from 'axios';
import { Empleado } from '../types/Empleado';

// URL base para la autenticación
const API_URL = '/authenticate';

class AuthService {
  // Método para iniciar sesión
  async login(username: string, password: string): Promise<Empleado | null> {
    try {
      const response = await axios.post<{ token: string; empleado: Empleado }>(API_URL, null, {
        params: { username, password }
      });

      // Verificar que la respuesta contiene los datos esperados
      if (response.data && response.data.token && response.data.empleado) {
        const empleadoData: Empleado = {
          username,
          token: response.data.token,
          id: response.data.empleado.id,
          nombre: response.data.empleado.nombre,
          apellido: response.data.empleado.apellido,
          genero: response.data.empleado.genero,
          edad: response.data.empleado.edad,
          telefono: response.data.empleado.telefono,
          turno: response.data.empleado.turno,
          correo: response.data.empleado.correo,
          direccion: response.data.empleado.direccion,
          roles: response.data.empleado.roles
        };

        // Guardar datos del empleado en localStorage
        localStorage.setItem('empleado', JSON.stringify(empleadoData));

        // Configurar el token en los headers de Axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${empleadoData.token}`;

        return empleadoData;
      }

      throw new Error('No se recibió un token válido o empleado en la respuesta del servidor.');

    } catch (error) {

      console.error("Error de autenticación:", error);
      // Retornamos un mensaje de error genérico si no es un error de Axios
      throw new Error('Credenciales inválidas o error en la comunicación con el servidor');
    }
  }

  // Método para cerrar sesión
  logout() {
    localStorage.removeItem('empleado');
    delete axios.defaults.headers.common['Authorization'];
  }

  // Método para obtener el empleado actual
  getCurrentEmpleado(): Empleado | null {
    const empleadoStr = localStorage.getItem('empleado');
    if (empleadoStr) {
      const empleado: Empleado = JSON.parse(empleadoStr);
      console.log("Empleado recuperado desde localStorage:", empleado); // Verificar si roles están presentes
      axios.defaults.headers.common['Authorization'] = `Bearer ${empleado.token}`;
      return empleado;
    }
    return null;
  }

  
  }

export default new AuthService();
