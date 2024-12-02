import axios from 'axios';
import { Venta } from '../types/Venta';

// URL base para las operaciones de API relacionadas con estudiantes
const API_URL = '/api/ventas';

class VentaService {
  // Obtiene todos los estudiantes
  getVentas() {
    return axios.get<Venta[]>(API_URL);
  }

  // Obtiene un venta específico por su ID
  getVentaById(id: number) {
    return axios.get<Venta>(`${API_URL}/${id}`);
  }

  // Crea un nuevo venta
  createVenta(venta: Venta) {
    return axios.post<Venta>(API_URL, venta);
  }

  // Actualiza la información de un venta existente
  updateVenta(id: number, venta: Venta) {
    return axios.put<Venta>(`${API_URL}/${id}`, venta);
  }

  // Elimina un venta por su ID
  deleteVenta(id: number) {
    return axios.delete<void>(`${API_URL}/${id}`);
  }

    // // Actualiza la cantidad de un producto después de una venta
    // updateCantidadProducto(id: number, cantidadVendida: number) {
    //   return axios.patch(`${API_URL}/${id}/cantidad`, null, {
    //     params: { cantidadVendida } // Enviar la cantidad vendida como un parámetro
    //   });
    // }
  
}

// Exporta una instancia única del servicio para su uso en toda la aplicación
export default new VentaService();