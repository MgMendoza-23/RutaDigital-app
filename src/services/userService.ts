import { supabase } from "../API/supabase";

/*
Funciones en Archivo Functions.Users.ts

-> Buscar rutas Usuario
-> Obtener rol usuario al loguear
-> Actualizar perfil usuario


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

// Actualizar perfil usuario
export const actualizarPerfilUsuario = async (nombre: string, telefono: string) => {
    const { data, error } = await supabase.auth.updateUser({
        data: {
            full_name: nombre,
            phone: telefono
        }
    });
    return { data, error };
}