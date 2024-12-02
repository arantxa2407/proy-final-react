import axios from 'axios';
import { Categoria } from '../types/Categoria';

// URL base para las operaciones de API relacionadas con estudiantes
const API_URL = '/api/categorias';

class CategoriaService {
  // Obtiene todos los estudiantes
  getCategorias() {
    return axios.get<Categoria[]>(API_URL);
  }

  // Obtiene un categoria específico por su ID
  getCategoriaById(id: number) {
    return axios.get<Categoria>(`${API_URL}/${id}`);
  }

  // Crea un nuevo categoria
  createCategoria(categoria: Categoria) {
    return axios.post<Categoria>(API_URL, categoria);
  }

  // Actualiza la información de un categoria existente
  updateCategoria(id: number, categoria: Categoria) {
    return axios.put<Categoria>(`${API_URL}/${id}`, categoria);
  }

  // Elimina un categoria por su ID
  deleteCategoria(id: number) {
    return axios.delete<void>(`${API_URL}/${id}`);
  }
}

// Exporta una instancia única del servicio para su uso en toda la aplicación
export default new CategoriaService();