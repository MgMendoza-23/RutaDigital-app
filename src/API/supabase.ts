import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

console.log("Supabase URL:", supabaseUrl ? "OK" : "VACIA");
console.log("Supabase URL cargada:", supabaseUrl ? "SÍ EXISTE" : "ESTÁ VACÍA O INDEFINIDA");
console.log("Supabase Key cargada:", supabaseKey ? "SÍ EXISTE" : "ESTÁ VACÍA O INDEFINIDA");

export const supabase = createClient(supabaseUrl || '', supabaseKey || '', {
    auth: {
        storage: window.localStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
    }
});

