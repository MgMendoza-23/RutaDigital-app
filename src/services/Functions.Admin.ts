import { supabase } from "../API/supabase";
import { Ruta } from "../models/types";

/*
Funciones en Archivo Functions.Admin.ts

-> Crear ruta
-> Obtener rutas
-> Eliminar ruta
-> Actualizar ruta


*/

// Crear ruta
export const crearRuta = async (ruta: Ruta) => {
    return await supabase.from('rutas').insert([ruta]);
};

// Obtener rutas
export const obtenerRutas = async () => {
    const { data, error } = await supabase.from('rutas').select('*');
    return { data: data as Ruta[], error };
};

// Eliminar ruta
export const eliminarRuta = async (id: number) => {
    return await supabase.from('rutas').delete().eq('id', id);
};

// Actualizar ruta
export const actualizarRuta = async (idRuta: string, nuevosDatos: Ruta) => {
    return await supabase
    .from('rutas')
    .update(nuevosDatos)
    .eq('id', idRuta);
};
