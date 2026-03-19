import { supabase } from "../API/supabase";

/* Funciones del archivo Functions.Rutas.ts 

    Busacra rutas con filtros
    Obtener ddetalle de una ruta
*/

// Buscar rutas
export const buscarRutasUsuario = async (origen: string, destino: string, fecha: string) => {
    let query = supabase.from('rutas').select('*');
    
    if (origen) {
        query = query.ilike('origen', `%${origen}%`);
    }
    if (destino) {
        query = query.ilike('destino', `%${destino}%`);
    }
    
    if (fecha) {
        query = query.eq('fecha_salida', fecha);
    }
    
    return await query.order('fecha_salida', { ascending: true });
};

// Obtener detalle de una ruta por su ID
export const obtenerRutaPorId = async (id: number) => {
    return await supabase
        .from('rutas')
        .select('*')
        .eq('id', id)
        .single();
};