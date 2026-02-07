import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initial Session Check
    useEffect(() => {
        let mounted = true;

        const initAuth = async () => {
            try {
                // 1. Try LocalStorage (Persist Demo/Hardcoded Users)
                const storedUser = localStorage.getItem('demo_user');
                const storedRole = localStorage.getItem('demo_role');

                if (storedUser && storedRole) {
                    if (mounted) {
                        setCurrentUser(JSON.parse(storedUser));
                        setUserRole(storedRole);
                        setLoading(false);
                    }
                    return;
                }

                // 2. Try Supabase Session
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user && mounted) {
                    await fetchUserRole(session.user);
                } else {
                    if (mounted) setLoading(false);
                }
            } catch (error) {
                console.warn("Auth Init Error:", error);
                if (mounted) setLoading(false);
            }
        };

        initAuth();

        // Listen for Supabase changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (mounted) {
                // Only override if we DON'T have a forced local session
                if (!localStorage.getItem('demo_user')) {
                    if (session?.user) {
                        await fetchUserRole(session.user);
                    } else {
                        setCurrentUser(null);
                        setUserRole(null);
                    }
                }
                setLoading(false);
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const fetchUserRole = async (user) => {
        try {
            // Try fetching profile from DB
            const { data } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();

            // If ID mismatch but email matches (common in dev resets), try email
            let finalData = data;
            if (!finalData && user.email) {
                const { data: emailData } = await supabase.from('users').select('*').eq('email', user.email).single();
                if (emailData) finalData = emailData;
            }

            const role = finalData?.role || user.user_metadata?.role || 'Donor';
            setUserRole(role);

            // Merge metadata
            const merged = {
                ...user,
                ...finalData,
                user_metadata: { ...user.user_metadata, ...finalData }
            };
            setCurrentUser(merged);

        } catch (error) {
            console.error("Role fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const persistSession = (user, role) => {
        setCurrentUser(user);
        setUserRole(role);
        localStorage.setItem('demo_user', JSON.stringify(user));
        localStorage.setItem('demo_role', role);
    };

    const updatePoints = async (pointsToAdd) => {
        if (!currentUser) return;
        const newPoints = (currentUser.user_metadata?.points || 0) + pointsToAdd;

        // Update Local State
        const updatedUser = {
            ...currentUser,
            user_metadata: { ...currentUser.user_metadata, points: newPoints }
        };
        persistSession(updatedUser, userRole);

        toast.success(`+${pointsToAdd} Impact Points! 🌟`);

        // Try DB Update
        try {
            // If real ID, update DB
            if (currentUser.id && !currentUser.id.toString().startsWith('demo') && !currentUser.id.toString().startsWith('hardcoded')) {
                await supabase.from('users').update({ points: newPoints }).eq('id', currentUser.id);
            }
        } catch (e) {
            console.warn("DB Point sync failed", e);
        }
    };

    const signup = async (email, password, name, role) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email, password, options: { data: { name, role, points: 0 } }
            });

            if (error) {
                if (error.message.includes("already registered")) {
                    toast("User exists! Logging in...", { icon: '🔄' });
                    return await login(email, password);
                }
                throw error;
            }

            if (data.user) {
                await supabase.from('users').upsert([{ id: data.user.id, email, name, role, points: 0 }]);
                persistSession(data.user, role);
                toast.success("Account created!");
            }
            return data;
        } catch (error) {
            toast.error(error.message);
            throw error;
        }
    };

    const login = async (email, password) => {
        try {
            // 1. Try Standard Supabase Auth First
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });

            if (!error && data.user) {
                await fetchUserRole(data.user);
                toast.success("Logged in!");
                return data;
            }

            // 2. DB Fallback (Demo Mode)
            const { data: demoUser } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                // .eq('password', password) // Relaxed password check for demo
                .single();

            // 3. Check Hardcoded List if DB fails or for speed
            const fallbackUsers = {
                'admin@ngo.org': { name: 'Aditi Rao', role: 'NGO', points: 120 },
                'rahul@volunteer.com': { name: 'Rahul Sharma', role: 'Volunteer', points: 350 },
                'priya@donor.com': { name: 'Priya Verma', role: 'Donor', points: 50 },
                'vikram@volunteer.com': { name: 'Vikram Singh', role: 'Volunteer', points: 200 },
                'sneha@donor.com': { name: 'Sneha Gupta', role: 'Donor', points: 100 }
            };

            const targetUser = demoUser || (fallbackUsers[email] ? { ...fallbackUsers[email], email } : null);

            if (targetUser) {
                const fakeUser = {
                    id: targetUser.id || 'demo-' + email,
                    email: email,
                    user_metadata: {
                        name: targetUser.name,
                        role: targetUser.role,
                        points: targetUser.points
                    }
                };
                persistSession(fakeUser, targetUser.role);
                toast.success(`Welcome ${targetUser.name} (Demo)`);
                return { user: fakeUser };
            }

            throw error || new Error("Invalid credentials");

        } catch (error) {
            console.error("Login fatal:", error);
            throw error;
        }
    };

    const logout = async () => {
        localStorage.removeItem('demo_user');
        localStorage.removeItem('demo_role');
        await supabase.auth.signOut();
        setCurrentUser(null);
        setUserRole(null);
        toast.success("Signed out");
    };

    return (
        <AuthContext.Provider value={{ currentUser, userRole, loading, signup, login, logout, updatePoints }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
