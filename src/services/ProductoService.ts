import axios from 'axios';
import { Producto } from '../types/Producto';

const API_URL = '/api/productos';

class ProductoService {
  getProductos() {
    return axios.get<Producto[]>(API_URL);
  }

  getProductoById(id: number) {
    return axios.get<Producto>(`${API_URL}/${id}`);
  }

  createProducto(producto: Producto) {
    return axios.post<Producto>(API_URL, producto);
  }

  updateProducto(id: number, producto: Producto) {
    return axios.put<Producto>(`${API_URL}/${id}`, producto);
  }

  deleteProducto(id: number) {
    return axios.delete<void>(`${API_URL}/${id}`);
  }
}

export default new ProductoService();