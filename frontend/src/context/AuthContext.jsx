import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    const isDemoMode = React.useRef(false);

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
                        isDemoMode.current = false;
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
                    isDemoMode.current = false;
                    await fetchUserRole(session.user);
                } else {
                    // Start of workaround: Check if we are in "Demo Mode" before clearing
                    if (!isDemoMode.current) {
                        setCurrentUser(null);
                        setUserRole(null);
                    }
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
            // 1. Try fetching by ID (Standard)
            let { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();

            // 2. If ID mismatch (due to DB reset but Auth persistence), try fetching by Email
            if (!data && user.email) {
                const { data: emailData } = await supabase
                    .from('users')
                    .select('*')
                    .eq('email', user.email)
                    .single();

                if (emailData) {
                    data = emailData;
                    error = null;
                    console.log("Matched user by Email (ID mismatch corrected)");
                }
            }

            if (data) {
                setUserRole(data.role);
                setCurrentUser({ ...user, ...data }); // Merge Auth user with DB profile
            } else {
                // Fallback to metadata if profile missing completely
                const metaRole = user.user_metadata?.role || 'Donor';
                setUserRole(metaRole);
                setCurrentUser({ ...user, role: metaRole });
            }
        } catch (error) {
            console.error("Unexpected error fetching user role:", error);
        } finally {
            setLoading(false);
        }
    };

    const signup = async (email, password, name, role) => {
        try {
            // 1. Try Supabase Auth Signup
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { name, role } }
            });

            if (error) {
                // AUTO-HEAL: If user exists, try logging in instantly!
                if (error.message.includes("already registered")) {
                    toast("User exists! Attempting Login...", { icon: '🔄' });
                    return await login(email, password);
                }
                throw error;
            }

            // 2. Create Profile in DB (if new)
            if (data.user) {
                const { error: profileError } = await supabase
                    .from('users')
                    .upsert([{
                        id: data.user.id,
                        email, name, role,
                        created_at: new Date()
                    }]);

                if (profileError) console.warn("Profile creation warn:", profileError);

                setUserRole(role);
                toast.success("Account created successfully!");
            }
            return data;

        } catch (error) {
            console.error("Signup Error:", error);
            toast.error(error.message);
            throw error;
        }
    };

    const login = async (email, password) => {
        try {
            // 1. Try Standard Supabase Auth
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });

            // If Auth Succeeded, verify we can find the profile
            if (!error && data.user) {
                await fetchUserRole(data.user);
                toast.success("Logged in via Auth!");
                return data;
            }

            console.warn("Auth failed, trying DB Fallback...");

            // 2. DB Fallback (for Demo/Reset Users)
            const { data: demoUser, error: dbError } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .eq('password', password) // Check plain text password
                .single();

            if (demoUser) {
                const fakeUser = {
                    id: demoUser.id,
                    email: demoUser.email,
                    user_metadata: { name: demoUser.name, role: demoUser.role }
                };

                // Set Session
                isDemoMode.current = true;
                setCurrentUser(fakeUser);
                setUserRole(demoUser.role);

                toast.success(`Welcome back, ${demoUser.name} (Demo DB)`);
                return { user: fakeUser };
            }

            // 3. Hardcoded Fallback (Last Resort - IGNORE PASSWORD CHECK FOR DEMO)
            const fallbackUsers = {
                'admin@ngo.org': { name: 'Aditi Rao', role: 'NGO' },
                'rahul@volunteer.com': { name: 'Rahul Sharma', role: 'Volunteer' },
                'priya@donor.com': { name: 'Priya Verma', role: 'Donor' },
                'vikram@volunteer.com': { name: 'Vikram Singh', role: 'Volunteer' },
                'sneha@donor.com': { name: 'Sneha Gupta', role: 'Donor' }
            };

            // Allow login if email matches demo list, REGARDLESS of password
            if (fallbackUsers[email]) {
                const u = fallbackUsers[email];
                const fake = {
                    id: 'hardcoded-' + email,
                    email,
                    user_metadata: { name: u.name, role: u.role }
                };
                isDemoMode.current = true;
                setCurrentUser(fake);
                setUserRole(u.role);
                toast.success(`Welcome (Bypassed Auth)`);
                return { user: fake };
            }

            throw error || new Error("Invalid credentials");

        } catch (error) {
            console.error("Login Fatal:", error);
            throw error;
        }
    };

    const loginWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
        if (error) toast.error("Google login failed");
    };

    const logout = async () => {
        isDemoMode.current = false;
        await supabase.auth.signOut();
        setCurrentUser(null);
        setUserRole(null);
        toast.success("Signed out");
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
