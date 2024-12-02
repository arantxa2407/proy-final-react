// src/services/AuthService.ts
import axios from 'axios';
import { Usuario } from '../types/Usuario';

// URL base para la autenticación
const API_URL = '/api/usuarios';

class UsuariosService {
  // Método para iniciar sesión
  async login(nombre: string, password: string): Promise<Usuario | null> {
    try {
      const response = await axios.post(API_URL, 
        { nombre, password }, // Enviar en el cuerpo de la solicitud
        {
          headers: {
            'Content-Type': 'application/json', // Asegúrate de especificar que los datos son JSON
          },
        }
      );
  
      const data = response.data as { id: number; password: string };
      if (data.password) {
        const id = data.id;
        const userData: Usuario = { id, nombre, password: data.password };
        // Guardar datos del usuario en localStorage
        localStorage.setItem('usuario', JSON.stringify(userData));
        // Configurar el token en los headers de Axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${userData.password}`;
        return userData;
      }
      return null;
    } catch (error) {
      throw new Error('Credenciales inválidas');
    }
  }
  

  // Método para cerrar sesión
  logout() {
    localStorage.removeItem('usuario');
    delete axios.defaults.headers.common['Authorization'];
  }

  // Método para obtener el usuario actual
  getCurrentUser(): Usuario | null {
    const userStr = localStorage.getItem('usuario');
    if (userStr) {
      const usuario: Usuario = JSON.parse(userStr);
      // Restaurar el token en los headers de Axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${usuario.password}`;
      return usuario;
    }
    return null;
  }
}

// Exportar una instancia única del servicio
export default new UsuariosService();