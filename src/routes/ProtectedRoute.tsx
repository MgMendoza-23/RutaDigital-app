import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

import { ProtectedRouteProps } from "../models/types";
import { IonPage, IonSpinner } from "@ionic/react";

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, requiredRole, ...rest }) => {
    const { user, role, loading } = useAuth();


    if (loading) {
         return (
            <IonPage style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <IonSpinner name="crescent" color="primary" />
            </IonPage>
        );
            
    }
   
    if (!user) {
            return <Redirect to="/login" />;
    }

    if (role === 'usuario' && requiredRole === 'admin') {
        return <Redirect to="/buscar-viajes" />;
    }
        return <Route {...rest} render={() => <Component/>} />;
};

export default ProtectedRoute;