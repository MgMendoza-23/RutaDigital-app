import React, { useContext, useState } from 'react';
import {
  IonPage, IonContent, IonButtons, IonMenuButton, IonIcon,
  IonText, IonCard, IonCardContent, IonButton, IonSpinner, IonToast, useIonViewWillEnter
} from '@ionic/react';
import { personCircleOutline, timeOutline, pinOutline, bus } from 'ionicons/icons';

import { obtenerMisReservas, cancelarReserva }  from '../services/reservasService';
import { AuthContext } from '../Context/AuthContext';
import { Reserva } from '../models/types';

import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const Reservaciones: React.FC = () => {
  const { user } = useContext(AuthContext);

  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [mostrarToast, setMostrarToast] = useState(false);
  
  const cargarMisViajes = async () => {
    if (!user) return; 

    setCargando(true);
    const { data } = await obtenerMisReservas(user.id);
    if (data) setReservas(data as unknown as Reserva[]);
    setCargando(false);
  };

  useIonViewWillEnter(() => {
    cargarMisViajes();
  });

  // 👇 Esta es la función clave que faltaba para procesar las cancelaciones
  const manejarCancelacion = async (reservaId: number) => {
    if (!user) return;
    
    const { error } = await cancelarReserva(reservaId, user.id);
    
    if (error) {
        setMensaje("Error al cancelar la reserva.");
    } else {
        setMensaje("Reservación cancelada con éxito.");
        cargarMisViajes(); // Recargamos para que se pinte en rojo
    }
    setMostrarToast(true);
  };

  const formatearFecha = (iso?: string) => {
    if (!iso) return '—';
    try {
      const d = parseISO(iso);
      if (isNaN(d.getTime())) return 'Fecha inválida';
      return format(d, "dd 'de' MMM yyyy, HH:mm", { locale: es });
    } catch { return 'Fecha inválida'; }
  };

  return (
    <IonPage>
      <div className="curved-header-bg">
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 20px', alignItems: 'center' }}>
          <IonButtons>
            <IonMenuButton color="light" />
          </IonButtons>
          <div className="header-title">
            <h2>RutaDigital</h2>
            <div className="header-subtitle">MIS RESERVACIONES</div>
          </div>
          <IonIcon icon={personCircleOutline} style={{ fontSize: '35px', color: 'white' }} />
        </div>
      </div>

      <IonContent className="ion-padding" style={{ '--background': '#f4f5f8' }}>
        <IonText color="dark">
          <h1 style={{ fontFamily: 'serif', marginTop: '10px', fontSize: '28px' }}>Mis reservaciones</h1>
        </IonText>

        {cargando && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <IonSpinner name="crescent" color="primary" />
          </div>
        )}

        {!cargando && reservas.length === 0 && (
          <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
            <p>No tienes reservaciones registradas.</p>
          </div>
        )}

        {reservas.map((res) => (
          <IonCard key={res.id} style={{ borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginBottom: '20px', background: 'white' }}>
            <IonCardContent>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                <span>
                  <IonIcon icon={pinOutline} style={{ verticalAlign: 'middle' }} />
                  <span> {res.rutas?.origen} → {res.rutas?.destino}</span>
                </span>
                {/* Mostramos el pago total guardado, o el precio base como respaldo */}
                <span style={{ color: 'var(--ion-color-primary)' }}>${res.total_pago || res.rutas?.precio}</span>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '10px', color: '#666' }}>
                {/* Mostramos el horario exacto y los asientos */}
                <span><IonIcon icon={timeOutline} style={{ verticalAlign: 'middle' }} /> {res.horario || '—'}</span>
                <span><IonIcon icon={bus} style={{ verticalAlign: 'middle' }} /> Asientos: {Array.isArray(res.asientos) ? res.asientos.join(', ') : String(res.asientos || '').replace(/[{}[\]"]/g, '') || 'N/A'}</span>
              </div>

              <div style={{ marginTop: '8px', color: '#555' }}>
                Salida: <strong>{formatearFecha(res.rutas?.fecha_salida)}</strong>
              </div>

              <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {res.estado === 'cancelado' ? (
                  <div style={{
                    display: 'flex', alignItems: 'center', padding: '4px 10px',
                    borderRadius: 12, background: '#ffe6e6', color: '#c0392b',
                    fontSize: 12, fontWeight: 'bold', width: 'fit-content'
                  }}>
                    Cancelada
                  </div>
                ) : (
                  <div style={{
                    display: 'flex', alignItems: 'center', padding: '4px 10px',
                    borderRadius: 12, background: '#e6f7f5', color: '#1ba098',
                    fontSize: 12, fontWeight: 'bold', width: 'fit-content'
                  }}>
                    Confirmada
                  </div>
                )}

                <div style={{ display: 'flex', width: '100%' }}>
                  {res.estado !== 'cancelado' ? (
                    <IonButton
                      expand="block"
                      color="medium"
                      fill="outline"
                      onClick={() => manejarCancelacion(res.id!)}
                      style={{ '--border-radius': '8px', width: '100%', margin: 0 }}
                    >
                      Cancelar
                    </IonButton>
                  ) : (
                    <IonButton expand="block" disabled color="medium" fill="outline" style={{ '--border-radius': '8px', width: '100%', margin: 0 }}>
                      Reservación cancelada
                    </IonButton>
                  )}
                </div>
              </div>
            </IonCardContent>
          </IonCard>
        ))}

        <IonToast
          isOpen={mostrarToast}
          onDidDismiss={() => setMostrarToast(false)}
          message={mensaje}
          duration={1800}
          position="top"
          color={mensaje.includes('Error') ? 'warning' : 'success'}
        />
      </IonContent>
    </IonPage>
  );
};

export default Reservaciones;