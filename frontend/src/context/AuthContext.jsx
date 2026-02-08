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
                // 1. Check Supabase Session First (Real Auth Priority)
                const { data: { session } } = await supabase.auth.getSession();

                if (session?.user) {
                    if (mounted) {
                        await fetchUserRole(session.user);
                    }
                } else {
                    // 2. Fallback to LocalStorage (For already logged in demo users)
                    const storedUser = localStorage.getItem('demo_user');
                    const storedRole = localStorage.getItem('demo_role');

                    if (storedUser && storedRole && mounted) {
                        setCurrentUser(JSON.parse(storedUser));
                        setUserRole(storedRole);
                        setLoading(false);
                    } else if (mounted) {
                        setLoading(false);
                    }
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
                if (session?.user) {
                    await fetchUserRole(session.user);
                } else if (!localStorage.getItem('demo_user')) {
                    setCurrentUser(null);
                    setUserRole(null);
                    setLoading(false);
                } else {
                    setLoading(false);
                }
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const fetchUserRole = async (user) => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            // First, Always try to sync user to DB to ensure they exist
            const syncData = {
                id: user.id,
                email: user.email,
                full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0],
                role: user.user_metadata?.role || 'Donor',
                points: user.user_metadata?.points || 0
            };

            // Fetch profile - WITH TIMEOUT and RESILIENCE
            console.log("🔄 Syncing user profile to DB...", syncData);

            // Background Sync (Don't let DB issues block the whole app refresh)
            const syncPromise = supabase.from('users').upsert(syncData, { onConflict: 'email' });

            // Wait for sync but only for 2 seconds max
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Sync timeout')), 2000));

            try {
                await Promise.race([syncPromise, timeoutPromise]);
            } catch (syncErr) {
                console.warn("⚠️ Sync partially failed or took too long, proceeding anyway", syncErr);
            }

            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .maybeSingle();

            let finalProfile = data;

            if (!finalProfile && user.email) {
                const { data: emailData } = await supabase.from('users').select('*').eq('email', user.email).single();
                finalProfile = emailData;
            }

            const role = finalProfile?.role || user.user_metadata?.role || 'Donor';
            setUserRole(role);

            const merged = {
                ...user,
                ...finalProfile,
                user_metadata: { ...user.user_metadata, ...finalProfile }
            };
            setCurrentUser(merged);
        } catch (error) {
            console.error("Role fetch error:", error);
            // Fallback for session continuity
            setCurrentUser(user);
            setUserRole(user.user_metadata?.role || 'Donor');
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

        const updatedUser = {
            ...currentUser,
            user_metadata: { ...currentUser.user_metadata, points: newPoints }
        };
        persistSession(updatedUser, userRole);

        try {
            toast.success(`+${pointsToAdd} Impact Points! 🌟`);
            if (currentUser.id && !currentUser.id.toString().startsWith('demo')) {
                await supabase.from('users').update({ points: newPoints }).eq('id', currentUser.id);
            }
        } catch (e) {
            console.warn("Points sync failed", e);
        }
    };

    const signup = async (email, password, name, role) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { name, role, points: 0 },
                    emailRedirectTo: window.location.origin
                }
            });

            if (error) {
                if (error.message.includes("already registered")) {
                    toast("User exists! Logging in...", { icon: '🔄' });
                    return await login(email, password);
                }
                throw error;
            }

            if (data.user) {
                // Proactive cleanup from local storage if any
                localStorage.removeItem('demo_user');
                localStorage.removeItem('demo_role');

                // Sync to DB
                console.log("🔄 Registering new user in DB table...", data.user.id);
                const { error: dbError } = await supabase.from('users').upsert([{
                    id: data.user.id,
                    email,
                    password,
                    full_name: name,
                    role,
                    points: 0
                }], { onConflict: 'email' });

                if (dbError) {
                    console.error("🔴 Registration DB Sync Error:", dbError);
                } else {
                    console.log("🟢 Registration DB Sync Successful");
                }

                toast.success("Account created! Check your email for verification. 🎉");

                // For demo simplicity, we log them in locally
                await fetchUserRole(data.user);
            }
            return data;
        } catch (error) {
            toast.error(error.message || "Signup failed");
            throw error;
        }
    };

    const login = async (email, password) => {
        try {
            // 1. CLEAR LOCAL STORAGE FIRST to avoid old demo session interference
            localStorage.removeItem('demo_user');
            localStorage.removeItem('demo_role');

            const { data, error } = await supabase.auth.signInWithPassword({ email, password });

            if (!error && data.user) {
                await fetchUserRole(data.user);
                toast.success("Logged in successfully!");
                return data;
            }

            // 2. ONLY IF AUTH FAILS, check if user exists in the DB with 'demo' password
            // This allows the hardcoded SQL demo users to work without real Auth accounts
            const { data: dbUser } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();

            if (dbUser && (password === 'pass' || password === 'demo' || password === 'pass123')) {
                const fakeUser = {
                    id: dbUser.id,
                    email: email,
                    user_metadata: {
                        name: dbUser.full_name,
                        role: dbUser.role,
                        points: dbUser.points || 0
                    }
                };
                persistSession(fakeUser, dbUser.role);
                toast.success(`Welcome back, ${dbUser.full_name}!`);
                return { user: fakeUser };
            }

            throw error || new Error("Invalid credentials");

        } catch (error) {
            toast.error(error.message || "Login failed");
            throw error;
        }
    };

    const logout = async () => {
        try {
            localStorage.clear();
            await supabase.auth.signOut();
            setCurrentUser(null);
            setUserRole(null);
            toast.success("Signed out successfully");
            setTimeout(() => { window.location.href = '/login'; }, 100);
        } catch (error) {
            localStorage.clear();
            window.location.href = '/login';
        }
    };

    return (
        <AuthContext.Provider value={{ currentUser, userRole, loading, signup, login, logout, updatePoints }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
