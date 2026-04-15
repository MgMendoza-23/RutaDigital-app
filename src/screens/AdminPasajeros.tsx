import React, { useState, useEffect } from 'react';
import {
  IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, 
  IonMenuButton, IonSelect, IonSelectOption, IonItem, 
  IonList, IonCard, IonCardContent, IonIcon, IonSpinner, IonText
} from '@ionic/react';
import { personOutline, callOutline, bus, ticketOutline, checkmarkCircle } from 'ionicons/icons';

import { obtenerRutas, obtenerPasajeros } from '../services/adminService';
import { Ruta, Reserva } from '../models/types';
import '../css/variables.css';

const AdminPasajeros: React.FC = () => {
    const [rutas, setRutas] = useState<Ruta[]>([]);
    const [rutaSeleccionada, setRutaSeleccionada] = useState<number | null>(null);
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [cargandoRutas, setCargandoRutas] = useState(true);
    const [cargandoPasajeros, setCargandoPasajeros] = useState(false);

    const obtenerAsientos = (asientosData: unknown): string[] => {
        if (!asientosData) return [];
        if (Array.isArray(asientosData)) return asientosData as string[];
        const limpio = String(asientosData).replace(/[{}[\]"]/g, '').trim();
        return limpio ? limpio.split(',').map(a => a.trim()) : [];
    }

    // Al entrar a la pantalla, cargamos las rutas disponibles
    useEffect(() => {
        const cargarListaRutas = async () => {
            const { data } = await obtenerRutas();
            if (data) setRutas(data as Ruta[]);
            setCargandoRutas(false);
        };
        cargarListaRutas();
    }, []);

    // Cuando el admin selecciona una ruta, se cargan los pasajeros
    useEffect(() => {
        if (!rutaSeleccionada) {
            setReservas([]);
            return;
        }

        const cargarPasajeros = async () => {
            setCargandoPasajeros(true);
            const { data, error } = await obtenerPasajeros(rutaSeleccionada);
            if (data) setReservas(data as Reserva[]);
            if (error) console.error("Error cargando pasajeros:", error);
            setCargandoPasajeros(false);
        };

        cargarPasajeros();
    }, [rutaSeleccionada]);

    // Calculamos el total de asientos ocupados en la ruta seleccionada
    const totalAsientosOcupados = reservas.reduce((total, res) => total + obtenerAsientos(res.asientos).length, 0);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Lista de Pasajeros</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding" style={{ '--background': '#f4f5f8' }}>
                
                {/* Selector de Ruta */}
                <div style={{ background: 'white', padding: '15px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
                    <h2 style={{ marginTop: 0, color: 'var(--ion-color-primary)', fontSize: '18px' }}>Selecciona una Ruta</h2>
                    
                    {cargandoRutas ? (
                        <IonSpinner name="crescent" />
                    ) : (
                        <IonItem lines="none" style={{ '--background': '#f9f9f9', borderRadius: '10px', border: '1px solid #eee' }}>
                            <IonIcon icon={bus} slot="start" color="medium" />
                            <IonSelect 
                                placeholder="Elige un viaje..." 
                                value={rutaSeleccionada}
                                onIonChange={(e) => setRutaSeleccionada(e.detail.value)}
                                style={{ width: '100%' }}
                                interface="action-sheet"
                            >
                                {rutas.map(ruta => (
                                    <IonSelectOption key={ruta.id} value={ruta.id}>
                                        {ruta.origen} ➔ {ruta.destino} ({new Date(ruta.fecha_salida).toLocaleDateString()})
                                    </IonSelectOption>
                                ))}
                            </IonSelect>
                        </IonItem>
                    )}
                </div>

                {/* Resultados de Pasajeros */}
                {rutaSeleccionada && (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', padding: '0 5px' }}>
                            <h3 style={{ margin: 0, fontFamily: 'serif' }}>Lista de Abordaje</h3>
                            <IonText color="primary" style={{ fontWeight: 'bold' }}>
                                {totalAsientosOcupados} Asientos Ocupados
                            </IonText>
                        </div>

                        {cargandoPasajeros ? (
                            <div style={{ textAlign: 'center', marginTop: '30px' }}>
                                <IonSpinner name="dots" color="primary" />
                            </div>
                        ) : reservas.length === 0 ? (
                            <div style={{ textAlign: 'center', color: '#888', padding: '30px', background: 'white', borderRadius: '15px' }}>
                                No hay pasajeros confirmados para este viaje aún.
                            </div>
                        ) : (
                            <IonList style={{ background: 'transparent' }}>
                                {reservas.map((reserva) => (
                                    <IonCard key={reserva.id} style={{ margin: '0 0 15px 0', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                                        <IonCardContent style={{ padding: '15px' }}>
                                            
                                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                                                <div style={{ fontWeight: 'bold', color: '#333', fontSize: '16px' }}>
                                                    <IonIcon icon={personOutline} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                                                    {reserva.nombre_responsable || 'Sin nombre'}
                                                </div>
                                                <div style={{ color: 'var(--ion-color-success)', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                                    <IonIcon icon={checkmarkCircle} style={{ marginRight: '5px' }} /> Pagado
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#555', fontSize: '14px' }}>
                                                <div>
                                                    <div style={{ marginBottom: '5px' }}>
                                                        <IonIcon icon={callOutline} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                                                        {reserva.telefono_responsable || 'Sin teléfono'}
                                                    </div>
                                                    <div>
                                                        <span style={{ fontWeight: 'bold' }}>Horario:</span> {reserva.horario}
                                                    </div>
                                                </div>
                                                
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontWeight: 'bold', color: 'var(--ion-color-primary)', fontSize: '16px', marginBottom: '5px' }}>
                                                        <IonIcon icon={ticketOutline} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                                                        {obtenerAsientos(reserva.asientos).join(', ')}
                                                    </div>
                                                    <div style={{ fontWeight: 'bold', color: '#333' }}>
                                                        Total: ${reserva.total_pago}
                                                    </div>
                                                </div>
                                            </div>

                                        </IonCardContent>
                                    </IonCard>
                                ))}
                            </IonList>
                        )}
                    </>
                )}

            </IonContent>
        </IonPage>
    );
};

export default AdminPasajeros;