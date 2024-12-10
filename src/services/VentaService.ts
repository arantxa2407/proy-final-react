import axios from 'axios';
import { Venta } from '../types/Venta';

const API_URL = '/api/ventas';

class VentaService {
  getVentas() {
    return axios.get<Venta[]>(API_URL);
  }

  getVentaById(id: number) {
    return axios.get<Venta>(`${API_URL}/${id}`);
  }

  createVenta(venta: Venta) {
    return axios.post<Venta>(API_URL, venta);
  }

  updateVenta(id: number, venta: Venta) {
    return axios.put<Venta>(`${API_URL}/${id}`, venta);
  }

  deleteVenta(id: number) {
    return axios.delete<void>(`${API_URL}/${id}`);
  }

}

export default new VentaService();