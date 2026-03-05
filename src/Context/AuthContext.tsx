import React, {createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../API/supabase";
import { obtenerRolUsuario } from "../services/Functions.Users";

import { User } from "@supabase/supabase-js";
import { AuthContextType } from "../models/types";

const AuthContext = createContext<AuthContextType>({ user: null, role: null, loading: true });

export const AuthProvider: React.FC <{children: React.ReactNode}> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const inicializarSesion = async () => {
            console.log("1. Iniciando verificación de sesión");
            try {
                const { data: { session}, error } = await supabase.auth.getSession();
                console.log("2. Respuesta de supabese recivida.");
                if (error) throw error;

                if (session?.user) {
                console.log("3. Usuario detectado, buscando rolen BD...");

                const userRole = await obtenerRolUsuario(session.user.id);
                console.log("4. Rol obtenido:", userRole);

                setUser(session.user);
                setRole(userRole);
            }else {
                console.log("3. No hay usuario logueado. pantalla limpia.");
            }
        } catch (error) {
            console.error("Error critico en AunthContext:", error);
        } finally {
            console.log("5. Finalizando carga (setLoading = false)");
            setLoading(false);
        }
    };

        inicializarSesion();    

        const seguro = setTimeout(() => {
            setLoading(estadoActual => {
                if (estadoActual) {
                    console.warn("Supabase tardo demasiado. Forzando el cierre de la pantalla de carga");
                    return false;
            }
            return estadoActual;
        });
        }, 5000);

        const { data: {subscription} } = supabase.auth.onAuthStateChange(async (_event, session) => {
            
            if (session?.user) {
                const userRole = await obtenerRolUsuario(session.user.id);
                setUser(session.user);
                setRole(userRole);
            } else {
                setUser(null);
                setRole(null);
            }

    }); 

    return () => {
        clearTimeout(seguro);
        subscription.unsubscribe();
    };
    }, []);

    return (
        <AuthContext.Provider value={{ user, role, loading }}>
            {children}
        </AuthContext.Provider>
        );
    };
export const useAuth = () => useContext(AuthContext);