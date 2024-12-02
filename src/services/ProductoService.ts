import axios from 'axios';
import { Producto } from '../types/Producto';

// URL base para las operaciones de API relacionadas con estudiantes
const API_URL = '/api/productos';

class ProductoService {
  // Obtiene todos los estudiantes
  getProductos() {
    return axios.get<Producto[]>(API_URL);
  }

  // Obtiene un producto específico por su ID
  getProductoById(id: number) {
    return axios.get<Producto>(`${API_URL}/${id}`);
  }

  // Crea un nuevo producto
  createProducto(producto: Producto) {
    return axios.post<Producto>(API_URL, producto);
  }

  // Actualiza la información de un producto existente
  updateProducto(id: number, producto: Producto) {
    return axios.put<Producto>(`${API_URL}/${id}`, producto);
  }

  // Elimina un producto por su ID
  deleteProducto(id: number) {
    return axios.delete<void>(`${API_URL}/${id}`);
  }
}

// Exporta una instancia única del servicio para su uso en toda la aplicación
export default new ProductoService();