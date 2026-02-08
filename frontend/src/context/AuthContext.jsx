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
            // 1. Set current user immediately with what we have (resilience)
            const initialRole = user.user_metadata?.role || 'Donor';
            setCurrentUser(user);
            setUserRole(initialRole);

            // 2. Resolve loading immediately so the screen isn't stuck biank
            setLoading(false);

            // 3. Background Sync (Don't await this, let it fail quietly)
            const syncData = {
                id: user.id,
                email: user.email,
                full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0],
                role: initialRole,
                points: user.user_metadata?.points || 0
            };

            supabase.from('users').upsert(syncData, { onConflict: 'email' }).then(({ data, error }) => {
                if (error) console.warn("Background sync warning:", error.message);

                // If we got real data from the DB, update the role if it's different
                if (!error) {
                    supabase.from('users').select('role, points, full_name').eq('id', user.id).maybeSingle().then(({ data: dbUser }) => {
                        if (dbUser) {
                            setUserRole(dbUser.role);
                            setCurrentUser(prev => ({
                                ...prev,
                                ...dbUser,
                                user_metadata: { ...prev.user_metadata, ...dbUser }
                            }));
                        }
                    });
                }
            });
        } catch (error) {
            console.error("Critical role fetch error:", error);
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
