import { supabase } from "../API/supabase";
import { Ruta } from "../models/types";

/*
Funciones en Archivo Functions.Admin.ts

-> Crear ruta
-> Obtener rutas 
-> Eliminar ruta
-> Actualizar ruta
-> Obtener lista de pasajeros


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
export const eliminarRuta = async (id: string | number) => {
    return await supabase
    .from('rutas')
    .delete()
    .eq('id', Number(id));
};

// Actualizar ruta
export const actualizarRuta = async (idRuta: string | number, nuevosDatos: Ruta) => {
    return await supabase
    .from('rutas')
    .update(nuevosDatos)
    .eq('id', Number(idRuta))
    .select();
};

export const obtenerPasajeros = async (rutaId: number) => {
    const { data, error } = await supabase
    .from('reservas')
    .select('*')
    .eq('ruta_id', rutaId)
    .eq('estado', 'confirmado')
    .order('created_at', { ascending: true });

    return { data, error };
}
