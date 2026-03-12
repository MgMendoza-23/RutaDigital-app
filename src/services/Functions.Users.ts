import { supabase } from "../API/supabase";

/*
Funciones en Archivo Functions.Users.ts

-> Buscar rutas Usuario
-> Crear reserva
-> Obtener Mis Reservas
-> Obtener rol usuario al loguear


*/



// Buscar rutas Usuario
export const buscarRutasUsuario = async (origen: string, destino: string, fecha:string) => {
    let query = supabase.from('rutas').select('*');
    
    if(origen){
        query = query.ilike('origen',`%${origen}%`);
    }
    if(destino){
        query = query.ilike('destino',`%${destino}%`);
    }
    if(fecha){
        const inicioDia = `${fecha}T00:00:00`;
        const finDia = `${fecha}T23:59:59`;

        query = query
            .gte('fecha_salida', inicioDia)
            .lte('fecha_salida', finDia);
    }
    return await query.order('fecha_salida', {ascending:true})
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
export const obtenerRolUsuario = async (userId: string): Promise<string> => {
    let intentos = 3;

    while (intentos > 0) {
        console.log(`Buscando rol para el ID: ${userId} ( vidas restantes: ${intentos})`);

        const { data, error } = await supabase
        .from('perfiles')
        .select('rol')
        .eq('id', userId)
        .single();

        if (error) {
            if (error.message.includes('AbortError')) {
            console.warn("Petición abortada por el navegador. Reintentando...");
            intentos--;
            await new Promise(resolve => setTimeout(resolve, 500));
            continue;
        }

        console.error("Error de supabase al buscar rol:", error);
        return 'usuario'; 
            
    }

    console.log("Exito, supabase devolvio esto:", data);
    return data?.rol || 'usuario';
        
}

console.error("Se agotaron los intentos para buscar el rol.");
return 'usuario';

};

