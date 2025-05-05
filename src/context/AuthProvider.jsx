// src/context/AuthProvider.jsx
import React, {useEffect, useState} from 'react';
import { AuthContext } from "./AuthContext.tsx";
import {supabase} from "../model/net/supabase-client.js";
import {useNavigate} from 'react-router-dom';

const AuthProvider = ({ children }) => {
    // Add console.log at the beginning of the component body
    console.log('AuthProvider rendering');
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        console.log('AuthProvider useEffect');
        // Initialize authentication state
        console.log('Getting session');
        supabase.auth.getSession().then(
            ({ data: { session } }) => {
                console.log('Get session user', session?.user ?? null);
                setUser(session?.user ?? null);
            }
        ).catch(
            err => {
                console.error("Error initializing auth:", err);
                setError(err.message || "Failed to initialize authentication");
            }
        ).finally(
            () => {
                console.log('Set initializing to false in AuthProvider.js useEffect');
                setInitializing(false);
            }
        );

        console.log('Creating auth state change listener');
        const { data: listener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                console.log('Auth state change event', event);
                setUser(session?.user ?? null);
                console.log('Auth state change user', session?.user ?? null);
                if (event === 'SIGNED_IN') {
                    navigate('/dashboard');
                }
                if (event === 'SIGNED_OUT') {
                    navigate('/');
                }
            }
        );

        return () => {
            console.log('AuthProvider useEffect cleanup');
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
            setError(err.message || 'Failed to login');
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
            setError(err.message || 'Failed to logout');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const isAuthenticated = () => {
        return user !== null;
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            error,
            initializing,
            signInWithProvider,
            signOut,
            isAuthenticated,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;