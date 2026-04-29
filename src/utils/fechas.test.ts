import { verificarEstadoReserva } from './fechas';
import { describe, it, expect } from 'vitest';

describe('Pruebas Unitarias: verificarEstadoReserva', () => {

    it('Retorna TRUE si la fecha del viaje es menor a la fecha actual', () => {
        const fechaPasada = '2023-05-10T00:00:00Z';
        const resultado = verificarEstadoReserva(fechaPasada);

        expect(resultado).toBe(true);
    });

    it('Retorna FALSE si la fecha del viaje es en el futuro', () => {
        const fechaFutura = '2030-11-25T00:00:00Z';
        const resultado = verificarEstadoReserva(fechaFutura);
    
        expect(resultado).toBe(false);
    });

    it('Retorna FALSE si la fecha del viaje es nula', () => {
        const resuktadoVacio = verificarEstadoReserva(undefined);
        const resultadoInvalido = verificarEstadoReserva('fecha-false-xyz');

        expect(resuktadoVacio).toBe(false);
        expect(resultadoInvalido).toBe(false);
    });
});