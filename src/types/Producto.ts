import { Categoria } from "./Categoria";

export interface Producto {
  id: number;
  nombre: string;
  proveedor: string;
  fecha_ingreso: string;
  categoria: Categoria;
  cantidad: number;
  descripcion: string;
  precio_dia: number;
  precio_noche: number;
}