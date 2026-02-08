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
    const [showDonationForm, setShowDonationForm] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();
    const filterState = location.state?.filterState;

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserLocation({ lat: pos.coords.latitude, long: pos.coords.longitude }),
                (err) => console.warn("GPS Access Denied")
            );
        }
    }, []);

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
                filteredReports = filteredReports.filter(r =>
                    r.status === 'verified' || r.status === 'active' || r.status === 'pending'
                );
                filteredNeeds = filteredNeeds.filter(n => n.status === 'active' || n.status === 'open');
            }

            const combined = [
                ...filteredReports.map(r => ({ ...r, type: r.type || 'Emergency Request', isReport: true })),
                ...filteredNeeds.map(n => ({ ...n, title: n.title, isNeed: true }))
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
                const lat = item.latitude || item.location_lat || 0;
                const lng = item.longitude || item.location_long || 0;

                if (userLocation && lat !== 0 && lng !== 0) {
                    dist = calculateDistance(userLocation.lat, userLocation.long, lat, lng);
                }
                return { ...item, distance: dist };
            });

            if (userLocation) {
                processed.sort((a, b) => (parseFloat(a.distance) || 9999) - (parseFloat(b.distance) || 9999));
            }

            setItems(processed);

            // Stats Update
            setStats({
                activeTasks: processed.filter(i => i.isNeed).length,
                pendingReports: processed.filter(i => i.isReport).length,
                points: currentUser?.points || 0
            });

        } catch (error) {
            console.error("Dashboard Fetch Error:", error);
            toast.error("Error loading updates");
        } finally {
            setLoading(false);
        }
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

    const clearFilter = () => {
        navigate(location.pathname, { state: {}, replace: true });
    };

    const handleReportSubmit = async (data) => {
        try {
            if (!data.image) {
                toast.error("No image captured");
                return;
            }

            // Standard Blob conversion (Avoids fetch AbortError)
            const byteString = atob(data.image.split(',')[1]);
            const mimeString = data.image.split(',')[0].split(':')[1].split(';')[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            const imageBlob = new Blob([ab], { type: mimeString });

            const fileName = `report-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
            let finalImageUrl = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

            try {
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('reports')
                    .upload(fileName, imageBlob, { contentType: 'image/jpeg', upsert: true });

                if (uploadError) throw uploadError;
                const { data: { publicUrl } } = supabase.storage.from('reports').getPublicUrl(fileName);
                finalImageUrl = publicUrl;
            } catch (err) {
                console.warn("Storage Error, using fallback image", err);
            }

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
                user_id: currentUser?.id
            };

            let { data: newReport, error: dbError } = await toast.promise(
                supabase.from('reports').insert([reportData]).select(),
                {
                    loading: 'Recording report...',
                    success: 'Report Saved! 🟢',
                    error: 'DB error, retrying...'
                }
            );

            if (dbError) {
                const { data: retryData, error: retryError } = await supabase
                    .from('reports')
                    .insert([{ ...reportData, user_id: null }])
                    .select();
                if (retryError) throw retryError;
                newReport = retryData;
            }

            setShowCamera(false);
            fetchDashboardData();
            toast.success('NGOs have been alerted! 🚨');
        } catch (error) {
            console.error('Submission error:', error);
            toast.error('Failed to submit report');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <header className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                            {currentUser?.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                            <h1 className="font-bold text-gray-800 text-sm md:text-base">Hi, {currentUser?.user_metadata?.name || 'User'}</h1>
                            <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 uppercase">
                                {userRole || 'Donor'}
                            </span>
                        </div>
                    </div>
                    <button onClick={logout} className="text-gray-400 hover:text-red-500 transition"><X /></button>
                </div>
            </header>

            <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full space-y-8">
                <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                    <button onClick={() => setShowCamera(true)} className="w-full md:w-auto bg-white text-orange-600 border-2 border-orange-500 px-8 py-4 rounded-2xl shadow-sm hover:bg-orange-50 transition transform hover:-translate-y-1 flex items-center justify-center gap-3 font-bold text-lg">
                        <Camera /> Report Needy Nearby
                    </button>
                    {(userRole === 'Donor' || userRole === 'Admin') && (
                        <button onClick={() => setShowDonationForm(true)} className="w-full md:w-auto bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 flex items-center justify-center gap-3 font-bold text-lg">
                            <Gift /> Offer Help
                        </button>
                    )}
                </div>

                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search for clothes, food, or nearby needs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-orange-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-orange-100 outline-none text-lg"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400 w-6 h-6" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <StatCard icon={<Activity className="text-blue-500" />} label="Reports" value={stats.pendingReports} color="bg-blue-50" />
                    <StatCard icon={<Users className="text-green-500" />} label="Points" value={stats.points} color="bg-green-50" />
                    <div className="col-span-2 md:col-span-1">
                        <StatCard icon={<MapPin className="text-purple-500" />} label="Scope" value={items.length} color="bg-purple-50" />
                    </div>
                </div>

                <div id="needs-section">
                    <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-orange-500" />
                        Live Community Feed
                    </h2>

                    {loading ? (
                        <div className="text-center py-12"><div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div><p>Searching...</p></div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">No items found nearby.</div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {items.filter(i => (i.title || i.type || '').toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                                <Card key={item.id} item={item} onClick={() => setSelectedItem(item)} />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {showCamera && <CameraWithGPS onCapture={handleReportSubmit} onClose={() => setShowCamera(false)} />}
            {showDonationForm && <DonationForm onClose={() => setShowDonationForm(false)} onComplete={() => { setShowDonationForm(false); fetchDashboardData(); }} />}
            {selectedItem && <ViewDetailsModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
        </div>
    );
};

const StatCard = ({ icon, label, value, color }) => (
    <div className={`${color} p-4 rounded-2xl border border-white/50 shadow-sm flex flex-col items-center justify-center text-center`}>
        <div className="mb-2 bg-white p-2 rounded-full shadow-sm">{icon}</div>
        <span className="text-2xl font-black text-gray-800">{value}</span>
        <span className="text-[10px] text-gray-600 font-bold uppercase">{label}</span>
    </div>
);

const Card = ({ item, onClick }) => (
    <div onClick={onClick} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden cursor-pointer flex flex-col h-full">
        <div className="p-4 bg-orange-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-bold text-gray-700">{item.city || 'Location Unknown'}</span>
            </div>
            <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold uppercase">{item.urgency || 'Active'}</span>
        </div>
        <div className="p-4 flex gap-3">
            <img src={item.image_url} alt="" className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
            <div className="flex-1">
                <h3 className="font-bold text-sm text-gray-900 line-clamp-1">{item.title || item.type}</h3>
                <p className="text-xs text-gray-500 line-clamp-2 mt-1">{item.description}</p>
            </div>
        </div>
        <div className="p-3 bg-gray-50 border-t border-gray-100 mt-auto flex justify-between items-center">
            <span className="text-[10px] text-gray-400 font-bold uppercase flex items-center">
                <Clock className="w-3 h-3 mr-1" /> {item.distance ? `${item.distance} km` : 'Near You'}
            </span>
            <span className="text-xs font-bold text-orange-600">HELP →</span>
        </div>
    </div>
);

export default Dashboard;
