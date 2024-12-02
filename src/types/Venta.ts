import {Producto} from "./Producto";
import { Empleado } from "./Empleado";

export interface Venta{
    id: number;
    fechaVenta: string;
    empleado: Empleado;
    nombreCliente: string;
    producto: Producto;
    cantidad: number;
    total: number;
    metodoPago: string;
}