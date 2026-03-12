import React, {createContext, useContext, useEffect, useState, useRef } from "react";
import { supabase } from "../API/supabase";
import { obtenerRolUsuario } from "../services/Functions.Users";

import { User } from "@supabase/supabase-js";
import { AuthContextType } from "../models/types";

const AuthContext = createContext<AuthContextType>({ user: null, role: null, loading: true });

export const AuthProvider: React.FC <{children: React.ReactNode}> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const inicializado = useRef(false);

    useEffect(() => {
        let montado = true;

        const arrancarApp = async () => {
            if (inicializado.current) return;
            inicializado.current = true;

            try {
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) console.warn("Supabase se quejo, pero sigamos:", error);
                if (session?.user && montado) {
                    const userRole = await obtenerRolUsuario(session.user.id);
                    if (montado) {
                        setRole(userRole);
                        setUser(session.user);
                    }
                }
            } catch (err) {
                console.error("Error silenciado en el arranque:", err);
            } finally {
                if (montado) setLoading(false);
            }
        };

        arrancarApp();

        const { data: {subscription} } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Evento de Supabase detectado:", event);
            if (!montado ) return;
            
            if (event === 'SIGNED_IN' && session?.user) {
                    setLoading(true);
                    const userRole = await obtenerRolUsuario(session.user.id);
                    setRole(userRole);
                    setUser(session.user);
                    setLoading(false);
                } else if (event === 'SIGNED_OUT') {
                    setUser(null);
                    setRole(null);
                    setLoading(false);
                }

    }); 

    return () => {
        //clearTimeout(seguro);
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