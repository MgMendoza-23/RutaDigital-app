import { supabase } from "../API/supabase";

/*
Funciones en Archivo Functions.Users.ts

-> Buscar rutas Usuario
-> Crear reserva
-> Obtener Mis Reservas
-> Obtener rol usuario al loguear


*/



// Buscar rutas Usuario
export const buscarRutasUsuario = async (origen: string, destino: string) => {
    let query = supabase.from('rutas').select('*');

    if (origen) query = query.ilike('origen', `%${origen}%`);
    if (destino) query = query.ilike('destino', `%${destino}%`);

    return await query;
};

// Crear reserva
export const crearReserva = async (rutaId: number, usuarioId: string) => {
    return await supabase.from('reservas').insert([
    {
        ruta_id: rutaId,
        usuario_id: usuarioId,
        estado: 'confirmado'
    }
    ]);
};

// Obtener Mis Reservas
export const obtenerMisReservas = async (usuarioId: string) => {
    return await supabase
    .from('reservas')
    .select(`
      *,
        rutas:ruta_id (origen, destino, precio, duracion, salida)
    `)
    .eq('usuario_id', usuarioId)
    .order('created_at', { ascending: false });
};

// Obtener rol Usuario
export const obtenerRolUsuario = async (userId: string) => {
    const { data, error } = await supabase
    .from('perfiles')
    .select('rol')
    .eq('id', userId)
    .single();

    if (error) return 'usuario';
    return data?.rol || 'usuario';
};
