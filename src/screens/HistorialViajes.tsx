import React, { useContext, useState } from 'react';
import {
  IonPage, IonContent, IonButtons, IonMenuButton, IonIcon,
  IonText, IonCard, IonCardContent, IonButton, IonSpinner, useIonViewWillEnter
} from '@ionic/react';
import { personCircleOutline, timeOutline, bus, refreshOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

import { obtenerHistorialViajes } from '../services/reservasService';
import { AuthContext } from '../Context/AuthContext';
import { Reserva } from '../models/types';

const HistorialViajes: React.FC = () => {
  const { user } = useContext(AuthContext);
  const history = useHistory();

  const [historial, setHistorial] = useState<Reserva[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarHistorial = async () => {
    if (!user) return;
    setCargando(true);
    const { data } = await obtenerHistorialViajes(user.id);
    if (data) setHistorial(data as unknown as Reserva[]);
    setCargando(false);
  };

  useIonViewWillEnter(() => {
    cargarHistorial();
  });

 
  const formatearFechaSimple = (iso?: string) => {
    if (!iso) return '—';
    const [año, mes, dia] = iso.split('T')[0].split('-');
    const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    return `${dia} de ${meses[parseInt(mes) - 1]} ${año}`;
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
            <div className="header-subtitle">HISTORIAL</div>
          </div>
          <IonIcon icon={personCircleOutline} style={{ fontSize: '35px', color: 'white' }} />
        </div>
      </div>

      <IonContent className="ion-padding" style={{ '--background': '#f4f5f8' }}>
        <IonText color="dark">
          <h1 style={{ fontFamily: 'serif', marginTop: '10px', fontSize: '26px' }}>Viajes pasados</h1>
          <p style={{ color: '#666', marginTop: 0 }}>Registro de tus recorridos finalizados</p>
        </IonText>

        {cargando ? (
          <div style={{ textAlign: 'center', marginTop: '30px' }}><IonSpinner name="crescent" color="primary" /></div>
        ) : historial.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#999', marginTop: '50px' }}>
            <IonIcon icon={bus} style={{ fontSize: '50px', opacity: 0.3 }} />
            <p>Aún no tienes viajes en tu historial.</p>
          </div>
        ) : (
          historial.map((res) => (
            <IonCard key={res.id} style={{ borderRadius: '15px', marginBottom: '15px', background: 'white', opacity: res.estado === 'cancelado' ? 0.7 : 1 }}>
              <IonCardContent>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#333' }}>
                  <span>{res.rutas?.origen.split(',')[0]} → {res.rutas?.destino.split(',')[0]}</span>
                  <span style={{ color: '#888' }}>${res.total_pago}</span>
                </div>

                <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
                  <IonIcon icon={timeOutline} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                  {formatearFechaSimple(res.rutas?.fecha_salida)} | {res.horario}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                  <span style={{
                    padding: '3px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold',
                    background: res.estado === 'cancelado' ? '#ffe6e6' : '#f0f0f0',
                    color: res.estado === 'cancelado' ? '#c0392b' : '#666'
                  }}>
                    {res.estado === 'cancelado' ? 'CANCELADO' : 'CONCLUIDO'}
                  </span>

                  <IonButton 
                    fill="clear" 
                    size="small" 
                    onClick={() => history.push({ pathname: '/detalles-reserva', state: { ruta: res.rutas } })}
                    style={{ fontWeight: 'bold', '--color': 'var(--ion-color-primary)' }}
                  >
                    <IonIcon icon={refreshOutline} slot="start" />
                    Repetir
                  </IonButton>
                </div>
              </IonCardContent>
            </IonCard>
          ))
        )}
      </IonContent>
    </IonPage>
  );
};

export default HistorialViajes;