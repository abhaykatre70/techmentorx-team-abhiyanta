import React, { useState } from 'react';
import { LogOut, MapPin, Package, Camera, X } from 'lucide-react';
import MapComponent from '../components/MapComponent';
import toast, { Toaster } from 'react-hot-toast';

const Dashboard = () => {
    // Mock user role - in real app, get from Context
    const userRole = 'Donor';
    const [needs, setNeeds] = useState([
        { id: 1, title: 'Winter Clothes Request', ngo: 'Helping Hands', dist: '2km', type: 'clothes' },
        { id: 2, title: 'Dry Ration Needed', ngo: 'Food For All', dist: '5km', type: 'food' },
        { id: 3, title: 'Textbooks for Kids', ngo: 'EduCare', dist: '3.5km', type: 'education' },
    ]);

    const [isReporting, setIsReporting] = useState(false);
    const [reportImage, setReportImage] = useState(null);
    const [reportLocation, setReportLocation] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setReportImage(reader.result);
                setIsReporting(true);
                // Simulate getting location
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        setReportLocation({
                            lat: pos.coords.latitude,
                            lng: pos.coords.longitude
                        });
                        toast.success("Location captured!");
                    },
                    (err) => toast.error("Could not get location")
                );
            };
            reader.readAsDataURL(file);
        }
    };

    const submitReport = () => {
        // Here we would send data to backend
        const newReport = {
            id: Date.now(),
            title: 'Needy Person Reported',
            ngo: 'Pending Verification',
            dist: 'Nearby (You)',
            type: 'urgent'
        };

        setNeeds([newReport, ...needs]);
        setIsReporting(false);
        setReportImage(null);
        toast.custom((t) => (
            <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
                <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 pt-0.5">
                            <img className="h-10 w-10 rounded-full" src={reportImage} alt="" />
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900">Report Sent!</p>
                            <p className="mt-1 text-sm text-gray-500">Nearby NGOs have been notified of this location.</p>
                        </div>
                    </div>
                </div>
            </div>
        ));
    };

    return (
        <div className="min-h-screen bg-gray-50 font-poppins text-gray-800">
            <Toaster position="top-center" />
            {/* Navbar Removed - Handled Globally */}

            {/* Main Content */}
            <main className="p-4 md:p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Sidebar / Stats */}
                <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Total Impact</h3>
                            <p className="text-3xl font-extrabold text-green-600">12</p>
                            <p className="text-xs text-green-600 mt-1">+2 this week</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">My Points</h3>
                            <p className="text-3xl font-extrabold text-yellow-500">450</p>
                            <p className="text-xs text-yellow-600 mt-1">Silver Badge</p>
                        </div>
                    </div>

                    {/* Nearby Needs List */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[500px] flex flex-col">
                        <h3 className="font-bold text-lg mb-4 text-gray-800">Nearby Needs</h3>
                        <div className="space-y-4 overflow-y-auto pr-2 flex-grow custom-scrollbar">
                            {needs.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-green-50/50 cursor-pointer transition duration-200 group">
                                    <div className={`p-3 rounded-xl flex-shrink-0 ${item.type === 'food' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                        <Package className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-gray-900 truncate">{item.title}</h4>
                                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                            <MapPin className="w-3 h-3" /> {item.ngo} • <span className="text-green-600 font-medium">{item.dist}</span>
                                        </p>
                                    </div>
                                    <button className="opacity-0 group-hover:opacity-100 px-3 py-1 text-xs bg-green-600 text-white rounded-lg transition-all transform scale-90 group-hover:scale-100">
                                        Help
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Action Area */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <button className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl flex flex-col items-center justify-center gap-3 hover:shadow-lg hover:-translate-y-1 transition duration-300">
                            <div className="bg-white/20 p-3 rounded-full">
                                <Package className="w-8 h-8" />
                            </div>
                            <span className="font-semibold">Donate Item</span>
                        </button>

                        <label className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-2xl flex flex-col items-center justify-center gap-3 hover:shadow-lg hover:-translate-y-1 transition duration-300 cursor-pointer relative overflow-hidden group">
                            <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            <div className="bg-white/20 p-3 rounded-full relative z-10">
                                <Camera className="w-8 h-8" />
                            </div>
                            <span className="font-semibold relative z-10">Report Needy</span>
                            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
                        </label>

                        <button className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl flex flex-col items-center justify-center gap-3 hover:shadow-lg hover:-translate-y-1 transition duration-300 md:col-span-1 col-span-2">
                            <div className="bg-white/20 p-3 rounded-full">
                                <MapPin className="w-8 h-8" />
                            </div>
                            <span className="font-semibold">Volunteer Map</span>
                        </button>
                    </div>

                    {/* Map View */}
                    <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-green-600" /> Live Impact Map
                            </h3>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full animate-pulse">
                                ● Live Updates
                            </span>
                        </div>
                        <div className="h-[400px] w-full relative">
                            <MapComponent />
                        </div>
                    </div>
                </div>
            </main>

            {/* Report Modal */}
            {isReporting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative">
                        <button
                            onClick={() => setIsReporting(false)}
                            className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-6">
                            <h3 className="text-2xl font-bold mb-2">Report Needy Person</h3>
                            <p className="text-gray-500 text-sm mb-6">Your report helps NGOs reach the right place.</p>

                            <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden mb-6 border-2 border-dashed border-gray-300">
                                {reportImage && <img src={reportImage} alt="Report" className="w-full h-full object-cover" />}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm text-gray-600 bg-green-50 p-3 rounded-lg border border-green-100">
                                    <MapPin className="w-5 h-5 text-green-600" />
                                    {reportLocation ? (
                                        <span>Lat: {reportLocation.lat.toFixed(4)}, Lng: {reportLocation.lng.toFixed(4)}</span>
                                    ) : (
                                        <span className="animate-pulse">Fetching Location...</span>
                                    )}
                                </div>

                                <button
                                    onClick={submitReport}
                                    disabled={!reportLocation}
                                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl transition shadow-lg hover:shadow-xl active:scale-95"
                                >
                                    Submit Report
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Dashboard;
