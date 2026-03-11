import { useState } from 'react';
import { supabase } from '../API/supabase';
import { buscarRutasUsuario, crearReserva } from '../services/Functions.Users';
import { Ruta } from '../models/types';

export const useBuscarViajes = () => {
    const [resultados, setResultados] = useState<Ruta[]>([]);
    const [mensaje, setMensaje] = useState('');
    const [mostrarToast, setMostrarToast] = useState(false);
    const [busco, setBusco] = useState(false);

    const buscar = async (origen: string, destino: string, fecha: string) => {
        if(!origen || !destino || !fecha){
            setMensaje("Debes completar origen, destino y fecha");
            setMostrarToast(true);
            return;
        }

        setBusco(true);

        const soloFecha = fecha.split('T')[0];
        const {data, error} = await buscarRutasUsuario(origen, destino, soloFecha);

        if(error){
            setMensaje("Error al buscar rutas");
            setMostrarToast(true);
            return;
        }

        setResultados(data || []);
    };

    const reservar = async (ruta: Ruta) => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            setMensaje("Necesitas iniciar sesión");
            setMostrarToast(true);
            return;
        }

        const { error } = await crearReserva(ruta.id!, user.id);

        if (error) {
            setMensaje("Error: " + error.message);
        } else {
            setMensaje("Reserva confirmada");
            setResultados([]);
        }

        setMostrarToast(true);
    };

return {
    resultados,
    mensaje,
    mostrarToast,
    busco,
    buscar,
    reservar,
    setMostrarToast
};
};