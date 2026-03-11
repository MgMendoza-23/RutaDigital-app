import { useState } from 'react';
import { buscarRutasUsuario } from '../services/Functions.Users';
import { Ruta } from '../models/types';
import { useHistory } from 'react-router';

export const useBuscarViajes = () => {
    const history = useHistory();
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
       history.push({
        pathname: '/detalles-reserva',
        state: {ruta:ruta}
       });
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