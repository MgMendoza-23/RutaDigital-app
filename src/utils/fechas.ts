

export const verificarEstadoReserva = (fechaIso?: string) => {
    if (!fechaIso) return false;
    try {
      const soloFecha = fechaIso.split('T')[0];
      const [año, mes, dia] = soloFecha.split('-');
      const fechaViaje = new Date(Number(año), Number(mes) -1, Number(dia));

      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      return fechaViaje < hoy;
    } catch {
      return false;
    }
  } 