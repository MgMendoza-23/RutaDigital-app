
import React, { useEffect, useState } from 'react';
import {
  IonContent, IonPage, IonButtons, IonMenuButton, IonIcon, 
  IonCard, IonCardContent, IonButton, IonText, IonLoading
} from '@ionic/react';
import { personCircleOutline, arrowForward, timeOutline, bus } from 'ionicons/icons';


// importamos el archivo css
import '../CSS/variables.css';


/*
Funciones en Archivo "../services/Functions.Users.ts"

-> Buscar rutas Usuario
-> Crear reserva
-> Obtener Mis Reservas
-> Obtener rol usuario al loguear


Funciones en Archivo "..//API/supabase.ts"

-> supabase

*/

// obteniendo el modelo de datos de las rutas
import { Ruta } from "../models/types";



import { supabase } from '../API/supabase';

import {  crearReserva } from '../services/Functions.Users';



const TodasLasRutas: React.FC = () => {
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [cargando, setCargando] = useState(true);


  useEffect(() => {
    cargarRutas();
  }, []);


  // Funcion asincrona para cargar todas las Rutas existentes 

  const cargarRutas = async () => {
    const { data } = await supabase.from('rutas').select('*');
    if (data) setRutas(data as Ruta[]);
    setCargando(false);
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
                <div className="header-subtitle">CATÁLOGO</div>
            </div>
            <IonIcon icon={personCircleOutline} style={{fontSize: '35px', color: 'white'}} />
        </div>
      </div>

      <IonContent className="ion-padding" style={{'--background': '#f4f5f8'}}>
        <IonText color="dark">
            <h1 style={{fontFamily: 'serif', marginTop: '10px', fontSize: '28px', textAlign:'center'}}>
                Destinos Disponibles
            </h1>
        </IonText>

        <IonLoading isOpen={cargando} message="Cargando viajes..." />

        {rutas.map((ruta) => (
            <IonCard key={ruta.id} style={{borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginBottom: '20px'}}>
                <IonCardContent>
                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', color: '#333'}}>
                        <span>{ruta.origen} <IonIcon icon={arrowForward}/> {ruta.destino}</span>
                        <span style={{color: 'var(--ion-color-primary)'}}>${ruta.precio}</span>
                    </div>
                    <div style={{display: 'flex', gap: '15px', marginTop: '10px', color: '#666'}}>
                        <span><IonIcon icon={timeOutline} style={{verticalAlign: 'middle'}}/> {ruta.duracion}</span>
                        <span><IonIcon icon={bus} style={{verticalAlign: 'middle'}}/> Bus Ejecutivo</span>
                    </div>
                
                    <IonButton expand="block" fill="outline" style={{marginTop: '15px'}}>
                        Ver Detalles
                    </IonButton>
                </IonCardContent>
            </IonCard>
        ))}

      </IonContent>
    </IonPage>
  );
};

export default TodasLasRutas;