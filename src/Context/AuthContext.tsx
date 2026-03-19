import React, {createContext, useContext, useEffect, useState, useRef } from "react";
import { supabase } from "../API/supabase";
import { obtenerRolUsuario } from "../services/userService";

import { User } from "@supabase/supabase-js";
import { AuthContextType } from "../models/types";

 export const AuthContext = createContext<AuthContextType>({ user: null, role: null, loading: true });

export const AuthProvider: React.FC <{children: React.ReactNode}> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const inicializacion = useRef(false);

    useEffect(() => {
        let montado = true;

        const arrancarApp = async (sessionUser: User | null) => {
            if (inicializacion.current) return;
            console.log(" AuthContext: Iniciando verificacion inicial");
            inicializacion.current= true;
            setLoading(true);

            try {
                if (sessionUser) {
                    console.log(" AuthContext: sesion existente encontrada, buscando rol");
                    const userRole = await obtenerRolUsuario(sessionUser.id);
                    if (montado) {
                        setRole(userRole);
                        setUser(sessionUser);
                        console.log(`AuthContext: Sesión y Rol (${userRole}) cargados exitosamente.`);
                }
                    } else {
                        if (montado) {
                            setUser(null);
                            setRole(null);
                        }
                    }
            } catch (error) {
                console.error("AuthContext: Error en AuthContext:", error);
            } finally {
                if (montado) setLoading(false);
                inicializacion.current = false;
                console.log("AuthContext: finalizando carga inicial");
            }
        };

        supabase.auth.getSession().then(({ data: { session } }) => {
            arrancarApp(session?.user || null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            arrancarApp(session?.user || null);
        });

        return () => {
            montado = false;
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