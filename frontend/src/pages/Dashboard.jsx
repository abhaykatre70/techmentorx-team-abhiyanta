
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import MapComponent from '../components/MapComponent';
import GeoCamera from '../components/GeoCamera';
import { LayoutDashboard, ListChecks, Map as MapIcon, Plus, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { currentUser, userRole, logout } = useAuth();
    const [stats, setStats] = useState({ activeTasks: 0, pendingReports: 0, points: 0 });
    const [view, setView] = useState('overview'); // overview, map, report
    const [tasks, setTasks] = useState([]);
    const [loadingTasks, setLoadingTasks] = useState(true);

    // Dummy data fetch simulation
    useEffect(() => {
        // In a real app, fetch from 'tasks' and 'reports' tables
        setStats({
            activeTasks: 5,
            pendingReports: 2,
            points: 150
        });
    }, []);

    return (
        <div className="min-h-screen bg-off-white pt-24 px-4 pb-12">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Welcome back, <span className="text-green-600">{currentUser?.user_metadata?.name || currentUser?.email}</span>
                        </h1>
                        <p className="text-gray-600 mt-1 capitalize">Role: <span className="font-semibold bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-sm">{userRole || 'Volunteer'}</span></p>
                    </div>

                    <button
                        onClick={() => setView('report')}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 transition hover:-translate-y-1"
                    >
                        <AlertCircle className="w-5 h-5" /> Report Needy
                    </button>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                                <ListChecks className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Active Tasks</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.activeTasks}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Pending Reports</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.pendingReports}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 rounded-xl text-green-600">
                                <MapIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Impact Points</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.points}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Column: Actions / Map */}
                    <div className="md:col-span-2 space-y-8">
                        {view === 'overview' && (
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-800">Nearby Activity Map</h2>
                                    <span className="text-sm text-gray-500">Live Updates</span>
                                </div>
                                {/* Map Component */}
                                <div className="h-96 rounded-xl overflow-hidden bg-gray-100 relative">
                                    <MapComponent />
                                    {/* Overlay Hint */}
                                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg text-xs font-semibold shadow-sm">
                                        📍 Showing 5 nearby NGOs and 3 active tasks
                                    </div>
                                </div>
                            </div>
                        )}

                        {view === 'report' && (
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-800">Submit Geo-Tagged Report</h2>
                                    <button onClick={() => setView('overview')} className="text-gray-400 hover:text-gray-600">Cancel</button>
                                </div>
                                <div className="max-w-md mx-auto">
                                    <GeoCamera onCaptureConfig={() => setView('overview')} />
                                    <p className="text-center text-sm text-gray-500 mt-4">
                                        Photos are automatically tagged with your precise GPS coordinates for verification.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Recent Activity / Tasks */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-4">Urgent Tasks Nearby</h3>

                            {loadingTasks ? (
                                <p className="text-gray-400 text-sm">Loading tasks...</p>
                            ) : (
                                <div className="space-y-4">
                                    {tasks.map((task, i) => (
                                        <div key={task.id || i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100 cursor-pointer">
                                            <div className={`w-2 h-2 mt-2 rounded-full ${task.urgent ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                            <div>
                                                <h4 className="font-semibold text-gray-800 text-sm">{task.title}</h4>
                                                <p className="text-xs text-gray-500">{task.description || task.location || "3.2km away"}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button className="w-full mt-4 text-green-600 text-sm font-bold hover:underline">View All Tasks</button>
                        </div>

                        <div className="bg-gradient-to-br from-green-600 to-emerald-800 p-6 rounded-2xl shadow-lg text-white">
                            <h3 className="font-bold text-lg mb-2">Volunteer Leaderboard</h3>
                            <p className="text-green-100 text-sm mb-4">You are in the top 15% this week!</p>
                            <div className="flex items-center justify-between bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                <span>Your Rank</span>
                                <span className="font-bold text-xl">#42</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
