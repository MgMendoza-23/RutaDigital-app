import { Redirect, Route } from "react-router-dom";
import { IonRouterOutlet, IonPage, IonSpinner } from "@ionic/react";


import Login from "../screens/Login";
import BuscarViajes from "../screens/BuscarViajes";
import AdminRutas from "../screens/AdminRutas";
import TodasLasRutas from "../screens/TodasLasRutas";
import DetallesReserva from "../screens/DetallesReserva";
import SeleccionAsientos from "../screens/SeleccionAsientos";
import Reservaciones from "../screens/Reservaciones";
import ProtectedRoute from "../routes/ProtectedRoute";
import DatosContactoReserva from "../screens/DatosContactoReserva";
import BoletoDigital from "../screens/BoletoDigital";
import AdminPasajeros from "../screens/AdminPasajeros";
import Perfil from "../screens/Perfil";
import AdminEscaner from "../screens/AdminScanner";
import HistorialViajes from "../screens/HistorialViajes";
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
          <ProtectedRoute exact path="/detalles-reserva" component={DetallesReserva} requiredRole="usuario" />
          <ProtectedRoute exact path="/admin-rutas" component={AdminRutas} requiredRole="admin"/>
          <ProtectedRoute exact path="/seleccion-asientos" component={SeleccionAsientos} requiredRole="usuario" />
          <ProtectedRoute exact path="/reservaciones" component={Reservaciones} requiredRole="usuario"/>
          <ProtectedRoute exact path="/datos-contacto" component={DatosContactoReserva} requiredRole="usuario"/>
          <ProtectedRoute exact path="/boleto-digital" component={BoletoDigital} requiredRole="usuario"/>
          <ProtectedRoute exact path="/admin-pasajeros" component={AdminPasajeros} requiredRole="admin"/>
          <ProtectedRoute exact path="/admin-escaner" component={AdminEscaner} requiredRole="admin"/>
          <ProtectedRoute exact path="/historial-viajes" component={HistorialViajes} requiredRole="usuario"/>
          <ProtectedRoute exact path="/perfil" component={Perfil} />

          <Route exact path="/">
            <Redirect to="/login" />
          </Route>

      </IonRouterOutlet>
  );
};

export default AppRoutes;