import React, { useState } from 'react';
import {
  IonContent, IonPage, IonInput, IonButton, IonIcon,  
  IonItem, IonLabel, IonLoading, IonToast
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { mailOutline, lockClosedOutline, logInOutline, personAddOutline, bus, personOutline, callOutline, warningOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { registrarUsuario, iniciarSesion } from '../services/supabase';
import './Login.css'; 

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
    setCargando(true);
    let resultado;

    // Validación simple
    if(!email || !password) {
        setMensaje("Por favor completa todos los campos");
        setMostrarToast(true);
        setCargando(false);
        return;
    }

    if (esRegistro) {
        if (!nombre || !telefono) {
            setMensaje("Por favor completa todos los campos");
            setMostrarToast(true);
            setCargando(false);
            return;
        }
      resultado = await registrarUsuario(email, password, nombre, telefono);
    } else {
      resultado = await iniciarSesion(email, password);
    }

    setCargando(false);

    if (resultado.error) {
      setMensaje(resultado.error.message);
      setMostrarToast(true);
    } else {
      setMensaje(esRegistro ? "¡Cuenta creada! Bienvenido." : "¡Bienvenido a bordo!");
      setMostrarToast(true);
      history.push('/admin-rutas'); 
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        
        {/* Contenedor Principal con CSS */}
        <div className="login-container ion-padding">
            
            {/* Logo y Título */}
            <div className="header-logo">
                <IonIcon icon={bus} className="logo-icon" />
                <div className="app-title">RutaDigital</div>
                <div className="app-subtitle">Tu viaje, mejor conectado</div>
            </div>

            {/* Formulario */}
            <div>

                {/* Campo Email */}
                <IonItem lines="none" className="custom-input">
                    <IonIcon icon={mailOutline} slot="start" color="medium" />
                    <IonLabel position="floating" color="medium">Email</IonLabel>
                    <IonInput 
                        type="email" 
                        value={email} 
                        onIonChange={e => setEmail(e.detail.value!)} 
                    />
                </IonItem>

                {/* Campo Password */}
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
                        {/* Campo Nombre */}
                        <IonItem lines="none" className="custom-input">
                            <IonIcon icon={personOutline} slot="start" color="medium" />
                            <IonLabel position="floating" color="medium">Nombre Completo</IonLabel>
                            <IonInput 
                                type="text" 
                                value={nombre} 
                                onIonChange={e => setNombre(e.detail.value!)} 
                            />
                        </IonItem>

                        {/* Campo Teléfono */}
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

                {/* Botón Principal */}
                <IonButton 
                    expand="block" 
                    className="login-button" 
                    onClick={manejarAuth}
                >
                    {esRegistro ? "Registrarse Ahora" : "Iniciar Sesión"}
                    <IonIcon slot="end" icon={esRegistro ? personAddOutline : logInOutline} />
                </IonButton>
            </div>

            {/* Footer (Cambiar modo) */}
            <div className="footer-text">
                {esRegistro ? "¿Ya tienes cuenta? " : "¿Nuevo usuario? "}
                <span className="link-action" onClick={() => setEsRegistro(!esRegistro)}>
                    {esRegistro ? "Ingresa aquí" : "Crea una cuenta"}
                </span>
            </div>

        </div>

        {/* Feedback visual */}
        <IonLoading isOpen={cargando} message="Procesando..." spinner="crescent" />
        <IonToast
          isOpen={mostrarToast}
          onDidDismiss={() => setMostrarToast(false)}
          message={mensaje}
          duration={10000}
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