import React, { useState, useEffect } from 'react';
import { 
    IonContent, IonPage, IonButtons, IonBackButton, 
    IonButton, IonIcon, IonItem, 
    IonInput, IonLabel, IonList, IonText, IonLoading, IonToast, IonChip 
} from '@ionic/react';
import { personOutline, callOutline, mailOutline, saveOutline, shieldCheckmarkOutline, personCircleOutline } from 'ionicons/icons';
import { useAuth } from '../Context/AuthContext';
import { actualizarPerfilUsuario } from '../services/userService';
import '../css/variables.css';

const Perfil: React.FC = () => {
    const { user, role } = useAuth();
    
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [mostrarToast, setMostrarToast] = useState(false);

    // Carga de los datos actuales del usuario al entrar
    useEffect(() => {
        if (user && user.user_metadata) {
            setNombre(user.user_metadata.full_name || '');
            setTelefono(user.user_metadata.phone || '');
        }
    }, [user]);

    const guardarCambios = async () => {
        if (!nombre || !telefono) {
            setMensaje("Los campos no pueden estar vacíos");
            setMostrarToast(true);
            return;
        }

        setCargando(true);
        const { error } = await actualizarPerfilUsuario(nombre, telefono);
        setCargando(false);

        if (error) {
            setMensaje("Error al actualizar: " + error.message);
        } else {
            setMensaje("Perfil actualizado correctamente");
        }
        setMostrarToast(true);
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
                        <div className="header-subtitle">MI PERFIL</div>
                      </div>
                      <IonIcon icon={personCircleOutline} style={{ fontSize: '35px', color: 'white' }} />
                    </div>
                  </div>

            <IonContent className="ion-padding" style={{ '--background': '#e9ecf5' }}>
                
                {/* Cabecera del Perfil (Avatar y Rol) */}
                <div style={{ textAlign: 'center', margin: '30px 0' }}>
                    <div style={{ 
                        width: '100px', 
                        height: '100px', 
                        background: 'var(--ion-color-primary)', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        margin: '0 auto',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                    }}>
                        <span style={{ fontSize: '40px', color: 'white', fontWeight: 'bold' }}>
                            {nombre ? nombre.charAt(0).toUpperCase() : '?'}
                        </span>
                    </div>
                    <h2 style={{ fontWeight: 'bold', marginTop: '15px', marginBottom: '5px' }}>{nombre}</h2>
                    <IonChip color="primary" mode="ios">
                        <IonIcon icon={shieldCheckmarkOutline} />
                        <IonLabel style={{ textTransform: 'capitalize' }}>{role === 'admin' ? 'Administrador' : 'Usuario Digital'}</IonLabel>
                    </IonChip>
                </div>

                <div style={{ background: 'white', borderRadius: '20px', padding: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <IonList lines="none">
                        <IonText color="medium" style={{ padding: '15px', fontSize: '14px', fontWeight: 'bold' }}>DATOS PERSONALES</IonText>
                        
                        <IonItem className="input-card" style={{ margin: '10px' }}>
                            <IonIcon icon={personOutline} slot="start" color="medium" />
                            <IonInput 
                                label="Nombre completo" 
                                labelPlacement="floating" 
                                value={nombre} 
                                onIonChange={e => setNombre(e.detail.value!)} 
                            />
                        </IonItem>

                        <IonItem className="input-card" style={{ margin: '10px' }}>
                            <IonIcon icon={callOutline} slot="start" color="medium" />
                            <IonInput 
                                type="tel" 
                                label="Teléfono" 
                                labelPlacement="floating" 
                                value={telefono} 
                                onIonChange={e => setTelefono(e.detail.value!)} 
                            />
                        </IonItem>

                        <IonItem className="input-card" style={{ margin: '10px', opacity: 0.7 }}>
                            <IonIcon icon={mailOutline} slot="start" color="medium" />
                            <IonInput 
                                label="Correo electrónico" 
                                labelPlacement="floating" 
                                value={user?.email} 
                                readonly={true} 
                            />
                        </IonItem>
                    </IonList>
                </div>

                <IonButton 
                    expand="block" 
                    className="ion-margin-top" 
                    onClick={guardarCambios}
                    style={{ 
                        '--background': 'var(--ion-color-primary)', 
                        height: '50px', 
                        fontSize: '16px', 
                        fontWeight: 'bold',
                        marginTop: '30px'
                    }}
                >
                    Guardar Cambios
                    <IonIcon slot="end" icon={saveOutline} />
                </IonButton>

                <IonLoading isOpen={cargando} message="Actualizando perfil..." />
                <IonToast 
                    isOpen={mostrarToast} 
                    onDidDismiss={() => setMostrarToast(false)} 
                    message={mensaje} 
                    duration={2000} 
                    color={mensaje.includes("Error") ? "warning" : "success"}
                    position="top"
                />

            </IonContent>
        </IonPage>
    );
};

export default Perfil;