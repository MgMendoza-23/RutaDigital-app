import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import Login from './pages/Login';
import AdminRutas from './pages/AdminRutas';


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
      <IonRouterOutlet>
        
        {/* Ruta 1: Login (Raíz) */}
        <Route exact path="/">
          <Login />
        </Route>
        
        {/* Ruta 2: Admin */}
        <Route exact path="/admin-rutas">
          <AdminRutas />
        </Route>

        {/* Si escriben una ruta rara, redirigir al Login */}
        <Route render={() => <Redirect to="/" />} />
        
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;