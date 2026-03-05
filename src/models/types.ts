import { User } from '@supabase/supabase-js';
import { RouteProps } from 'react-router-dom';
export interface Horario {
    salida: string;
    llegada: string;
    cupo: number;
}

export interface Ruta {
    id?: number;
    origen: string;
    destino: string;
    precio: number;
    duracion?: string;
    horarios?: Horario[];
    fecha_salida: string;
}

export interface Reserva {
    id?: number;
    usuario_id: string;
    ruta_id: number;
    created_at?: string;
    rutas?: Ruta;
}

export interface AuthContextType {
    user: User | null;
    role: string | null;
    loading: boolean;
}

export interface ProtectedRouteProps extends RouteProps {
    requiredRole?: 'admin' | 'usuario';
}
