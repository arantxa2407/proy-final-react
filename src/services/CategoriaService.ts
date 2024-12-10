import axios from 'axios';
import { Categoria } from '../types/Categoria';

const API_URL = '/api/categorias';

class CategoriaService {
  getCategorias() {
    return axios.get<Categoria[]>(API_URL);
  }

  getCategoriaById(id: number) {
    return axios.get<Categoria>(`${API_URL}/${id}`);
  }

  createCategoria(categoria: Categoria) {
    return axios.post<Categoria>(API_URL, categoria);
  }

  updateCategoria(id: number, categoria: Categoria) {
    return axios.put<Categoria>(`${API_URL}/${id}`, categoria);
  }

  deleteCategoria(id: number) {
    return axios.delete<void>(`${API_URL}/${id}`);
  }
}

export default new CategoriaService();