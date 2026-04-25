import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import emailjs from '@emailjs/browser';
import { 
    IonContent, IonPage, IonButton, IonToast, IonLoading, IonBackButton
    , IonIcon, IonButtons
} from '@ionic/react';
import { personCircleOutline } from 'ionicons/icons';
import { useLocation, useHistory } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react'; 


const BoletoDigital: React.FC = () => {
    const location = useLocation<any>();
    const history = useHistory();
    const { reserva, correoResponsable } = location.state || {};
    const boletoRef = useRef<HTMLDivElement>(null);

    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
    const [estadoCarga, setEstadoCarga] = useState({ activo: false, mensaje: '' });

    // Lanzamos el toast verde al entrar a la pantalla
    useEffect(() => {
        if (reserva) setMostrarConfirmacion(true);
    }, [reserva]);

    const manejarAccion = async (tipo: 'correo' | 'descarga') => {
        setEstadoCarga({ 
            activo: true, 
            mensaje: tipo === 'correo' 
                ? 'Enviando, revisa tu correo al finalizar la operación.' 
                : 'Descargando boleto...' 
        });

       try {
            if (tipo === 'descarga') {
                // LÓGICA DE DESCARGA LOCAL
                if (boletoRef.current) {
                    const canvas = await html2canvas(boletoRef.current, {
                        scale: 2, // Escala 2 para que la imagen no salga borrosa
                        useCORS: true,
                        backgroundColor: '#ffffff'
                    });
                    const image = canvas.toDataURL("image/png");
                    const link = document.createElement('a');
                    link.download = `Boleto_RutaDigital_${reserva.id}.png`;
                    link.href = image;
                    link.click();
                }
            } else if (tipo === 'correo') {
                // LÓGICA DE ENVÍO POR CORREO
                const templateParams = {
                    to_email: correoResponsable || 'correo_no_proporcionado@test.com',
                    to_name: reserva.nombre_responsable,
                    origen: reserva.rutas.origen,
                    destino: reserva.rutas.destino,
                    asientos: Array.isArray(reserva.asientos) ? reserva.asientos.join(', ') : String(reserva.asientos).replace(/[{}[\]"]/g, ''),
                    fecha: new Date(reserva.rutas.fecha_salida).toLocaleDateString(),
                    horario: reserva.horario,
                    total: reserva.total_pago,
                    id_reserva: reserva.id
                };

                // OJO: Deberás cambiar estos textos por tus credenciales de EmailJS
                await emailjs.send(
                    'TU_SERVICE_ID', 
                    'TU_TEMPLATE_ID', 
                    templateParams, 
                    'TU_PUBLIC_KEY'
                );
            }
        } catch (error) {
            console.error("Error procesando el boleto:", error);
            alert("Hubo un error al procesar tu solicitud. Intenta de nuevo.");
        } finally {
            // Ya sea que tenga éxito o falle, apagamos el loader y mandamos al home
            setEstadoCarga({ activo: false, mensaje: '' });
            history.replace('/buscar-viajes'); 
        }
    };

    if (!reserva || !reserva.rutas) return <IonPage><IonContent>Error al cargar boleto.</IonContent></IonPage>;

    return (
        <IonPage>

            <div className="curved-header-bg">
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 20px', alignItems: 'center' }}>
          <IonButtons>
            <IonBackButton defaultHref="/buscar-viajes" color="light" />
          </IonButtons>
          <div className="header-title">
            <h2>RutaDigital</h2>
            {/* Solo cambias el subtítulo en cada pantalla */}
            <div className="header-subtitle">BOLETO DIGITAL</div>
          </div>
          <IonIcon icon={personCircleOutline} style={{ fontSize: '35px', color: 'white' }} />
        </div>
      </div>

            <IonContent className="ion-padding" style={{ '--background': '#f4f5f8' }}>
                
                <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '20px' }}>
                    <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Gracias Por Elegir Viajar Con</p>
                    <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Nosotros, Buen Viaje</p>
                </div>

                <div ref={boletoRef} style={{ background: '#eef2f5', borderRadius: '15px', padding: '15px', border: '1px solid #d1d9e0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    
                    <div style={{ background: 'white', padding: '10px', borderRadius: '20px', textAlign: 'center', fontWeight: 'bold', color: '#333', fontSize: '13px', marginBottom: '15px', border: '1px solid #ccc' }}>
                        {reserva.rutas.origen} ⟶ {reserva.rutas.destino}
                    </div>

                    <div style={{ color: '#555', fontSize: '13px', fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '10px' }}>
                        Horario | {reserva.rutas.fecha_salida?
                        (() => {
                            const soloFecha = reserva.rutas.fecha_salida.split('T')[0];
                            const [año, mes, dia] = soloFecha.split('-');

                            return `${dia}/${mes}/${año}`;
                        })()
                        : 'Sin fecha'} | {reserva.horario}
                        <br/> Unidad Asignada: {reserva.rutas.unidad || "N/A"}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ flex: 1, borderRight: '1px solid #ccc', paddingRight: '10px' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '15px' }}>Pasajeros:</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}><span>Adultos:</span> <span>{reserva.pasajeros?.adultos || 0}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}><span>Estudiantes:</span> <span>{reserva.pasajeros?.estudiantes || 0}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}><span>Adultos Mayores:</span> <span>{reserva.pasajeros?.mayores || 0}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}><span>Niños:</span> <span>{reserva.pasajeros?.niños || 0}</span></div>
                        </div>
                        
                        <div style={{ flex: 1, paddingLeft: '15px', display: 'flex', flexDirection: 'column' }}>
                            <div>
                                <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Asientos:</span><br/>
                                <span style={{ fontSize: '14px' }}>{Array.isArray(reserva.asientos)? reserva.asientos.join(', ') : String(reserva.asientos).replace(/[{}[\]"]/g, '')}</span>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', marginTop: 'auto' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '15px', marginRight: '10px' }}>Total:</span>
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
                        <span style={{ fontWeight: 'bold', color: '#555', fontSize: '15px' }}>Responsable del viaje:</span>
                        <p style={{ margin: '8px 0', color: '#666', fontSize: '15px' }}>{reserva.nombre_responsable}</p>
                        <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '15px' }}>{reserva.telefono_responsable}</p>

                       {/*<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontWeight: 'bold', color: '#555' }}>Método de Pago:</span>
                            <span style={{ color: '#666' }}>Tarjeta de Débito</span>
                        </div> */}
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