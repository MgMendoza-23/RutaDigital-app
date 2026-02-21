import React, { useState } from 'react';
import {
  IonContent, IonPage, IonInput, IonButton, 
  IonIcon, IonButtons, IonMenuButton, IonSegment, IonSegmentButton, IonLabel, IonText, 
  IonToast, IonCard, IonCardContent, 
  useIonViewWillEnter 
} from '@ionic/react';
import { locationOutline, calendarOutline, personCircleOutline, arrowForward, timeOutline, bus } from 'ionicons/icons';
import { buscarRutasUsuario, crearReserva, Ruta, supabase } from '../services/supabase';
import { useHistory } from 'react-router-dom';
import '../theme/variables.css'; 

const BuscarViajes: React.FC = () => {
  const history = useHistory();
  
  // sstados de datos
  const [tipoViaje, setTipoViaje] = useState('ida');
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [fechaSalida, setFechaSalida] = useState('');
  const [fechaRetorno, setFechaRetorno] = useState(''); 
  
  // estados para logica funcional
  const [resultados, setResultados] = useState<Ruta[]>([]);
  const [mensaje, setMensaje] = useState('');
  const [mostrarToast, setMostrarToast] = useState(false);
  const [busco, setBusco] = useState(false);

  
  useIonViewWillEnter(() => {
    setOrigen('');
    setDestino('');
    setFechaSalida('');
    setFechaRetorno('');
    setResultados([]);
    setBusco(false);
  });

  const buscar = async () => {
    setBusco(true);
    
    const { data } = await buscarRutasUsuario(origen, destino);
    if (data) {
      setResultados(data as Ruta[]);
    }
  };

  const reservar = async (ruta: Ruta) => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setMensaje("⚠️ Necesitas iniciar sesión para reservar");
      setMostrarToast(true);
      return;
    }

    const { error } = await crearReserva(ruta.id!, user.id);

    if (error) {
      setMensaje("❌ Error: " + error.message);
    } else {
      setMensaje(`✅ ¡Reserva confirmada a ${ruta.destino}!`);
      setResultados([]); 
    }
    setMostrarToast(true);
  };

  return (
    <IonPage>
      
      <div className="curved-header-bg">
        <div style={{display: 'flex', justifyContent: 'space-between', padding: '15px 20px', alignItems: 'center'}}>
            <IonButtons>
                <IonMenuButton color="light" /> 
            </IonButtons>
            <div className="header-title">
                <h2>RutaDigital</h2>
                <div className="header-subtitle">INICIO</div>
            </div>
            <IonIcon icon={personCircleOutline} style={{fontSize: '35px', color: 'white'}} />
        </div>
      </div>

      <IonContent className="ion-padding" style={{'--background': '#f4f5f8'}}>
        
        <IonText color="dark">
            <h1 style={{fontFamily: 'serif', marginTop: '10px', fontSize: '28px'}}>Reservación</h1>
        </IonText>

        
        <div style={{background: '#e0e0e0', borderRadius: '25px', padding: '4px', margin: '20px 0'}}>
            <IonSegment 
                value={tipoViaje} 
                onIonChange={e => setTipoViaje(e.detail.value!)} 
                mode="ios" 
                style={{background: 'transparent'}}
            >
                <IonSegmentButton value="ida" style={{'--border-radius': '20px', '--background-checked': 'white', '--color-checked': 'black'}}>
                    <IonLabel style={{textTransform: 'capitalize', fontWeight: 'bold'}}>Solo Ida</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="vuelta" style={{'--border-radius': '20px', '--background-checked': 'white', '--color-checked': 'black'}}>
                    <IonLabel style={{textTransform: 'capitalize', fontWeight: 'bold'}}>Ida y Vuelta</IonLabel>
                </IonSegmentButton>
            </IonSegment>
        </div>

       
        
        
        <div className="input-card" style={{display:'flex', alignItems:'center', padding:'5px 15px'}}>
            <IonIcon icon={locationOutline} className="input-icon" />
            <IonInput 
                placeholder="Origen" 
                value={origen} 
                onIonChange={e => setOrigen(e.detail.value!)} 
                style={{'--padding-start': '0'}}
            />
        </div>

        
        <div className="input-card" style={{display:'flex', alignItems:'center', padding:'5px 15px'}}>
            <IonIcon icon={locationOutline} className="input-icon" />
            <IonInput 
                placeholder="Destino" 
                value={destino} 
                onIonChange={e => setDestino(e.detail.value!)} 
                style={{'--padding-start': '0'}}
            />
        </div>

        
        <div style={{display: 'flex', gap: '15px', width: '100%'}}>
            
            {/* Input Salida */}
            <div className="input-card" style={{
                display:'flex', 
                alignItems:'center', 
                padding:'5px 15px', 
                /* Si es vuelta ocupa mitad, si es ida ocupa 55% */
                flex: tipoViaje === 'vuelta' ? '1' : '0 0 55%'
            }}>
                <IonIcon icon={calendarOutline} className="input-icon" />
                <IonInput 
                    placeholder="Salida"
                    type="date" 
                    value={fechaSalida}
                    onIonChange={e => setFechaSalida(e.detail.value!)}
                    style={{'--padding-start': '0'}}
                />
            </div>

            {/* Input Retorno (Solo visible si es Ida y Vuelta) */}
            {tipoViaje === 'vuelta' && (
                <div className="input-card" style={{
                    display:'flex', 
                    alignItems:'center', 
                    padding:'5px 15px', 
                    flex: '1' // Ocupa el espacio restante
                }}>
                    <IonIcon icon={calendarOutline} className="input-icon" />
                    <IonInput 
                        placeholder="Retorno"
                        type="date"
                        value={fechaRetorno}
                        onIonChange={e => setFechaRetorno(e.detail.value!)}
                        style={{'--padding-start': '0'}}
                    />
                </div>
            )}
        </div>

        {/* Botón Buscar */}
        <IonButton 
            expand="block" 
            className="ion-margin-top"
            onClick={buscar}
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

        <hr style={{margin: '30px 0', borderTop: '1px solid #ccc'}} />

        {/* Resultados */}
        {resultados.length > 0 && (
            <div>
                 <h3 style={{fontFamily: 'serif'}}>Resultados ({resultados.length})</h3>
                 {resultados.map((ruta) => (
                    <IonCard key={ruta.id} style={{borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginBottom: '20px', background: 'white'}}>
                        <IonCardContent>
                            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', color: '#333'}}>
                                <span>{ruta.origen} <IonIcon icon={arrowForward}/> {ruta.destino}</span>
                                <span style={{color: 'var(--ion-color-primary)'}}>${ruta.precio}</span>
                            </div>
                            <div style={{display: 'flex', gap: '15px', marginTop: '10px', color: '#666'}}>
                                <span><IonIcon icon={timeOutline} style={{verticalAlign: 'middle'}}/> {ruta.duracion}</span>
                                <span><IonIcon icon={bus} style={{verticalAlign: 'middle'}}/> Bus Ejecutivo</span>
                            </div>
                            <IonButton expand="block" fill="outline" style={{marginTop: '15px'}} onClick={() => reservar(ruta)}>
                                Reservar Ahora
                            </IonButton>
                        </IonCardContent>
                    </IonCard>
                 ))}
            </div>
        )}

        {/* Mensaje Vacío */}
        {busco && resultados.length === 0 && (
             <div style={{textAlign: 'center', color: '#999', padding: '20px'}}>
                <p>No encontramos viajes disponibles 😢</p>
            </div>
        )}

        {/* Placeholders */}
        {!busco && (
            <div style={{display: 'flex', gap: '10px', overflowX: 'auto'}}>
                {[1,2,3].map(i => (
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
          color={mensaje.includes("✅") ? "success" : "warning"}
        />

      </IonContent>
    </IonPage>
  );
};

export default BuscarViajes;