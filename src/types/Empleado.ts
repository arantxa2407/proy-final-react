import { Rol } from "./Rol";

export interface Empleado{
    id?: number;
    username: string;
    password?: string;
    token?: string;
    roles?: Rol[];
    nombre: string;
    apellido: string;
    genero: string;
    edad: number;
    telefono: number;
    turno: string;
    correo: string;
    direccion: string;
}