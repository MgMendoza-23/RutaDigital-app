import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iwhvegfrwilgmkxdrgdd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3aHZlZ2Zyd2lsZ21reGRyZ2RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4NjE3NDEsImV4cCI6MjA4NjQzNzc0MX0.prl4J3Rt5jZVKLfjXmH-BL6uFUuu87sFdmt6ZQanDgc';

export const supabase = createClient(supabaseUrl, supabaseKey);


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
  horarios?: Horario[]; 
}

//--- FUNCIONES CRUD ---

export const crearRuta = async (ruta: Ruta) => {
  const { data, error } = await supabase
    .from('rutas')
    .insert([ruta]);
  return { data, error };
};

export const obtenerRutas = async () => {
  const { data, error } = await supabase
    .from('rutas')
    .select('*');
  
  return { data: data as Ruta[], error };
};

// Función para ELIMINAR una ruta por su ID
export const eliminarRuta = async (id: number) => {
  const { error } = await supabase
    .from('rutas') 
    .delete()
    .eq('id', id); 
  return { error };
};

// --- AUTENTICACIÓN ---

// Registrar un nuevo usuario
export const registrarUsuario = async (email: string, password: string, nombre: string, telefono: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: nombre,
        phone: telefono
      }
    }
  });
  return { data, error };
};

// Iniciar Sesión
export const iniciarSesion = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

// Cerrar Sesión
export const cerrarSesion = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};