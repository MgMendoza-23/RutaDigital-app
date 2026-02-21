import React, { useState } from 'react';
import {
  IonContent, IonPage, IonInput, IonButton, IonIcon,  
  IonItem, IonLabel, IonLoading, IonToast
} from '@ionic/react';
import { mailOutline, lockClosedOutline, logInOutline, personAddOutline, bus, personOutline, callOutline, warningOutline, checkmarkCircleOutline } from 'ionicons/icons';

//importamos archivo css

import "../CSS/Login.css";



/*


Funciones en Archivo Functions.Users.ts

-> Buscar rutas
-> Crear reserva
-> Obtener reservas del usuario
-> Obtener rol usuario al loguear


Funciones en Archivo Functions.Auth.ts

-> Registrar usuario
-> Iniciar Sesion
-> Cerrar Sesion


*/

import { registrarUsuario, iniciarSesion } from '../services/Functions.Auth';

import { obtenerRolUsuario } from '../services/Functions.Users';




const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [esRegistro, setEsRegistro] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [mostrarToast, setMostrarToast] = useState(false);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');

  const manejarAuth = async () => {
    setCargando(true);
    let resultado;

    // Validación normalita
    if(!email || !password) {
        setMensaje("Por favor completa todos los campos");
        setMostrarToast(true);
        setCargando(false);
        return;
    }

    if (esRegistro && (!nombre || !telefono)) {
            setMensaje("Por favor completa todos los campos");
            setMostrarToast(true);
            setCargando(false);
            return;
        }

    if (esRegistro) {
      resultado = await registrarUsuario(email, password, nombre, telefono);
    } else {
      resultado = await iniciarSesion(email, password);
    }

    setCargando(false);

    if (resultado.error) {
      setMensaje("Error: " + resultado.error.message);
      setMostrarToast(true);
    } else {
     
    if (resultado.data && resultado.data.user) {
      const rol = await obtenerRolUsuario(resultado.data.user.id);

      setMensaje(esRegistro ? "¡Cuenta creada! Bienvenido." : `Bienvenido ${nombre || ''}`);
      setMostrarToast(true);

      setTimeout(() => {
        if (rol === 'admin') {
          console.log("Usuario es ADMIN -> Panel");
          window.location.href = '/admin-rutas';
        } else {
          console.log("Usuario es CLIENTE -> Buscador");
          window.location.href = '/buscar-viajes';
    }
    setEmail('');
    setPassword('');
    setMostrarToast(false);
  }, 1000);
    }
  }
};

  return (
    <IonPage>
      <IonContent fullscreen>
        
      
        <div className="login-container ion-padding">
            
            
            <div className="header-logo">
                <IonIcon icon={bus} className="logo-icon" />
                <div className="app-title">RutaDigital</div>
                <div className="app-subtitle">Tu viaje, mejor conectado</div>
            </div>

            
            <div>

               
                <IonItem lines="none" className="custom-input">
                    <IonIcon icon={mailOutline} slot="start" color="medium" />
                    <IonLabel position="floating" color="medium">Email</IonLabel>
                    <IonInput 
                        type="email" 
                        value={email} 
                        onIonChange={e => setEmail(e.detail.value!)} 
                    />
                </IonItem>

                
                <IonItem lines="none" className="custom-input">
                    <IonIcon icon={lockClosedOutline} slot="start" color="medium" />
                    <IonLabel position="floating" color="medium">Contraseña</IonLabel>
                    <IonInput 
                        type="password" 
                        value={password} 
                        onIonChange={e => setPassword(e.detail.value!)} 
                    />
                </IonItem>

                {esRegistro && (
                    <>
                        
                        <IonItem lines="none" className="custom-input">
                            <IonIcon icon={personOutline} slot="start" color="medium" />
                            <IonLabel position="floating" color="medium">Nombre Completo</IonLabel>
                            <IonInput 
                                type="text" 
                                value={nombre} 
                                onIonChange={e => setNombre(e.detail.value!)} 
                            />
                        </IonItem>

                        
                        <IonItem lines="none" className="custom-input">
                            <IonIcon icon={callOutline} slot="start" color="medium" />
                            <IonLabel position="floating" color="medium">Teléfono Móvil</IonLabel>
                            <IonInput 
                                type="tel" 
                                value={telefono} 
                                onIonChange={e => setTelefono(e.detail.value!)} 
                            />
                        </IonItem>
                    </>
                )}

                
                <IonButton 
                    expand="block" 
                    className="login-button" 
                    onClick={manejarAuth}
                >
                    {esRegistro ? "Registrarse Ahora" : "Iniciar Sesión"}
                    <IonIcon slot="end" icon={esRegistro ? personAddOutline : logInOutline} />
                </IonButton>
            </div>


            
            <div className="footer-text">
                {esRegistro ? "¿Ya tienes cuenta? " : "¿Nuevo usuario? "}
                <span className="link-action" onClick={() => setEsRegistro(!esRegistro)}>
                    {esRegistro ? "Ingresa aquí" : "Crea una cuenta"}
                </span>
            </div>

        </div>

        
        <IonLoading isOpen={cargando} message="Procesando..." spinner="crescent" />
        <IonToast
          isOpen={mostrarToast}
          onDidDismiss={() => setMostrarToast(false)}
          message={mensaje}
          duration={500}
          position="top"

          className="custom-toast"
          icon={mensaje.includes("Bienvenido") || mensaje.includes("creada") ? checkmarkCircleOutline : warningOutline}
          buttons={[
            {
              text: 'OK',
              role: 'cancel',
              handler: () => { console.log('Cerrar toast'); }
            }
          ]}
        />

      </IonContent>
    </IonPage>
  );
};

export default Login;