import { Redirect, Route } from 'react-router-dom';
import {
  IonApp, IonContent,  IonIcon, IonItem, IonLabel, IonList, 
  IonMenu, IonMenuToggle, IonRouterOutlet,  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { personCircleOutline } from 'ionicons/icons';

/* Importacion de páginas */
import Login from './pages/Login';
import BuscarViajes from './pages/BuscarViajes';
import AdminRutas from './pages/AdminRutas';
import TodasLasRutas from './pages/TodasLasRutas';

/* CSS  */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      
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

              <IonItem routerLink="/mis-reservas" className="menu-item">
                <IonLabel>Reservaciones</IonLabel>
              </IonItem>

              <IonItem routerLink="/historial" className="menu-item">
                <IonLabel>Historial de Viajes</IonLabel>
              </IonItem>
            </IonMenuToggle>
          </IonList>

          
          <div className="menu-footer">
            <IonMenuToggle autoHide={false}>
              <IonItem button routerLink="/login" className="menu-item logout-item">
                 <IonLabel>Salir</IonLabel>
              </IonItem>
            </IonMenuToggle>

            <div className="menu-profile">
               <IonIcon icon={personCircleOutline} size="large" />
               <span>Perfil</span>
            </div>
          </div>

        </IonContent>
      </IonMenu>

      
      <IonRouterOutlet id="main-content">
        <Route exact path="/login"><Login /></Route>
        <Route exact path="/buscar-viajes"><BuscarViajes /></Route>
        <Route exact path="/todas-las-rutas"><TodasLasRutas /></Route>
        <Route exact path="/admin-rutas"><AdminRutas /></Route>
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
      </IonRouterOutlet>

    </IonReactRouter>
  </IonApp>
);

export default App;