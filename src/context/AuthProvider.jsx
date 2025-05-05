// src/context/AuthProvider.jsx
import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext.tsx";
import { supabase } from "../model/net/supabase-client.js";
import { useNavigate } from "react-router-dom";

const AuthProvider = ({ children }) => {
    console.log("Rendering AuthProvider");
    const navigate = useNavigate();
    const [authenticatedUser, setAuthenticatedUser] = useState(() => {
        const authtoken = localStorage.getItem(
            import.meta.env.VITE_SUPABASE_AUTH_TOKEN_KEY
        );
        return authtoken ? JSON.parse(authtoken).user : null;
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        console.log("useEffect AuthProvider");
        supabase.auth
            .getUser()
            .then(({ data: { user } }) => {
                if (!authenticatedUser && user) {
                    setAuthenticatedUser(user);
                    navigate("/dashboard");
                }
            })
            .catch((err) => {
                console.error("Error getting user:", err);
                setError(err.message || "Failed to get user");
            })
            .finally(() => {
                setInitializing(false);
            });

        const { data: listener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setAuthenticatedUser(session?.user ?? null);
                if (event === "SIGNED_OUT") {
                    navigate("/");
                }
            }
        );
        return () => {
            listener.subscription.unsubscribe();
        };
    }, [navigate]);

    const signInWithProvider = async (provider) => {
        setLoading(true);
        setError(null);

        try {
            await supabase.auth.signInWithOAuth({
                provider: provider,
            });
        } catch (err) {
            console.error(`${provider} login error:`, err);
            setError(err.message || "Failed to login");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        setLoading(true);
        try {
            await supabase.auth.signOut();
        } catch (err) {
            setError(err.message || "Failed to logout");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const isAuthenticated = () => {
        return authenticatedUser !== null;
    };

    return (
        <AuthContext.Provider
            value={{
                user: authenticatedUser,
                loading,
                error,
                initializing,
                signInWithProvider,
                signOut,
                isAuthenticated,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
