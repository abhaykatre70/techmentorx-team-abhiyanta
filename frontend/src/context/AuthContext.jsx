import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        // Safety timeout: If Supabase takes too long, stop loading so the app renders (even if unauthenticated)
        const safetyTimeout = setTimeout(() => {
            if (mounted && loading) {
                console.warn("Supabase session check timed out. Forcing app render.");
                setLoading(false);
            }
        }, 3000); // 3 seconds timeout

        const initAuth = async () => {
            try {
                // Check active session
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;

                if (mounted) {
                    if (session?.user) {
                        await fetchUserRole(session.user);
                    } else {
                        setLoading(false);
                    }
                }
            } catch (error) {
                console.error("Auth initialization error:", error);
                if (mounted) setLoading(false);
            } finally {
                clearTimeout(safetyTimeout);
            }
        };

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (mounted) {
                if (session?.user) {
                    await fetchUserRole(session.user);
                } else {
                    setCurrentUser(null);
                    setUserRole(null);
                    setLoading(false);
                }
            }
        });

        initAuth();

        return () => {
            mounted = false;
            clearTimeout(safetyTimeout);
            subscription.unsubscribe();
        };
    }, []);

    const fetchUserRole = async (user) => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) {
                console.warn("User profile not found in 'users' table. Using metadata if available.", error);
                // Fallback to metadata if profile missing
                const metaRole = user.user_metadata?.role || 'Donor';
                setUserRole(metaRole);
                setCurrentUser({ ...user, role: metaRole });
            } else if (data) {
                setUserRole(data.role);
                setCurrentUser({ ...user, ...data });
            }
        } catch (error) {
            console.error("Unexpected error fetching user role:", error);
        } finally {
            setLoading(false);
        }
    };

    const signup = async (email, password, name, role) => {
        // 1. Sign up the user with Supabase Auth
        // We pass data in 'options' so it can be used by Triggers if you set them up later
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name, role }
            }
        });

        if (error) throw error;

        // 2. Create the user profile in the 'public.users' table
        // Note: If you have a Supabase Trigger that automatically creates a user in 'public.users',
        // this step might be redundant or cause a duplicate key error. This manual step ensures
        // the profile exists if no trigger is set up.
        if (data.user) {
            const { error: profileError } = await supabase
                .from('users')
                .upsert([ // Using upsert to prevent unique constraint errors if a trigger already did it
                    {
                        id: data.user.id,
                        email: email,
                        name: name,
                        role: role,
                        created_at: new Date()
                    }
                ]);

            if (profileError) {
                console.error("Error creating user profile:", profileError);
                // Optionally revert auth creation if profile fails? 
                // meaningful error reporting is better for now.
                throw profileError;
            }

            setUserRole(role);
            toast.success("Account created! Please check your email for verification.");
        }
        return data;
    };

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        if (data.user) {
            await fetchUserRole(data.user);
            toast.success("Logged in successfully!");
        }
        return data;
    };

    const loginWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google'
        });
        if (error) {
            console.error(error);
            toast.error("Google login failed");
        }
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) toast.error("Error signing out");
        else toast.success("Signed out");
    };

    const value = {
        currentUser,
        userRole,
        loading,
        signup,
        login,
        loginWithGoogle,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
