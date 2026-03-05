import { Redirect, Route } from "react-router-dom";
import { IonRouterOutlet, IonPage, IonSpinner } from "@ionic/react";


import Login from "../pages/Login";
import BuscarViajes from "../pages/BuscarViajes";
import AdminRutas from "../pages/AdminRutas";
import TodasLasRutas from "../pages/TodasLasRutas";

import ProtectedRoute from "../routes/ProtectedRoute";
import { useAuth } from "../Context/AuthContext";

const AppRoutes: React.FC = () => {
  const {user, role, loading } = useAuth();

    return (
      <IonRouterOutlet id="main-content">     

        <Route exact path="/login" render={() =>{
          if (loading) {
            return (
              <IonPage style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <IonSpinner name="crescent" color="primary" />
              </IonPage>
            );
          }

          if (user) {
            return <Redirect to={role === 'admin' ? '/admin-rutas' : '/buscar-viajes'} />;
          }

          return <Login />;
          }} />

          <ProtectedRoute exact path="/buscar-viajes" component={BuscarViajes} requiredRole="usuario" />
          <ProtectedRoute exact path="/todas-las-rutas" component={TodasLasRutas} requiredRole="usuario" />

          <ProtectedRoute
            exact
            path="/admin-rutas"
            component={AdminRutas}
            requiredRole="admin"
            />

          <Route exact path="/">
            <Redirect to="/login" />
          </Route>

      </IonRouterOutlet>
  );
};

export default AppRoutes;