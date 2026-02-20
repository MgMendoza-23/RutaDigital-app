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
  fecha_salida?: string;
}

//FUNCIONES CRUD

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

// Función para eliminar una ruta por su ID
export const eliminarRuta = async (id: number) => {
  const { error } = await supabase
    .from('rutas') 
    .delete()
    .eq('id', id); 
  return { error };
};

// Función de actualizacion de una ruta
export const actualizarRuta = async (idRuta: string, nuevosDatos: Ruta) => {
  const { data, error } = await supabase
  .from('rutas')
  .update({
    origen: nuevosDatos.origen,
    destino: nuevosDatos.destino,
    precio: nuevosDatos.precio,
    duracion: nuevosDatos.duracion,
    horarios: nuevosDatos.horarios,
    fecha_salida: nuevosDatos.fecha_salida
  })
  .eq('id', idRuta);

  if (error) {
    console.log("Error al actualizar la ruta", error);
    return { error };
  } else {
    return { data };
  }
}

// AUTENTICACIÓN

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


































// BÚSQUEDA DE RUTAS

export const buscarRutasUsuario = async (origen: string, destino: string) => {

  let query = supabase.from('rutas').select('*');
  if (origen) {
    query = query.ilike('origen', `%${origen}%`);
  }

  if (destino) {
    query = query.ilike('destino', `%${destino}%`);
  }

  const { data, error } = await query;
  return { data, error };
};

// RESERVAS
export interface Reserva {
    id?: number;
    usuario_id: string;
    ruta_id: number;
    created_at?: string;
    rutas?: Ruta; 
}

// funcion para crear una reserva
export const crearReserva = async (rutaId: number, usuarioId: string) => {
  const { data, error } = await supabase
    .from('reservas')
    .insert([
      { 
        ruta_id: rutaId, 
        usuario_id: usuarioId,
        estado: 'confirmado'
      }
    ]);
  
  return { data, error };
};

export const obtenerMisReservas = async (usuarioId: string) => {
  const { data, error } = await supabase
    .from('reservas')
    .select(`
      *,
      rutas:ruta_id (origen, destino, precio, duracion, salida)
    `)
    .eq('usuario_id', usuarioId)
    .order('created_at', { ascending: false });

  return { data, error };
};

// deteccion de roles de usuario

export const obtenerRolUsuario = async (userId: string) => {
  const { data, error } = await supabase
    .from('perfiles')
    .select('rol')
    .eq('id', userId)
    .single();

    if (error) {
      console.log("Error al obtener el rol del usuario", error);
      return 'usuario';
    }
    
  return data?.rol || 'usuario'; 
};