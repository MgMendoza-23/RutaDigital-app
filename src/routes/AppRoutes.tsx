
import { Redirect, Route } from "react-router-dom";
import { IonRouterOutlet } from "@ionic/react";


import Login from "../pages/Login";
import BuscarViajes from "../pages/BuscarViajes";
import AdminRutas from "../pages/AdminRutas";
import TodasLasRutas from "../pages/TodasLasRutas";

const AppRoutes: React.FC = () => {
  return (
    <IonRouterOutlet id="main-content">

      <Route exact path="/login" component={Login} />
      <Route exact path="/buscar-viajes" component={BuscarViajes} />
      <Route exact path="/todas-las-rutas" component={TodasLasRutas} />
      <Route exact path="/admin-rutas" component={AdminRutas} />

      <Route exact path="/">
        <Redirect to="/login" />
      </Route>

    </IonRouterOutlet>
  );
};

export default AppRoutes;
