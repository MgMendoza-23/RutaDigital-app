import React, { useState } from 'react';
import { IonContent, IonPage, IonButton, IonIcon, IonButtons, IonCard, 
    IonCardContent, IonBackButton,
} from '@ionic/react';
import { personCircleOutline, arrowForward, addOutline, removeOutline, timeOutline } from 'ionicons/icons';
import { useLocation, useHistory } from 'react-router-dom';
import { Ruta } from '../models/types';

const DetallesReserva: React.FC = () => {
    const location = useLocation<{ ruta: Ruta }>();
    const history = useHistory();
    const ruta = location.state?.ruta || { origen: 'Origen', destino: 'Destino', precio: 0, fecha_salida: ''};

    const [pasajeros, setPasajeros] = useState({ adultos: 1, estudiantes: 0, mayores: 0, niños: 0 });
    const [horarioSeleccionado, setHorarioSeleccionado] = useState<string | null>(null);
    const [asientosSeleccionados, setAsientosSeleccionados] = useState<string[]>([]);

    const totalPasajeros = pasajeros.adultos + pasajeros.estudiantes + pasajeros.mayores + pasajeros.niños;
    const precioTotal =  totalPasajeros * ruta.precio;
    const horariosDisponibles = ruta.horarios || [];
    const actualizarPasajero = (tipo: keyof typeof pasajeros, operacion: 'sumar' | 'restar') => {
        setPasajeros(prev => {
            const actual = prev[tipo];
            if (operacion === 'restar' && actual === 0) return prev;
            if (operacion === 'restar' && totalPasajeros === 1) return prev;

            return {
                ...prev,
                [tipo]: operacion === 'sumar' ? actual + 1 : actual - 1
            };
        });
    };

    const actualizarHorario = () => {
      if (!horarioSeleccionado) return;
      console.log("Avanzando con reserva:", { ruta, pasajeros, horarioSeleccionado});
      history.push({
        pathname: '/seleccion-asientos',
        state: {
          ruta,
          pasajeros,
          horarioSeleccionado,
          precioTotal,
          totalPasajeros
        }

      });
    };

    return ( 
        <IonPage>
          <div className="curved-header-bg">
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 20px', alignItems: 'center' }}>
          <IonButtons>
            <IonBackButton defaultHref="/buscar-viajes" color="light" />
          </IonButtons>
          <div className="header-title">
            <h2>RutaDigital</h2>
            <div className="header-subtitle">DETALLES DE VIAJE</div>
          </div>
          <IonIcon icon={personCircleOutline} style={{ fontSize: '35px', color: 'white' }} />
        </div>
      </div>

      <IonContent style={{ '--background': '#f4f5f8' }}>
        
        <div style={{ position: 'sticky', top: 0, zIndex: 10, background: '#f4f5f8', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ margin: 0, fontFamily: 'serif', fontSize: '29px', textAlign:'center' }}>Detalles de Viaje</h1>
            <IonButton 
            color="primary"
            disabled={!horarioSeleccionado}
            onClick={actualizarHorario}  
            style={{ '--border-radius': '8px', fontWeight: 'bold' }}>
                Continuar
            </IonButton>
        </div>

        {/* LA TARJETA RESUMEN */}
        <div style={{ position: 'sticky', top: '65px', zIndex: 9, padding: '0 15px' }}>
          <IonCard style={{ margin: 0, borderRadius: '15px', background: '#eef2f5', border: '1px solid #d1d9e0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <IonCardContent>
              {/* Origen y Destino */}
              <div style={{ background: 'white', padding: '10px', borderRadius: '20px', textAlign: 'center', fontWeight: 'bold', color: '#333', fontSize: '14px', marginBottom: '15px', border: '1px solid #ccc' }}>
                {ruta.origen} <IonIcon icon={arrowForward} style={{ verticalAlign: 'middle', margin: '0 10px' }} /> {ruta.destino}
              </div>

              {/* Detalles (Horario, Pasajeros, Asientos) */}
              <div style={{ color: '#555', fontSize: '14px', lineHeight: '1.6' }}>
                <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>
                    Horario | {ruta.fecha_salida ? new Date(ruta.fecha_salida).toLocaleDateString() : 'Sin fecha'} | Hora: <span style={{color: horarioSeleccionado ? '#0f7e80' : '#ff4d4d'}}>{horarioSeleccionado || 'Seleccione abajo'}</span>|
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ flex: 1, borderRight: '2px solid #ccc', paddingRight: '10px' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Pasajeros:</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Adultos:</span> <span>{pasajeros.adultos < 10 ? `0${pasajeros.adultos}` : pasajeros.adultos}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Estudiantes:</span> <span>{pasajeros.estudiantes < 10 ? `0${pasajeros.estudiantes}` : pasajeros.estudiantes}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Adultos Mayores:</span> <span>{pasajeros.mayores < 10 ? `0${pasajeros.mayores}` : pasajeros.mayores}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Niños:</span> <span>{pasajeros.niños < 10 ? `0${pasajeros.niños}` : pasajeros.niños}</span></div>
                  </div>
                  
                  <div style={{ flex: 1, paddingLeft: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <span style={{ fontWeight: 'bold' }}>Asientos:</span><br/>
                        {asientosSeleccionados.length > 0 ? asientosSeleccionados.join(', ') : 'Ninguno'}
                    </div>
                    
                    {/* Precio Total */}
                    <div style={{ alignSelf: 'flex-end', background: '#e0e0e0', padding: '10px 20px', borderRadius: '30px', fontSize: '22px', fontWeight: 'bold', color: '#333', border: '2px solid white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                      ${precioTotal}
                    </div>
                  </div>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
        </div>

        {/* ZONA DE SCROLL */}
        <div style={{ padding: '20px 15px', paddingBottom: '100px' }}>
            
            {/*SELECCIÓN DE PASAJEROS */}
            <h2 style={{ fontSize: '18px', color: '#555', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>Selección de Pasajeros</h2>
            
            <div style={{ background: 'white', borderRadius: '15px', padding: '15px', border: '1px solid #ddd', marginBottom: '25px' }}>
                
                {/* Fila Adultos */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                    <span style={{ color: '#555' }}>Adultos (18 o más)</span>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
                        <IonButton fill="clear" color="dark" onClick={() => actualizarPasajero('adultos', 'restar')}><IonIcon icon={removeOutline} /></IonButton>
                        <span style={{ width: '30px', textAlign: 'center', fontSize: '18px' }}>{pasajeros.adultos}</span>
                        <IonButton fill="clear" color="dark" onClick={() => actualizarPasajero('adultos', 'sumar')}><IonIcon icon={addOutline} /></IonButton>
                    </div>
                </div>

                {/* Fila Estudiantes */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                    <span style={{ color: '#555' }}>Estudiantes</span>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
                        <IonButton fill="clear" color="dark" onClick={() => actualizarPasajero('estudiantes', 'restar')}><IonIcon icon={removeOutline} /></IonButton>
                        <span style={{ width: '30px', textAlign: 'center', fontSize: '18px' }}>{pasajeros.estudiantes}</span>
                        <IonButton fill="clear" color="dark" onClick={() => actualizarPasajero('estudiantes', 'sumar')}><IonIcon icon={addOutline} /></IonButton>
                    </div>
                </div>

                {/* Fila Mayores */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                    <span style={{ color: '#555' }}>Adultos Mayores</span>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
                        <IonButton fill="clear" color="dark" onClick={() => actualizarPasajero('mayores', 'restar')}><IonIcon icon={removeOutline} /></IonButton>
                        <span style={{ width: '30px', textAlign: 'center', fontSize: '18px' }}>{pasajeros.mayores}</span>
                        <IonButton fill="clear" color="dark" onClick={() => actualizarPasajero('mayores', 'sumar')}><IonIcon icon={addOutline} /></IonButton>
                    </div>
                </div>

                {/* Fila Niños */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#555' }}>Niños</span>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
                        <IonButton fill="clear" color="dark" onClick={() => actualizarPasajero('niños', 'restar')}><IonIcon icon={removeOutline} /></IonButton>
                        <span style={{ width: '30px', textAlign: 'center', fontSize: '18px' }}>{pasajeros.niños}</span>
                        <IonButton fill="clear" color="dark" onClick={() => actualizarPasajero('niños', 'sumar')}><IonIcon icon={addOutline} /></IonButton>
                    </div>
                </div>
            </div>

            {/* SELECCIÓN DE HORARIO */}
            <h2 style={{ fontSize: '18px', color: '#555', borderBottom: '2px solid #ddd', paddingBottom: '10px', marginTop: 0 }}>
                 Selección de Horario
            </h2>
            {horariosDisponibles.length === 0 ? (
                <div style={{ background: '#fff3cd', color: '#856404', padding: '15px', borderRadius: '10px', textAlign: 'center', marginBottom: '30px', border: '1px solid #ffeeba' }}>
                    <IonIcon icon={timeOutline} style={{ fontSize: '24px', marginBottom: '5px' }} /><br/>
                    Esta ruta aún no tiene horarios de salida asignados.
                </div>
            ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '10px', marginBottom: '30px' }}>
                {horariosDisponibles.map((hora, index) => {
                    const seleccionado = horarioSeleccionado === hora;
                    return (
                        <div 
                            key={index}
                            onClick={() => setHorarioSeleccionado(hora)}
                            style={{
                                background: seleccionado ? 'var(--ion-color-primary)' : 'white',
                                color: seleccionado ? 'white' : '#555',
                                border: seleccionado ? '2px solid var(--ion-color-primary)' : '1px solid #ddd',
                                borderRadius: '10px',
                                padding: '12px 0',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                fontSize: '16px',
                                cursor: 'pointer',
                                boxShadow: seleccionado ? '0 4px 8px rgba(15, 126, 128, 0.3)' : '0 2px 4px rgba(0,0,0,0.05)',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <IonIcon icon={timeOutline} style={{ display: 'block', margin: '0 auto 5px auto', fontSize: '20px' }} />
                            {hora}
                        </div>
                    );
                })}
            </div>
            )}

        </div>

      </IonContent>
    </IonPage>
  );
};

export default DetallesReserva;