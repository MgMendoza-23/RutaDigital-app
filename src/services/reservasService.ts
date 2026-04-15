import { supabase } from "../API/supabase";
import { Pasajeros } from "../models/types";

/* Funciones en el archivo Functions.Reservas.ts 
    -> Crear las reservas
    -> Obtención de mis reservas
    -> Cancelación de reserva
    -> Obtención de asientos ocupados
*/

// Crear reserva
export const crearReserva = async (
    usuarioID: string,
    rutaId: number,
    horario: string,
    asientos: string[],
    pasajeros: Pasajeros,
    totalPago: number,
    nombreResponsable: string,
    telefonoResponsable: string
) => {
    return await supabase.from('reservas').insert([
        {
            usuario_id: usuarioID,
            ruta_id: rutaId,
            horario: horario,
            asientos: asientos,
            pasajeros: pasajeros,
            total_pago: totalPago,
            estado: 'confirmado',
            nombre_responsable: nombreResponsable,
            telefono_responsable: telefonoResponsable
        }
    ])
    .select('*, rutas(*)')
    .single();
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

// Obtener asientos ocupados
export const obtenerAsientosOcupados = async (rutaId: number, horario: string) => {
    try {
        const { data, error } = await supabase
            .from('reservas')
            .select('asientos')
            .eq('ruta_id', rutaId)
            .eq('horario', horario)
            .eq('estado', 'confirmado');

        if (error) {
            console.error("Error de Supabase:", error);
            return { data: [], error };
        }

        // Si data es null o está vacío, retornamos arreglo vacío de inmediato
        if (!data || data.length === 0) {
            return { data: [], error: null };
        }

        const asientos = data.flatMap(reserva => {
            const as = reserva.asientos;
            if (!as) return []; // Protección extra
            if (Array.isArray(as)) return as;
            return String(as).replace(/[{}[\]"]/g, '').split(',').map(s => s.trim());
        });

        return { data: asientos, error: null };
    } catch (err) {
        console.error("Error fatal procesando asientos:", err);
        return { data: [], error: err };
    }
};