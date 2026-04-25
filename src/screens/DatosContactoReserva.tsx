import React, { useState, useEffect } from 'react';
import { 
    IonContent, IonPage, IonButtons, IonButton,
    IonIcon, IonInput, IonToast, IonLoading, IonBackButton
} from '@ionic/react';
import { useLocation, useHistory } from 'react-router-dom';
import { personCircleOutline } from 'ionicons/icons';
import { ReservaPayload } from '../models/types';
import { useAuth } from '../Context/AuthContext';
import { crearReserva } from '../services/reservasService';
import '../css/variables.css';

const DatosContactoReserva: React.FC = () => {
    const location = useLocation<ReservaPayload>();
    const history = useHistory();
    // Mandamos a llamr los datos del usaurio desde el AuthContext
    const { user } = useAuth(); 

    const [payload] = useState(location.state);
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [correo, setCorreo] = useState('');
    const [procesando, setProcesando] = useState(false);
    const [mensaje, setMensaje] = useState('');
    
    // Realizamos la accion de Pre-rellenar con datos de Supabase Auth
    useEffect(() => {
        if (user && user.user_metadata) {
            setNombre(user.user_metadata.full_name || '');
            setTelefono(user.user_metadata.phone || '');
            setCorreo(user.email || '');
        }
    }, [user]);

     if (!payload || !payload.ruta) { 
        return <IonPage><IonContent>Error cargando datos...</IonContent></IonPage>; 
    }

    const realizarPago = async () => {
        if (!nombre || !telefono) {
            setMensaje('Por favor ingresa el nombre y teléfono del responsable.');
            return;
        }
        if (!user || !payload) return;

        setProcesando(true);
        const { data, error } = await crearReserva(
            user.id,
            payload.ruta.id!,
            payload.horarioSeleccionado,
            payload.asientosSeleccionados,
            payload.pasajeros,
            payload.precioTotal,
            nombre,
            telefono
        );
        setProcesando(false);

        if (error) {
            setMensaje("Error al procesar el pago: " + error.message);
        } else if (data) {
            // Ya con exíto mandamos la reserva completa al Boleto Digital
            history.push({
                pathname: '/boleto-digital',
                state: {
                    reserva: data,
                    correoResponsable: correo
                }
            });
        }
    };

    if (!payload) return <IonPage><IonContent>Error cargando datos...</IonContent></IonPage>;

    return (
        <IonPage>
           <div className="curved-header-bg">
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 20px', alignItems: 'center' }}>
          <IonButtons>
            <IonBackButton defaultHref="/buscar-viajes" color="light" />
          </IonButtons>
          <div className="header-title">
            <h2>RutaDigital</h2>
            <div className="header-subtitle">CONFIRMACIÓN</div>
          </div>
          <IonIcon icon={personCircleOutline} style={{ fontSize: '35px', color: 'white' }} />
        </div>
      </div>

            <IonContent className="ion-padding" style={{ '--background': '#f4f5f8' }}>
                <div style={{ background: '#eef2f5', borderRadius: '15px', padding: '15px', border: '1px solid #d1d9e0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    
                    {/* Encabezado Ruta */}
                    <div style={{ background: 'white', padding: '10px', borderRadius: '20px', textAlign: 'center', fontWeight: 'bold', color: '#333', fontSize: '13px', marginBottom: '15px', border: '1px solid #ccc' }}>
                        {payload.ruta?.origen} ⟶ {payload.ruta?.destino}
                    </div>

                    <div style={{ color: '#555', fontSize: '13px', fontWeight: 'bold', marginBottom: '10px' }}>
                        Horario | {new Date(payload.ruta.fecha_salida).toLocaleDateString()} | {payload.horarioSeleccionado}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
                        <div style={{ flex: 1, borderRight: '1px solid #ccc', paddingRight: '10px' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Pasajeros:</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}><span>Adultos:</span> <span>{payload.pasajeros.adultos < 10 ? `0${payload.pasajeros.adultos}` : payload.pasajeros.adultos}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}><span>Estudiantes:</span> <span>{payload.pasajeros.estudiantes < 10 ? `0${payload.pasajeros.estudiantes}` : payload.pasajeros.estudiantes}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}><span>Adultos Mayores:</span> <span>{payload.pasajeros.mayores < 10 ? `0${payload.pasajeros.mayores}` : payload.pasajeros.mayores}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}><span>Niños:</span> <span>{payload.pasajeros.niños < 10 ? `0${payload.pasajeros.niños}` : payload.pasajeros.niños}</span></div>
                        </div>
                        
                        <div style={{ flex: 1, paddingLeft: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <span style={{ fontWeight: 'bold', fontSize: '13px' }}>Asientos:</span><br/>
                                <span style={{ fontSize: '12px' }}>{payload.asientosSeleccionados.join(', ')}</span>
                            </div>
                            
                            <div style={{ alignSelf: 'flex-end', background: 'white', padding: '5px 15px', borderRadius: '20px', fontSize: '20px', fontWeight: 'bold', color: '#555', border: '1px solid #ccc', marginTop: '10px' }}>
                                ${payload.precioTotal}
                            </div>
                        </div>
                    </div>
                        <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #ccc', fontWeight: 'bold', color: '#555' }}>
                         Unidad: {payload.ruta.unidad || 'Por asignar'}
                        </div>
                </div>

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '16px', color: '#555', fontWeight: 'bold' }}>Responsable del viaje</h3>
                    
                    <div style={{ background: 'white', borderRadius: '10px', border: '1px solid #ccc', overflow: 'hidden', marginTop: '10px' }}>
                        <IonInput 
                            value={nombre} 
                            onIonChange={e => setNombre(e.detail.value!)} 
                            placeholder="Nombre Completo"
                            style={{ borderBottom: '1px solid #ccc', '--padding-start': '15px' }}
                        />
                        <IonInput 
                            type="tel"
                            value={telefono} 
                            onIonChange={e => setTelefono(e.detail.value!)} 
                            placeholder="Número de Teléfono"
                            style={{ '--padding-start': '15px' }}
                        />
                        <IonInput
                            type="email"
                            onIonChange={e => setCorreo(e.detail.value!)}
                            placeholder='Correo Electronico'
                            style={{ borderBottom: '1px solid #ccc', '--padding-start': '15px' }}
                            value={correo}
                            />
                    </div>
                </div>

                <div style={{ marginTop: '30px', marginBottom: '20px', padding: '0 10px' }}>
            <IonButton 
                expand="block" 
                onClick={realizarPago} // Asegúrate de que tu función se siga llamando así
                style={{ 
                    '--background': 'var(--ion-color-primary)', 
                    '--border-radius': '15px', 
                    height: '55px', 
                    fontSize: '18px', 
                    fontWeight: 'bold',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                }}
            >
                Confirmar
            </IonButton>
        </div>

                <IonLoading isOpen={procesando} message="Procesando pago..." />
                <IonToast isOpen={!!mensaje} message={mensaje} duration={2000} position="top" onDidDismiss={() => setMensaje('')} />
            </IonContent>
        </IonPage>
    );
};

export default DatosContactoReserva;