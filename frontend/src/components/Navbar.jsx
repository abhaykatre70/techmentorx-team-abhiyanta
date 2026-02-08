// Clean Global Navbar - No logo, just navigation
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import { Bell, LogOut, Menu, X, Home, LayoutDashboard, MapPin, Gift, Users, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Logo from './Logo';

const Navbar = () => {
    const { currentUser, userRole, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (currentUser) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [currentUser]);

    const fetchNotifications = async () => {
        if (!currentUser) return;
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false })
            .limit(10);
        if (!error && data) {
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.read).length);
        }
    };

    const markAsRead = async (notificationId) => {
        await supabase.from('notifications').update({ read: true }).eq('id', notificationId);
        fetchNotifications();
    };

    const handleLogout = async () => {
        await logout();
    };

    const navLinks = [
        { path: '/', label: 'Home', icon: Home, roles: ['all'] },
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['all'] },
        { path: '/map', label: 'Live Map', icon: MapPin, roles: ['NGO', 'Volunteer'] },
        { path: '/donations', label: 'Donations', icon: Gift, roles: ['all'] },
        { path: '/ngos', label: 'Partner NGOs', icon: Users, roles: ['all'] },
        { path: '/users', label: 'Users', icon: Users, roles: ['NGO'] },
        { path: '/analytics', label: 'Analytics', icon: BarChart3, roles: ['NGO'] },
    ];

    const filteredLinks = navLinks.filter(link =>
        link.roles.includes('all') || link.roles.includes(userRole)
    );

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <Link to="/">
                        <Logo size="small" showText={true} />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-1">
                        {filteredLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all ${isActive(link.path)
                                        ? 'bg-orange-500 text-white'
                                        : 'text-gray-700 hover:bg-orange-50'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="text-sm">{link.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center space-x-3">

                        {/* Fun Animation */}
                        <div className="w-12 h-12 hidden md:block">
                            <dotlottie-wc
                                src="/fist-bump.json"
                                autoplay
                                loop
                                style={{ width: '100%', height: '100%' }}
                            />
                        </div>

                        {/* Notifications */}
                        {currentUser && (
                            <div className="relative">
                                <button
                                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                                    className="relative p-2 rounded-lg hover:bg-gray-100 transition"
                                >
                                    <Bell className="w-5 h-5 text-gray-600" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                <AnimatePresence>
                                    {notificationsOpen && (
                                        <>
                                            <div
                                                onClick={() => setNotificationsOpen(false)}
                                                className="fixed inset-0 z-40"
                                            />
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border z-50"
                                            >
                                                <div className="p-4 bg-orange-500 text-white rounded-t-xl">
                                                    <h3 className="font-bold">Notifications</h3>
                                                    <p className="text-sm opacity-90">{unreadCount} unread</p>
                                                </div>
                                                <div className="max-h-96 overflow-y-auto">
                                                    {notifications.length === 0 ? (
                                                        <div className="p-8 text-center text-gray-400">
                                                            <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                                            <p>No notifications</p>
                                                        </div>
                                                    ) : (
                                                        notifications.map((notif) => (
                                                            <div
                                                                key={notif.id}
                                                                onClick={() => markAsRead(notif.id)}
                                                                className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${!notif.read ? 'bg-orange-50' : ''}`}
                                                            >
                                                                <p className="text-sm font-bold text-gray-800">{notif.title}</p>
                                                                <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                                                                <p className="text-xs text-gray-400 mt-1">
                                                                    {new Date(notif.created_at).toLocaleString('en-IN')}
                                                                </p>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* User */}
                        {currentUser ? (
                            <>
                                <div className="hidden md:block text-right">
                                    <p className="text-sm font-bold text-gray-800">{currentUser.user_metadata?.name || 'User'}</p>
                                    <p className="text-xs text-orange-600 font-semibold">{userRole}</p>
                                </div>
                                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold">
                                    {currentUser.email?.[0]?.toUpperCase()}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="hidden md:flex items-center space-x-1 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-semibold text-sm"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600">
                                Login
                            </Link>
                        )}

                        {/* Mobile Menu */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="lg:hidden bg-gray-50 border-t overflow-hidden"
                    >
                        <div className="px-4 py-4 space-y-2">
                            {filteredLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-semibold ${isActive(link.path)
                                            ? 'bg-orange-500 text-white'
                                            : 'text-gray-700 hover:bg-white'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{link.label}</span>
                                    </Link>
                                );
                            })}
                            {currentUser && (
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 font-semibold"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Logout</span>
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
