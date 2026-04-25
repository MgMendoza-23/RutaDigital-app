
import React, { useEffect, useState } from 'react';
import {
  IonContent, IonPage, IonButtons, IonMenuButton, IonIcon, 
  IonCard, IonCardContent, IonButton, IonText, IonLoading,
} from '@ionic/react';
import { personCircleOutline, arrowForward, timeOutline, bus, arrowBack, locationOutline } from 'ionicons/icons';
import { useHistory } from 'react-router';


// importamos el archivo css
import '../css/variables.css';

// obteniendo el modelo de datos de las rutas
import { Ruta } from "../models/types";
import { supabase } from '../API/supabase';

const CIUDADES_DISPONIBLES = [ 
  "Palenque, Chiapas",
  "Tenosique, Tabasco",
  "Balancan, Tabasco",
  "Emiliano Zapata, Tabasco",
  "Villahermosa, Tabasco",
  "Escarsega, Tabasco",
  "Comitan, Chiapas"
];


const TodasLasRutas: React.FC = () => {
  const history = useHistory();
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState<string | null>(null);


  useEffect(() => {
    cargarRutas();
  }, []);


  // Funcion asincrona para cargar todas las Rutas existentes 
  const cargarRutas = async () => {
    const { data } = await supabase.from('rutas').select('*');
    if (data) setRutas(data as Ruta[]);
    setCargando(false);
  };

  const iniciarReserva = (ruta: Ruta) => {
    history.push({
      pathname: '/detalles-reserva',
      state: { ruta }
    });
  }
  // filtrado de rutas segun la ciudad seleccionada
  const rutasFiltradas = ciudadSeleccionada
    ? rutas.filter(ruta => ruta.origen === ciudadSeleccionada)
    : [];

  return (
    <IonPage>
      <div className="curved-header-bg">
        <div style={{display: 'flex', justifyContent: 'space-between', padding: '15px 20px', alignItems: 'center'}}>
            <IonButtons>
                <IonMenuButton color="light" /> 
            </IonButtons>
            <div className="header-title">
                <h2>RutaDigital</h2>
                <div className="header-subtitle">CATÁLOGO</div>
            </div>
            <IonIcon icon={personCircleOutline} style={{fontSize: '35px', color: 'white'}} />
        </div>
      </div>

      <IonContent className="ion-padding" style={{'--background': '#f4f5f8'}}>
        <IonLoading isOpen={cargando} message="Cargando catálogo..." />

        {/* CUADRÍCULA DE CIUDADES */}
        {!ciudadSeleccionada ? (
          <>
            <IonText color="dark">
                <h1 style={{fontFamily: 'serif', marginTop: '10px', fontSize: '28px', textAlign:'center'}}>
                    Destinos Disponibles
                </h1>
                <p style={{ textAlign: 'center', color: '#666', marginTop: 0 }}>Selecciona tu ciudad de origen</p>
            </IonText>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px', marginTop: '20px' }}>
              {CIUDADES_DISPONIBLES.map(ciudad => {
                const [nombreCiudad, estado] = ciudad.split(', '); // Separamos ciudad de estado para el diseño
                return (
                  <div 
                    key={ciudad}
                    onClick={() => setCiudadSeleccionada(ciudad)}
                    style={{
                      background: 'white',
                      borderRadius: '16px',
                      padding: '20px 10px',
                      textAlign: 'center',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.04)',
                      border: '1px solid #58c3b7',
                      cursor: 'pointer'
                    }}
                  >
                    <IonIcon icon={locationOutline} style={{ fontSize: '38px', color: 'var(--ion-color-primary)', marginBottom: '8px' }} />
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
                      {nombreCiudad}
                    </h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#888' }}>
                      {estado}
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        ) : (

        /* RUTAS FILTRADAS POR LA CIUDAD SELECCIONADA */
          <>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
              <IonButton fill="clear" color="dark" onClick={() => setCiudadSeleccionada(null)} style={{ margin: 0, padding: 0 }}>
                <IonIcon icon={arrowBack} slot="start" />
                Volver a destinos
              </IonButton>
            </div>

            <IonText color="dark">
                <h1 style={{fontFamily: 'serif', marginTop: '0', fontSize: '24px'}}>
                    Saliendo desde <span style={{ color: 'var(--ion-color-primary)' }}>{ciudadSeleccionada.split(',')[0]}</span>
                </h1>
            </IonText>

            <hr style={{ margin: '15px 0', borderTop: '1px solid #ccc' }} />

            {/* Renderizamos las tarjetas solo de las rutas que coinciden */}
            {rutasFiltradas.length > 0 ? (
              rutasFiltradas.map((ruta) => (
                <IonCard key={ruta.id} style={{borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginBottom: '20px', background: 'white'}}>
                    <IonCardContent>
                        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', color: '#333'}}>
                            {/* Dividimos para mostrar solo "Palenque" en lugar de "Palenque, Chiapas" para no saturar la tarjeta */}
                            <span>{ruta.origen.split(',')[0]} <IonIcon icon={arrowForward} style={{ color: '#888', margin: '0 5px', fontSize: '16px', verticalAlign: 'middle'}}/> {ruta.destino.split(',')[0]}</span>
                            <span style={{color: 'var(--ion-color-primary)'}}>${ruta.precio}</span>
                        </div>
                        <div style={{display: 'flex', gap: '15px', marginTop: '10px', color: '#666', fontSize: '14px'}}>
                            <span><IonIcon icon={timeOutline} style={{verticalAlign: 'middle'}}/> {ruta.fecha_salida || 'Sin fecha'}</span>
                            <span><IonIcon icon={timeOutline} style={{verticalAlign: 'middle'}}/> {ruta.horarios?.[0] || 'N/A'}</span>
                            <span><IonIcon icon={bus} style={{verticalAlign: 'middle'}}/> Unidad: {ruta.unidad || 'Por asignar'}</span>
                        </div>
                    
                        <IonButton expand="block" fill="outline" style={{marginTop: '15px', '--border-radius': '8px'}}
                            onClick={() => iniciarReserva(ruta)}>
                                Reservar
                        </IonButton>
                    </IonCardContent>
                </IonCard>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888', background: 'white', borderRadius: '15px', border: '1px dashed #ccc' }}>
                <IonIcon icon={bus} style={{ fontSize: '50px', color: '#ccc', marginBottom: '10px' }} />
                <h3 style={{ margin: 0, color: '#555' }}>Sin rutas activas</h3>
                <p style={{ marginTop: '10px' }}>Por el momento no hay viajes programados saliendo desde esta ciudad.</p>
              </div>
            )}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default TodasLasRutas;