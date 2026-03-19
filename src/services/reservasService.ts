import { supabase } from "../API/supabase";
import { Pasajeros } from "../models/types";

/* Funciones en el archivo Functions.Reservas.ts 
    -> Crear las reservas
    -> Obtiene mis reservas
    -> Cancela algua reserva
*/

// Crear reserva
export const crearReserva = async (
    usuarioID: string,
    rutaId: number,
    horario: string,
    asientos: string[],
    pasajeros: Pasajeros,
    totalPago: number
) => {
    return await supabase.from('reservas').insert([
        {
            usuario_id: usuarioID,
            ruta_id: rutaId,
            horario: horario,
            asientos: asientos,
            pasajeros: pasajeros,
            total_pago: totalPago,
            estado: 'confirmado'
        }
    ]).select();
};

// Obtener mis reservas
export const obtenerMisReservas = async (usuarioId: string) => {
    return await supabase
    .from('reservas')
    .select(`
        id,
        created_at,
        usuario_id,
        ruta_id,
        estado,
        horario,
        asientos,
        total_pago,
        rutas:rutas (
        id,
        origen,
        destino,
        precio,
        fecha_salida
      )
        `)
        .eq('usuario_id', usuarioId)
        .order('created_at', { ascending: false });
};

// Cancelar una reserva
export const cancelarReserva = async (reservaId: number, usuarioId: string) => {
    return await supabase
    .from('reservas')
    .update({ estado: 'cancelado' })
    .match({ id: Number(reservaId), usuario_id: usuarioId })
    .select('id, estado')
    .maybeSingle();
};