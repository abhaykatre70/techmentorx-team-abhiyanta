import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import { MapPin, Camera, AlertTriangle, Package, Users, Activity } from 'lucide-react';
import GeoCamera from '../components/GeoCamera';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { currentUser, userRole, logout } = useAuth();
    const [stats, setStats] = useState({ activeTasks: 0, pendingReports: 0, points: 0 });
    const [view, setView] = useState('overview');
    const [items, setItems] = useState([]); // Can be tasks or reports
    const [loading, setLoading] = useState(true);
    const [userLocation, setUserLocation] = useState(null);

    // Get Location once
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserLocation({ lat: pos.coords.latitude, long: pos.coords.longitude }),
                (err) => console.warn("GPS Access Denied") // Don't block app, just show unsorted
            );
        }
    }, []);

    // Fetch Role-Specific Data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let data = [];
                let tableName = '';

                if (userRole === 'Donor') {
                    // Donors see needy reports to help
                    tableName = 'reports';
                    const { data: reports } = await supabase.from('reports').select('*').eq('status', 'open');
                    data = reports || [];
                } else if (userRole === 'Volunteer') {
                    // Volunteers see tasks to do
                    tableName = 'tasks';
                    const { data: tasks } = await supabase.from('tasks').select('*').eq('status', 'pending');
                    data = tasks || [];
                } else {
                    // NGO sees everything (showing reports for now in list)
                    tableName = 'reports';
                    const { data: allReports } = await supabase.from('reports').select('*');
                    data = allReports || [];
                }

                // Calculate Distance if location available
                const processed = data.map(item => {
                    let dist = null;
                    if (userLocation && item.latitude && item.longitude) {
                        dist = calculateDistance(userLocation.lat, userLocation.long, item.latitude, item.longitude);
                    }
                    return { ...item, distance: dist };
                });

                // Sort by distance
                if (userLocation) {
                    processed.sort((a, b) => (a.distance || 9999) - (b.distance || 9999));
                }

                setItems(processed);

                // Dummy Stats for Demo
                setStats({
                    activeTasks: processed.length,
                    pendingReports: 5,
                    points: currentUser?.user_metadata?.points || 0
                });

            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userRole, userLocation]);

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lat2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (R * c).toFixed(1);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-poppins">
            {/* Header */}
            <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                            {currentUser?.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                            <h1 className="font-bold text-gray-800 text-sm md:text-base">Hello, {currentUser?.user_metadata?.name || 'User'}</h1>
                            <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                {userRole || 'Guest'}
                            </span>
                        </div>
                    </div>
                    <button onClick={logout} className="text-sm font-medium text-gray-500 hover:text-red-500 transition">
                        Sign Out
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 max-w-7xl mx-auto w-full space-y-6">

                {/* 1. Quick Stats Row */}
                <div className="grid grid-cols-3 gap-3 md:gap-6">
                    <StatCard icon={<Activity className="text-blue-500" />} label="Active" value={stats.activeTasks} />
                    <StatCard icon={<AlertTriangle className="text-amber-500" />} label="Pending" value={stats.pendingReports} />
                    <StatCard icon={<Users className="text-green-500" />} label="Points" value={stats.points} />
                </div>

                {/* 2. Action Buttons */}
                <div className="flex gap-4">
                    {userRole !== 'Volunteer' && (
                        <button
                            onClick={() => setView('report')}
                            className={`flex-1 py-3 rounded-xl font-semibold shadow-sm transition flex items-center justify-center gap-2
                            ${view === 'report' ? 'bg-red-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                            <Camera className="w-5 h-5" /> Report Needy
                        </button>
                    )}
                    <button
                        onClick={() => setView('overview')}
                        className={`flex-1 py-3 rounded-xl font-semibold shadow-sm transition flex items-center justify-center gap-2
                        ${view === 'overview' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                    >
                        <MapPin className="w-5 h-5" />
                        {userRole === 'Donor' ? 'Donate Nearby' : 'View Tasks'}
                    </button>
                </div>

                {/* 3. Dynamic Content Area */}
                {view === 'report' ? (
                    <div className="animate-fade-in-up">
                        <GeoCamera onCaptureConfig={() => setView('overview')} />
                    </div>
                ) : (
                    <div className="space-y-4">
                        <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                            {userRole === 'Donor' ? 'People Needing Help Nearby' :
                                userRole === 'Volunteer' ? 'Tasks Assigned to You' : 'Recent Activity'}
                        </h2>

                        {loading ? (
                            <div className="text-center py-10 text-gray-400">Loading nearby data...</div>
                        ) : items.length === 0 ? (
                            <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
                                <p className="text-gray-500">No active items found nearby.</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-4">
                                {items.map((item) => (
                                    <Card key={item.id} item={item} role={userRole} />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

// Sub-components for cleaner code
const StatCard = ({ icon, label, value }) => (
    <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
        <div className="mb-2 bg-gray-50 p-2 rounded-full">{icon}</div>
        <span className="text-2xl font-bold text-gray-800">{value}</span>
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</span>
    </div>
);

const Card = ({ item, role }) => (
    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex gap-4 hover:shadow-lg transition">
        {item.image_url ? (
            <img src={item.image_url} alt="Report" className="w-24 h-24 rounded-lg object-cover bg-gray-200" />
        ) : (
            <div className="w-24 h-24 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                <Package className="w-8 h-8" />
            </div>
        )}
        <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-800 truncate">{item.title || "Needy Report"}</h3>
                {item.distance && (
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full whitespace-nowrap">
                        {item.distance} km away
                    </span>
                )}
            </div>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>

            <div className="mt-3 flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-full uppercase font-bold 
                    ${item.urgency === 'high' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                    {item.urgency || item.status}
                </span>

                <button className="text-sm font-semibold text-green-600 hover:text-green-700">
                    {role === 'Donor' ? 'Donate Now' : 'Accept Task'} &rarr;
                </button>
            </div>
        </div>
    </div>
);

export default Dashboard;
