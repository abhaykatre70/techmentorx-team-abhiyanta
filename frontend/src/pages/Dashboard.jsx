import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import { MapPin, Camera, Package, Users, Activity, CheckCircle, Clock, X, Gift, Search } from 'lucide-react';
import CameraWithGPS from '../components/CameraWithGPS';
import DonationForm from '../components/DonationForm'; // New Import
import toast from 'react-hot-toast';
import ViewDetailsModal from '../components/ViewDetailsModal';
import { useLocation, useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { currentUser, userRole, logout, updatePoints } = useAuth();
    const [stats, setStats] = useState({ activeTasks: 0, pendingReports: 0, points: 0 });
    const [view, setView] = useState('overview');
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [userLocation, setUserLocation] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const [showDonationForm, setShowDonationForm] = useState(false); // New State
    const [selectedItem, setSelectedItem] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();
    const filterState = location.state?.filterState;

    // Get Location once
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserLocation({ lat: pos.coords.latitude, long: pos.coords.longitude }),
                (err) => console.warn("GPS Access Denied")
            );
        }
    }, []);

    // Fetch Role-Specific Data
    useEffect(() => {
        fetchDashboardData();
    }, [userRole, userLocation, currentUser, filterState]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            console.log("🔵 Fetching Dashboard Data for role:", userRole);
            let data = [];

            // 1. Fetch Reports
            const { data: reports, error: reportsErr } = await supabase
                .from('reports')
                .select('*')
                .order('created_at', { ascending: false });

            // 2. Fetch Needs
            const { data: needs, error: needsErr } = await supabase
                .from('needs')
                .select('*')
                .order('created_at', { ascending: false });

            if (reportsErr) console.warn("Reports fetch error:", reportsErr);
            if (needsErr) console.warn("Needs fetch error:", needsErr);

            // Role-based filtering
            let filteredReports = reports || [];
            let filteredNeeds = needs || [];

            if (userRole === 'Donor' || userRole === 'Volunteer') {
                filteredReports = filteredReports.filter(r => r.status === 'verified');
                filteredNeeds = filteredNeeds.filter(n => n.status === 'active');
            }

            // Combine
            const combined = [
                ...filteredReports.map(r => ({ ...r, type: r.type || 'Emergency Request', isReport: true })),
                ...filteredNeeds.map(n => ({ ...n, type: n.title, isNeed: true }))
            ];

            data = combined;

            if (filterState) {
                const normalizedFilter = filterState.toLowerCase().trim();
                data = data.filter(item =>
                    (item.state || '').toLowerCase().trim() === normalizedFilter ||
                    (item.address || '').toLowerCase().includes(normalizedFilter)
                );
            }

            const processed = data.map(item => {
                let dist = null;
                const lat = item.latitude || item.location_lat;
                const lng = item.longitude || item.location_long;

                if (userLocation && lat && lng) {
                    dist = calculateDistance(userLocation.lat, userLocation.long, lat, lng);
                }
                return { ...item, distance: dist };
            });

            if (userLocation) {
                processed.sort((a, b) => (parseFloat(a.distance) || 9999) - (parseFloat(b.distance) || 9999));
            }

            setItems(processed);

            // Update Stats
            if (currentUser?.id) {
                try {
                    const { data: userData } = await supabase.from('users').select('points').eq('id', currentUser.id).maybeSingle();
                    setStats({
                        activeTasks: processed.length,
                        pendingReports: data.length,
                        points: userData?.points || currentUser.user_metadata?.points || 0
                    });
                } catch (err) {
                    console.warn("Stats fetch failed", err);
                }
            }

        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Dashboard partially loaded");
        } finally {
            setLoading(false);
        }
    };

    const clearFilter = () => {
        navigate(location.pathname, { state: {}, replace: true });
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (R * c).toFixed(1);
    };

    const handleReportSubmit = async (data) => {
        try {
            if (!data.image) {
                toast.error("No image captured");
                return;
            }

            // Convert Data URI to Blob using fetch
            const imageBlob = await fetch(data.image).then(res => res.blob());

            // Upload image to storage
            const fileName = `report-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
            let finalImageUrl = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

            try {
                console.log("📸 Starting image upload to Supabase Storage...");
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('reports')
                    .upload(fileName, imageBlob, {
                        contentType: 'image/jpeg',
                        cacheControl: '3600',
                        upsert: true
                    });

                if (uploadError) {
                    console.error("🔴 Storage upload error:", uploadError);
                    // Fallback to default image if upload fails but don't stop the report
                } else {
                    console.log("🟢 Image uploaded successfully:", uploadData.path);
                    const { data: { publicUrl } } = supabase.storage.from('reports').getPublicUrl(fileName);
                    finalImageUrl = publicUrl;
                }
            } catch (err) {
                console.error("🔴 Storage exception:", err);
            }

            // Create report
            const isValidUUID = (uuid) => {
                const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                return regex.test(uuid);
            };

            const reportData = {
                type: 'Urgent Help Needed',
                description: `Need reported at ${data.location.address}`,
                category: 'Emergency',
                urgency: 'high',
                status: 'verified',
                image_url: finalImageUrl,
                latitude: data.location.latitude,
                longitude: data.location.longitude,
                city: data.location.city,
                state: data.location.state,
                address: data.location.address,
                user_id: (currentUser?.id && isValidUUID(currentUser.id)) ? currentUser.id : null
            };

            console.log("📝 Inserting report into database...", reportData);

            const { data: newReport, error: dbError } = await toast.promise(
                supabase.from('reports').insert([reportData]).select(),
                {
                    loading: 'Saving report to database...',
                    success: 'Report saved successfully! 🟢',
                    error: 'Failed to save to database 🔴'
                }
            );

            if (dbError) {
                console.error('🔴 Database Insert Error details:', {
                    message: dbError.message,
                    code: dbError.code,
                    details: dbError.details,
                    hint: dbError.hint
                });
                throw dbError;
            }
            console.log("🟢 Report inserted successfully:", newReport);

            // --- NOTIFICATION SYSTEM ---
            // Notify all NGOs in the same city
            try {
                const { data: ngos } = await supabase
                    .from('users')
                    .select('id')
                    .eq('role', 'NGO')
                    .eq('city', data.location.city);

                if (ngos && ngos.length > 0) {
                    const notifications = ngos.map(ngo => ({
                        user_id: ngo.id,
                        title: '🚨 New Emergency Report!',
                        message: `A new need has been reported in ${data.location.city}: ${data.location.address}`,
                        type: 'alert',
                        action_url: '/dashboard'
                    }));
                    await supabase.from('notifications').insert(notifications);
                }
            } catch (notifErr) {
                console.warn("Notification error:", notifErr);
            }

            toast.success('Report geotagged and shared with NGO! 📍');
            setShowCamera(false);
            fetchDashboardData();

            setTimeout(() => {
                const section = document.getElementById('needs-section');
                if (section) section.scrollIntoView({ behavior: 'smooth' });
            }, 500);

        } catch (error) {
            console.error('Submission error:', error);
            toast.error(error.message || 'Failed to submit report');
        }
    };

    return (
        <div className="min-h-screen bg-transparent flex flex-col font-sans">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                            {currentUser?.email?.[0]?.toUpperCase()}
                        </div>
                        <div>
                            <h1 className="font-bold text-gray-800 text-sm md:text-base">Hi, {currentUser?.user_metadata?.name || 'User'}</h1>
                            <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 uppercase tracking-wide">
                                {userRole || 'Guest'}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full space-y-8">

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={() => setShowCamera(true)}
                        className="w-full md:w-auto bg-white text-orange-600 border-2 border-orange-500 px-8 py-4 rounded-2xl shadow-sm hover:bg-orange-50 transition transform hover:-translate-y-1 flex items-center justify-center gap-3 font-bold text-lg"
                    >
                        <Camera className="w-6 h-6" />
                        Report Needy Nearby
                    </button>

                    {(userRole === 'Donor' || userRole === 'Admin') && (
                        <>
                            <button
                                onClick={() => setShowDonationForm(true)}
                                className="w-full md:w-auto bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 flex items-center justify-center gap-3 font-bold text-lg"
                            >
                                <Gift className="w-6 h-6" />
                                Offer Help / Donation
                            </button>
                            <button
                                onClick={() => navigate('/ngos')}
                                className="w-full md:w-auto bg-white text-blue-600 border-2 border-blue-500 px-8 py-4 rounded-2xl shadow-sm hover:bg-blue-50 transition transform hover:-translate-y-1 flex items-center justify-center gap-3 font-bold text-lg"
                            >
                                <Users className="w-6 h-6" />
                                View Partner NGOs
                            </button>
                        </>
                    )}
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search for clothes, food, or nearby needs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-orange-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all outline-none text-lg"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400 w-6 h-6" />
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <StatCard
                        icon={<Activity className="text-blue-500" />}
                        label={userRole === 'Volunteer' ? 'Active Tasks' : 'Active Reports'}
                        value={stats.activeTasks}
                        color="bg-blue-50"
                    />
                    <StatCard
                        icon={<Users className="text-green-500" />}
                        label="Impact Score"
                        value={stats.points}
                        color="bg-green-50"
                    />
                    <div className="col-span-2 md:col-span-1">
                        <StatCard
                            icon={<MapPin className="text-purple-500" />}
                            label="Nearby Needs"
                            value={items.length}
                            color="bg-purple-50"
                        />
                    </div>
                </div>

                {/* Content Area */}
                <div id="needs-section">
                    <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-orange-500" />
                        {userRole === 'Donor' ? 'Needs Near You' :
                            userRole === 'Volunteer' ? 'Tasks Near You' : 'Recent Reports'}
                    </h2>

                    {filterState && (
                        <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm">
                            <span className="font-semibold flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                Showing updates for <span className="underline decoration-2 underline-offset-2">{filterState}</span>
                            </span>
                            <button
                                onClick={clearFilter}
                                className="text-sm bg-white hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg border border-blue-200 transition font-bold flex items-center gap-1"
                            >
                                Clear Filter <X className="w-3 h-3" />
                            </button>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full mb-4"></div>
                            <p className="text-gray-500 font-medium">Locating nearby needs...</p>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Package className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">No items found nearby</h3>
                            <p className="text-gray-500">You're all caught up! Check back later.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {items
                                .filter(item => {
                                    const text = (item.title || item.type || item.description || '').toLowerCase();
                                    return text.includes(searchTerm.toLowerCase());
                                })
                                .map((item) => (
                                    <Card
                                        key={item.id}
                                        item={item}
                                        role={userRole}
                                        onClick={() => setSelectedItem(item)}
                                    />
                                ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Camera Modal */}
            {showCamera && (
                <CameraWithGPS
                    onCapture={handleReportSubmit}
                    onClose={() => setShowCamera(false)}
                />
            )}

            {/* Donation Form Modal */}
            {showDonationForm && (
                <DonationForm
                    onClose={() => setShowDonationForm(false)}
                    onComplete={() => {
                        setShowDonationForm(false);
                        fetchDashboardData();
                    }}
                />
            )}

            {/* Details Modal */}
            {selectedItem && (
                <ViewDetailsModal
                    item={selectedItem}
                    type={userRole === 'Volunteer' ? 'task' : 'report'}
                    onClose={() => setSelectedItem(null)}
                />
            )}
        </div>
    );
};

// Modern Stat Card
const StatCard = ({ icon, label, value, color }) => (
    <div className={`${color} p-4 rounded-2xl border border-white/50 shadow-sm flex flex-col items-center justify-center text-center hover:scale-105 transition duration-300`}>
        <div className="mb-2 bg-white p-2.5 rounded-full shadow-sm">{icon}</div>
        <span className="text-3xl font-black text-gray-800 mb-1">{value}</span>
        <span className="text-xs text-gray-600 font-bold uppercase tracking-wider">{label}</span>
    </div>
);

// Modern Item Card (Location Focused)
const Card = ({ item, role, onClick }) => (
    <div
        onClick={onClick}
        className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group border border-gray-100 flex flex-col"
    >
        {/* Top Section: Location Header */}
        <div className="p-4 bg-orange-50 border-b border-orange-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                    <MapPin className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 leading-tight">{item.city || 'Unknown Location'}</h4>
                    <p className="text-xs text-gray-500 font-medium">{item.state || 'India'}</p>
                </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${(item.urgency === 'critical' || item.priority === 'urgent') ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'}`}>
                {item.urgency || item.priority || 'Active'}
            </span>
        </div>

        {/* Middle Section: Small Image & Description */}
        <div className="p-5 flex-1 relative">
            <div className="flex gap-4">
                {/* Minimized Image */}
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 italic text-[10px] flex items-center justify-center bg-gray-50">
                    <img
                        src={item.image_url || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"}
                        alt="Need"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"; }}
                    />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-orange-600 transition">
                        {item.type || item.title || "Help Required"}
                    </h3>
                    <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">
                        {item.description || "Urgent assistance needed at this location. Click to view full details and support."}
                    </p>
                </div>
            </div>

            {/* Address Overlay */}
            <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-[11px] text-gray-600 font-medium line-clamp-1 italic">
                    📍 {item.address || "Area details verified by NGO"}
                </p>
            </div>
        </div>

        {/* Bottom Section: Action */}
        <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                <Clock className="w-3 h-3 mr-1" />
                {item.distance ? `${item.distance} km away` : 'Nearby'}
            </div>
            <div className="flex items-center gap-2">
                <span className="text-xs font-black text-orange-600 group-hover:translate-x-1 transition">
                    VIEW & DONATE →
                </span>
            </div>
        </div>
    </div>
);

export default Dashboard;
