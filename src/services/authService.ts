import { supabase } from "../API/supabase";

/*
Funciones en Archivo Functions.Auth.ts

-> Registrar usuario
-> Iniciar Sesion
-> Cerrar Sesion



*/

// Registrar usuario
export const registrarUsuario = async (
    email: string,
    password: string,
    nombre: string,
    telefono: string
) => {
    return await supabase.auth.signUp({
    email,
    password,
    options: {
    data: {
        full_name: nombre,
        phone: telefono
    }
    }
    });
};

// Iniciar Sesion
export const iniciarSesion = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
    email,
    password
    });
};

// Cerrar Sesion
export const cerrarSesion = async () => {
    return await supabase.auth.signOut();
};
