// src/hooks/userReservaciones.ts
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../API/supabase';
import { obtenerMisReservas, cancelarReserva } from '../services/reservasService';
import { Reserva, Ruta } from '../models/types';

type ReservaConRuta = Reserva & { rutas?: Ruta };

export const useUserReservaciones = () => {
  const [reservas, setReservas] = useState<ReservaConRuta[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [mensaje, setMensaje] = useState<string>('');
  const [mostrarToast, setMostrarToast] = useState<boolean>(false);

const cargar = useCallback(async () => {
  setCargando(true);
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setMensaje('Necesitas iniciar sesión');
      setMostrarToast(true);
      return;
    }

    const { data, error } = await obtenerMisReservas(user.id);

    if (error) {
      setMensaje(`Error al obtener tus reservaciones: ${error.message}`);
      setMostrarToast(true);
      return;
    }

    setReservas((data as unknown as ReservaConRuta[]) || []);
  } catch (e: unknown) {
    if ((e as Error)?.name === 'AbortError') {
    console.warn('Carga de reservas abortada (ignorada)');
    return;
  }
  console.error(e);
  setMensaje('Error inesperado cargando reservaciones');
  setMostrarToast(true);
  } finally {
    setCargando(false);
  }
}, []);

  const cancelar = useCallback(async (reservaId: number) => {
    setCargando(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setMensaje('Necesitas iniciar sesión');
        setMostrarToast(true);
        return;
      }

      const { data, error } = await cancelarReserva(reservaId, user.id);

      if (error) {
        setMensaje(`Error al cancelar: ${error.message}`);
      } else if (data && data.estado === 'cancelado') {
        setMensaje('Reservación cancelada');
        setReservas(prev =>
          prev.map(r => (r.id === reservaId ? { ...r, estado: 'cancelado' } : r))
        );
      } else {
        setMensaje('No se pudo confirmar la cancelación en el servidor');
      }

      setMostrarToast(true);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return {
    reservas,
    cargando,
    mensaje,
    mostrarToast,
    setMostrarToast,
    cargar,
    cancelar,
  };
};