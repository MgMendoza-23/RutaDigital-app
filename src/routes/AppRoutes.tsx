import { Redirect, Route } from "react-router-dom";
import { IonRouterOutlet, IonPage, IonSpinner } from "@ionic/react";


import Login from "../screens/Login";
import BuscarViajes from "../screens/BuscarViajes";
import AdminRutas from "../screens/AdminRutas";
import TodasLasRutas from "../screens/TodasLasRutas";
import DetallesReserva from "../screens/DetallesReserva";

import ProtectedRoute from "../routes/ProtectedRoute";
import { useAuth } from "../Context/AuthContext";
import Reservaciones from "../screens/Reservaciones";

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
          <ProtectedRoute exact path="/detalles-reserva" component={DetallesReserva} requiredRole="usuario" />
          <ProtectedRoute exact path="/admin-rutas" component={AdminRutas} requiredRole="admin"
            />
          <ProtectedRoute exact path="/reservaciones" component={Reservaciones} requiredRole="usuario"/>

          <Route exact path="/">
            <Redirect to="/login" />
          </Route>

      </IonRouterOutlet>
  );
};

export default AppRoutes;