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
    horarios?: string[];
    fecha_salida: string;
}
export type EstadoReserva = 'confirmado' | 'cancelado';

export interface Reserva {
    id?: number;
    usuario_id: string;
    ruta_id: number;
    cantidad?: number;
    estado?: EstadoReserva;
    created_at?: string;
    rutas?: Ruta;
}

export interface AuthContextType {
    user: User | null;
    role: string | null;
    loading: boolean;
}

export interface ProtectedRouteProps extends RouteProps {
    component: React.ComponentType;
    requiredRole?: 'admin' | 'usuario';
}



// Fila cruda que regresa Supabase (la usamos para mapear a Reserva)
/*export interface ReservaRow {
  id: number;
  created_at: string | null;
  usuario_id: string;
  ruta_id: number;
  cantidad: number | null;
  estado: EstadoReserva | null;
  rutas?: Ruta;
}
*/