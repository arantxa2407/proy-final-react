import axios from 'axios';
import AuthService from '../services/AuthService';


axios.interceptors.response.use(
  // Función para manejar respuestas exitosas
  response => response,
  // Función para manejar errores
  error => {
    // Verificar si el error es de tipo 401 (No autorizado)
    if (error.response?.status === 401) {
      // Cerrar sesión del usuario
      AuthService.logout();
      // Redirigir al usuario a la página principal
      window.location.href = '/';
    }
    // Rechazar la promesa con el error
    return Promise.reject(error);
  }
);