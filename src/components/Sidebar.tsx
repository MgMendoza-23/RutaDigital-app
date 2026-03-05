import React from "react";
import {IonContent, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle} from "@ionic/react";
import { personCircleOutline } from "ionicons/icons";
import { cerrarSesion } from "../services/Functions.Auth";
import { useAuth } from "../Context/AuthContext";

const Sidebar: React.FC = () => {
  const { role } = useAuth();

  const manejarCerrarSesion = async () => {
    try {
      await cerrarSesion();

    } catch (error) {
      console.warn("Cierre forzado local");
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/login";
    }
  };

  return (
    <IonMenu contentId="main-content" type="overlay" className="custom-menu">
      <IonContent className="menu-gradient">

        <div className="menu-header">
          <h2>RutaDigital</h2>
          <div className="underline"></div>
        </div>

        <IonList lines="none" className="menu-list">
          <IonMenuToggle autoHide={false}>

            <IonItem routerLink="/buscar-viajes" className="menu-item" detail={false}>
              <IonLabel>Inicio</IonLabel>
            </IonItem>

            <IonItem routerLink="/todas-las-rutas" className="menu-item" detail={false}>
              <IonLabel>Rutas</IonLabel>
            </IonItem>

            {role === 'admin' && (
              <IonItem routerLink="/admin-rutas" className="menu-item" detail={false}>
                <IonLabel>Panel de Control</IonLabel>
              </IonItem>
            )}

            {role === 'usuario' && (
              <>
              <IonItem routerLink="/mis-reservas" className="menu-item">
              <IonLabel>Reservaciones</IonLabel>
              </IonItem>

              <IonItem routerLink="/historial" className="menu-item">
              <IonLabel>Historial de Viajes</IonLabel>
            </IonItem>
              </>
            )}
           
          </IonMenuToggle>
        </IonList>

        <div className="menu-footer">
          <IonMenuToggle autoHide={false}>
            <IonItem button onClick={manejarCerrarSesion} className="menu-item logout-item">
              <IonLabel>Salir</IonLabel>
            </IonItem>
          </IonMenuToggle>

          <div className="menu-profile">
            <IonIcon icon={personCircleOutline} size="large" />
            <span>{role === 'admin' ? 'Administrador': 'Perfil'}</span>
          </div>
        </div>

      </IonContent>
    </IonMenu>
  );
};

export default Sidebar;
