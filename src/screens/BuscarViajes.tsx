import React, { useState } from 'react';
import {
  IonContent, IonPage, IonButton,
  IonIcon, IonButtons, IonMenuButton, IonSegment, IonSegmentButton, IonLabel, IonText,
  IonToast, IonCard, IonCardContent,
  useIonViewWillEnter,
  IonSelect, IonSelectOption, IonDatetime, IonDatetimeButton, IonModal
} from '@ionic/react';
import { locationOutline, calendarOutline, personCircleOutline, arrowForward, timeOutline, bus } from 'ionicons/icons';

// Importamos el archivo CSS y el nuevo Custom Hook
import '../css/variables.css';
import { useBuscarViajes } from '../hooks/useBuscarViajes';

const CIUDADES_DISPONIBLES = [
  "Palenque, Chiapas",
  "Tenosique, Tabasco",
  "Balancan, Tabasco",
  "Emiliano Zapata, Tabasco",
  "Villahermosa, Tabasco",
  "Escarsega, Tabasco",
  "Comitan, Chiapas"
];


const BuscarViajes: React.FC = () => {
  // Estados locales solo para la Interfaz de Usuario (Formulario)
  const [tipoViaje, setTipoViaje] = useState('ida');
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [fechaSalida, setFechaSalida] = useState('');
  const [fechaRetorno, setFechaRetorno] = useState('');

  // Extraemos la lógica de negocio desde nuestro Custom Hook
  const {
    resultados,
    mensaje,
    mostrarToast,
    busco,
    buscar,
    reservar,
    setMostrarToast
  } = useBuscarViajes();

  useIonViewWillEnter(() => {
    setOrigen('');
    setDestino('');
    setFechaSalida('');
    setFechaRetorno('');
  });

  return (
    <IonPage>
      <div className="curved-header-bg">
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 20px', alignItems: 'center' }}>
          <IonButtons>
            <IonMenuButton color="light" />
          </IonButtons>
          <div className="header-title">
            <h2>RutaDigital</h2>
            <div className="header-subtitle">INICIO</div>
          </div>
          <IonIcon icon={personCircleOutline} style={{ fontSize: '35px', color: 'white' }} />
        </div>
      </div>

      <IonContent className="ion-padding" style={{ '--background': '#f4f5f8' }}>
        <IonText color="dark">
          <h1 style={{ fontFamily: 'serif', marginTop: '10px', fontSize: '28px' }}>Reservación</h1>
        </IonText>

        <div style={{ background: '#e0e0e0', borderRadius: '25px', padding: '4px', margin: '20px 0' }}>
          <IonSegment
            value={tipoViaje}
            onIonChange={e => setTipoViaje(e.detail.value as string)}
            mode="ios"
            style={{ background: 'transparent' }}
          >
            <IonSegmentButton value="ida" style={{ '--border-radius': '20px', '--background-checked': 'white', '--color-checked': 'black' }}>
              <IonLabel style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>Solo Ida</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="vuelta" style={{ '--border-radius': '20px', '--background-checked': 'white', '--color-checked': 'black' }}>
              <IonLabel style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>Ida y Vuelta</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </div>

        <div className="input-card" style={{ display: 'flex', alignItems: 'center', padding: '5px 15px' }}>
          <IonIcon icon={locationOutline} className="input-icon" color="medium" />
          <IonSelect
            placeholder="Origen"
            value={origen}
            onIonChange={e => setOrigen(e.detail.value)}
            interface="action-sheet"
            style={{ width: '100%', '--padding-start': '0' }}
          >
          {CIUDADES_DISPONIBLES.map(ciudad => (
            <IonSelectOption key={"origen-" + ciudad} value={ciudad}>
              {ciudad}
              </IonSelectOption>
          ))}
          </IonSelect>
        </div>

        <div className="input-card" style={{ display: 'flex', alignItems: 'center', padding: '5px 15px' }}>
          <IonIcon icon={locationOutline} className="input-icon" color="medium" />
          <IonSelect
            placeholder="Destino"
            value={destino}
            onIonChange={e => setDestino(e.detail.value)}
            interface="action-sheet"
            style={{ width: '100%', '--padding-start': '0' }}
          >
            {CIUDADES_DISPONIBLES
            .filter(ciudad => ciudad !== origen)
            .map(ciudad => (
              <IonSelectOption key={"destino-" + ciudad} value={ciudad}>
                {ciudad}
              </IonSelectOption>
            ))}
            </IonSelect>
        </div>

        <div style={{ display: 'flex', gap: '15px', width: '100%', marginTop: '15px' }}>
          <div className="input-card" style={{
            padding: '10px 15px',
            flex: tipoViaje === 'vuelta' ? '1' : '0 0 100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <IonIcon icon={calendarOutline} color="medium" style={{ marginRigth: '8px' }} />
            <IonLabel color="medium" style={{ fontSize: '14px', fontWeight: 'bold' }}>Salida</IonLabel>
              </div>
            <IonDatetimeButton datetime="salida-buscador"></IonDatetimeButton>
            <IonModal keepContentsMounted={true}>
              <IonDatetime 
                id="salida-buscador" 
                presentation="date" 
                mode="ios"
                showDefaultButtons={true}
                doneText="Confirmar"
                cancelText="Cancelar"
                min={new Date().toDateString()}
                value={fechaSalida || undefined}
                onIonChange={e => setFechaSalida(e.detail.value as string)}
              ></IonDatetime>
            </IonModal>
          </div>

          {tipoViaje === 'vuelta' && (
            <div className="input-card" style={{
             padding: '10px 15px', flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <IonIcon icon={calendarOutline} color="medium" style={{ marginRigth: '8px' }} />
                <IonLabel color="medium" style={{ fontSize: '14px', fontWeight: 'bold' }}>Retorno</IonLabel>
                </div>
              <IonDatetimeButton datetime="retorno-buscador"></IonDatetimeButton>
              
              <IonModal keepContentsMounted={true}>
                <IonDatetime 
                  id="retorno-buscador" 
                  presentation="date" 
                  mode="ios"
                  showDefaultButtons={true}
                  doneText="Confirmar"
                  cancelText="Cancelar"
                  min={ fechaSalida || new Date().toDateString()}
                  value={fechaRetorno || undefined}
                  onIonChange={e => setFechaRetorno(e.detail.value as string)}
                ></IonDatetime>
                </IonModal>
            </div>
          )}
        </div>

        <IonButton
          expand="block"
          className="ion-margin-top"
          onClick={() => buscar(origen, destino, fechaSalida)} // Usamos la función del hook con sus parámetros
          style={{
            '--background': 'var(--ion-color-primary)',
            '--box-shadow': '0 4px 10px rgba(27, 160, 152, 0.4)',
            '--border-radius': '8px',
            height: '50px',
            fontSize: '18px',
            fontWeight: 'bold',
            fontStyle: 'italic',
            margin: '30px 40px'
          }}
        >
          Buscar
        </IonButton>

        <hr style={{ margin: '30px 0', borderTop: '1px solid #ccc' }} />

        {resultados.length > 0 && (
          <div>
            <h3 style={{ fontFamily: 'serif' }}>Rutas Disponibles ({resultados.length})</h3>
            {resultados.map((ruta) => (
              <IonCard key={ruta.id} style={{ borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginBottom: '20px', background: 'white' }}>
                <IonCardContent>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                    <span>{ruta.origen} <IonIcon icon={arrowForward} /> {ruta.destino}</span>
                    <span style={{ color: 'var(--ion-color-primary)' }}>${ruta.precio}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '15px', marginTop: '10px', color: '#666' }}>
                    <span><IonIcon icon={timeOutline} style={{ verticalAlign: 'middle' }} /> {ruta.duracion}</span>
                    <span><IonIcon icon={bus} style={{ verticalAlign: 'middle' }} /> Bus Ejecutivo</span>
                  </div>
                  <IonButton expand="block" fill="outline" style={{ marginTop: '15px' }} onClick={() => reservar(ruta)}>
                    Reservar Ahora
                  </IonButton>
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        )}

        {busco && resultados.length === 0 && (
          <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
            <p>No encontramos viajes disponibles para esta fecha o destino.</p>
          </div>
        )}

        {!busco && (
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                minWidth: '100px',
                height: '100px',
                background: '#e0e0e0',
                borderRadius: '10px',
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)'
              }}></div>
            ))}
          </div>
        )}

        <IonToast
          isOpen={mostrarToast}
          onDidDismiss={() => setMostrarToast(false)}
          message={mensaje}
          duration={2000}
          position="top"
          color={mensaje.includes("confirmada") ? "success" : "warning"}
        />
      </IonContent>
    </IonPage>
  );
};

export default BuscarViajes;