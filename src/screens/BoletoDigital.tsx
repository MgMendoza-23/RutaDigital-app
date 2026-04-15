import React, { useState, useEffect } from 'react';
import { 
    IonContent, IonPage, IonButton, IonIcon, IonToast, IonLoading 
} from '@ionic/react';
import { useLocation, useHistory } from 'react-router-dom';
import { checkmarkCircleOutline } from 'ionicons/icons';
import { QRCodeSVG } from 'qrcode.react'; // 👈 El generador de QR
import { Reserva } from '../models/types';

const BoletoDigital: React.FC = () => {
    const location = useLocation<Reserva>();
    const history = useHistory();
    const reserva = location.state;

    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
    const [estadoCarga, setEstadoCarga] = useState({ activo: false, mensaje: '' });

    // Lanzamos el toast verde al entrar a la pantalla
    useEffect(() => {
        if (reserva) setMostrarConfirmacion(true);
    }, [reserva]);

    const manejarAccion = (tipo: 'correo' | 'descarga') => {
        setEstadoCarga({ 
            activo: true, 
            mensaje: tipo === 'correo' 
                ? 'Enviando, revisa tu correo al finalizar la operación.' 
                : 'Descargando boleto...' 
        });

        // Se simula la operación y mandamos al home
        setTimeout(() => {
            setEstadoCarga({ activo: false, mensaje: '' });
            history.replace('/buscar-viajes'); // Termina el flujo
        }, 2500);
    };

    if (!reserva || !reserva.rutas) return <IonPage><IonContent>Error al cargar boleto.</IonContent></IonPage>;

    return (
        <IonPage>
            <IonContent className="ion-padding" style={{ '--background': '#f4f5f8' }}>
                
                <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '20px' }}>
                    <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Gracias Por Elegir Viajar Con</p>
                    <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Nosotros, Buen Viaje</p>
                </div>

                <div style={{ background: '#eef2f5', borderRadius: '15px', padding: '15px', border: '1px solid #d1d9e0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    
                    <div style={{ background: 'white', padding: '10px', borderRadius: '20px', textAlign: 'center', fontWeight: 'bold', color: '#333', fontSize: '13px', marginBottom: '15px', border: '1px solid #ccc' }}>
                        {reserva.rutas.origen} ⟶ {reserva.rutas.destino}
                    </div>

                    <div style={{ color: '#555', fontSize: '12px', fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '10px' }}>
                        Horario | {new Date(reserva.rutas.fecha_salida).toLocaleDateString()} | {reserva.horario}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ flex: 1, borderRight: '1px solid #ccc', paddingRight: '10px' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '12px' }}>Pasajeros:</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}><span>Adultos:</span> <span>{reserva.pasajeros?.adultos || 0}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}><span>Estudiantes:</span> <span>{reserva.pasajeros?.estudiantes || 0}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}><span>Adultos May:</span> <span>{reserva.pasajeros?.mayores || 0}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}><span>Niños:</span> <span>{reserva.pasajeros?.niños || 0}</span></div>
                        </div>
                        
                        <div style={{ flex: 1, paddingLeft: '15px', display: 'flex', flexDirection: 'column' }}>
                            <div>
                                <span style={{ fontWeight: 'bold', fontSize: '12px' }}>Asientos:</span><br/>
                                <span style={{ fontSize: '12px' }}>{Array.isArray(reserva.asientos)? reserva.asientos.join(', ') : String(reserva.asientos).replace(/[{}[\]"]/g, '')}</span>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', marginTop: 'auto' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '14px', marginRight: '10px' }}>Total:</span>
                                <div style={{ background: 'white', padding: '5px 15px', borderRadius: '20px', fontSize: '18px', fontWeight: 'bold', color: '#555', border: '1px solid #ccc' }}>
                                    ${reserva.total_pago}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* El Código QR */}
                    <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0', borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc', padding: '15px 0' }}>
                        <QRCodeSVG value={`ID:${reserva.id}|Ruta:${reserva.ruta_id}|Cliente:${reserva.usuario_id}`} size={100} />
                    </div>

                    <div style={{ marginTop: '15px' }}>
                        <span style={{ fontWeight: 'bold', color: '#555' }}>Responsable del viaje:</span>
                        <p style={{ margin: '5px 0', color: '#666' }}>{reserva.nombre_responsable}</p>
                        <p style={{ margin: '0 0 15px 0', color: '#666' }}>{reserva.telefono_responsable}</p>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontWeight: 'bold', color: '#555' }}>Método de Pago:</span>
                            <span style={{ color: '#666' }}>Tarjeta de Débito</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '25px' }}>
                        <IonButton expand="block" color="light" style={{ flex: 1, '--border-radius': '20px', fontWeight: 'bold' }} onClick={() => manejarAccion('correo')}>
                            Enviar por Correo
                        </IonButton>
                        <IonButton expand="block" color="light" style={{ flex: 1, '--border-radius': '20px', fontWeight: 'bold' }} onClick={() => manejarAccion('descarga')}>
                            Descargar
                        </IonButton>
                    </div>

                </div>

                {/* Notificación Superior Verde */}
                <IonToast
                    isOpen={mostrarConfirmacion}
                    onDidDismiss={() => setMostrarConfirmacion(false)}
                    message="Su reserva se ha confirmado correctamente"
                    duration={3000}
                    position="top"
                    color="success"
                    style={{ textAlign: 'center', '--border-radius': '20px', marginTop: '20px' }}
                />

                {/* Loading spinner centrado como en la imagen 4 */}
                <IonLoading 
                    isOpen={estadoCarga.activo} 
                    message={estadoCarga.mensaje} 
                    spinner="lines" 
                    cssClass="custom-loading"
                />

            </IonContent>
        </IonPage>
    );
};

export default BoletoDigital;