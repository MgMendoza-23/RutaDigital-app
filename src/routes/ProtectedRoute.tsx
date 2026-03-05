import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

import { ProtectedRouteProps } from "../models/types";
import { IonPage } from "@ionic/react";

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, requiredRole, ...rest }) => {
    const { user, role, loading } = useAuth();

    return (
        <Route {...rest} render={(props) =>{
            if (loading) 
                return <IonPage></IonPage>

            if (!user) {
                return <Redirect to="/login" />;
            }

            if (requiredRole === 'admin' && role !== 'admin') {
                return <Redirect to="/buscar-viajes" />;
            }
            return Component ? <Component {...props} /> : <IonPage></IonPage>;
        }} />
    );
};

export default ProtectedRoute;