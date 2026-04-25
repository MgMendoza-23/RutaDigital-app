import React, { useState } from 'react';
import {IonContent, IonPage, IonInput, IonButton, IonIcon, IonItem, IonLoading, IonToast} from '@ionic/react';
import { mailOutline, lockClosedOutline, logInOutline, personAddOutline, bus, personOutline, callOutline, warningOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
//importamos archivo css

import "../css/Login.css";

import { registrarUsuario, iniciarSesion } from '../services/authService';


const Login: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [esRegistro, setEsRegistro] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [mostrarToast, setMostrarToast] = useState(false);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');

  const manejarAuth = async () => {
    if (!email || !password) {
      setMensaje("Por favor completa todos los campos");
      setMostrarToast(true);
      return;
    }
    setCargando(true);

    if (esRegistro) {
      const {error} = await registrarUsuario(email, password, nombre, telefono);

      if (error) {
        setMensaje(error.message);
      } else {
        setMensaje(' Registro exitoso. Ahora puedes iniciar sesión.');
        setEsRegistro(false);
      }
      setMostrarToast(true);

    } else {
      const {error} = await iniciarSesion(email, password);

      if (error) {
        setMensaje("Error: " + error.message);
        setMostrarToast(true);
      }

    } 
    setCargando(false);
  };

  return (
    <IonPage>
      <IonContent fullscreen style={{ '--background': 'transparent' }}>
        <div className="login-page-background">              
      
        <div className="login-container">
            
            
            <div className="header-logo">
                <IonIcon icon={bus} className="logo-icon" />
                <div className="app-title">RutaDigital</div>
                <div className="app-subtitle">Tu viaje, mejor conectado</div>
            </div>

            
            <div>
                <IonItem lines="none" className="custom-input">
                    <IonIcon icon={mailOutline} slot="start" color="medium" />
                    <IonInput 
                        type="email" 
                        placeholder="Correo electrónico"
                        value={email} 
                        onIonChange={e => setEmail(e.detail.value!)} 
                    />
                </IonItem>

                
                <IonItem lines="none" className="custom-input">
                    <IonIcon icon={lockClosedOutline} slot="start" color="medium" />
                    <IonInput 
                        type="password" 
                        placeholder="Contraseña"
                        value={password} 
                        onIonChange={e => setPassword(e.detail.value!)} 
                    />
                </IonItem>

                {esRegistro && (
                    <>
                        
                        <IonItem lines="none" className="custom-input">
                            <IonIcon icon={personOutline} slot="start" color="medium" />
                            <IonInput 
                                type="text" 
                                placeholder="Nombre Completo"
                                value={nombre} 
                                onIonChange={e => setNombre(e.detail.value!)} 
                            />
                        </IonItem>

                        
                        <IonItem lines="none" className="custom-input">
                            <IonIcon icon={callOutline} slot="start" color="medium" />
                            <IonInput 
                                type="tel" 
                                placeholder="Teléfono Móvil"
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