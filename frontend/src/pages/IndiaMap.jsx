// India Map Component with State-wise Data
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { motion } from 'framer-motion';
import { MapPin, Users, Gift, AlertTriangle, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import InteractiveMap from '../components/InteractiveMap';

const IndiaMap = () => {
    const [selectedState, setSelectedState] = useState(null);
    const [stateData, setStateData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStateData();
    }, []);

    const fetchStateData = async () => {
        setLoading(true);
        try {
            // Fetch all data in parallel for efficiency
            const [
                { data: reports },
                { data: users },
                { data: donations },
                { data: needs }
            ] = await Promise.all([
                supabase.from('reports').select('state'),
                supabase.from('users').select('state'),
                supabase.from('donations').select('pickup_state'),
                supabase.from('needs').select('state, urgency')
            ]);

            const stats = {};

            // Helper to init state stats
            const initState = (name) => {
                if (!stats[name]) {
                    stats[name] = { reports: 0, users: 0, donations: 0, needs: 0, urgentNeeds: 0, urgency: 'low' };
                }
            };

            // Aggregate Reports
            reports?.forEach(r => {
                if (!r.state) return;
                initState(r.state);
                stats[r.state].reports++;
            });

            // Aggregate Users
            users?.forEach(u => {
                if (!u.state) return;
                initState(u.state);
                stats[u.state].users++;
            });

            // Aggregate Donations
            donations?.forEach(d => {
                if (!d.pickup_state) return;
                initState(d.pickup_state);
                stats[d.pickup_state].donations++;
            });

            // Aggregate Needs
            needs?.forEach(n => {
                if (!n.state) return;
                initState(n.state);
                stats[n.state].needs++;
                if (n.urgency === 'critical' || n.urgency === 'high') {
                    stats[n.state].urgentNeeds++;
                    stats[n.state].urgency = n.urgency; // Set urgency flag for map color
                }
            });

            setStateData(stats);
        } catch (error) {
            console.error('Error fetching state data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getSafeData = (stateName) => {
        if (!stateName) return null;
        return stateData[stateName] ||
            stateData[stateName.replace(/&/g, 'and')] ||
            stateData[stateName.replace(/Union Territory of /g, '')] ||
            null;
    };

    return (
        <div className="min-h-screen bg-transparent p-6 md:p-12 font-sans">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center"
                >
                    <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                        India Relief Map
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Real-time visualization of help needed across the nation (Click map to explore)
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8 items-start">

                    {/* Left: Interactive Map */}
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-2">
                        <div className="w-full h-[600px] md:h-[700px]">
                            <InteractiveMap
                                stateData={stateData}
                                onStateClick={setSelectedState}
                                selectedState={selectedState}
                            />
                        </div>
                    </div>

                    {/* Right: Details Panel */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-3xl shadow-xl p-6 md:p-8 sticky top-24 border border-gray-100"
                        >
                            {selectedState ? (
                                <>
                                    <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
                                        <div>
                                            <h3 className="text-3xl font-black text-gray-800">{selectedState}</h3>
                                            <p className="text-sm text-gray-500 font-medium">State Situation Report</p>
                                        </div>
                                        <button
                                            onClick={() => setSelectedState(null)}
                                            className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition"
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    {getSafeData(selectedState) ? (
                                        <div className="space-y-4">
                                            {(() => {
                                                const data = getSafeData(selectedState);
                                                return (
                                                    <>
                                                        <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-4">
                                                            <div className="bg-white p-3 rounded-xl shadow-sm">
                                                                <AlertTriangle className="w-6 h-6 text-red-500" />
                                                            </div>
                                                            <div>
                                                                <p className="text-3xl font-black text-gray-800">{data.needs}</p>
                                                                <p className="text-xs font-bold text-red-500 uppercase tracking-wider">Active Needs</p>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                                                                <div className="bg-white w-10 h-10 flex items-center justify-center rounded-xl shadow-sm mb-2">
                                                                    <TrendingUp className="w-5 h-5 text-orange-500" />
                                                                </div>
                                                                <p className="text-2xl font-black text-gray-800">{data.urgentNeeds}</p>
                                                                <p className="text-xs font-bold text-orange-500 uppercase">Urgent</p>
                                                            </div>
                                                            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                                                <div className="bg-white w-10 h-10 flex items-center justify-center rounded-xl shadow-sm mb-2">
                                                                    <MapPin className="w-5 h-5 text-blue-500" />
                                                                </div>
                                                                <p className="text-2xl font-black text-gray-800">{data.reports}</p>
                                                                <p className="text-xs font-bold text-blue-500 uppercase">Reports</p>
                                                            </div>
                                                            <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                                                                <div className="bg-white w-10 h-10 flex items-center justify-center rounded-xl shadow-sm mb-2">
                                                                    <Gift className="w-5 h-5 text-green-500" />
                                                                </div>
                                                                <p className="text-2xl font-black text-gray-800">{data.donations}</p>
                                                                <p className="text-xs font-bold text-green-500 uppercase">Donations</p>
                                                            </div>
                                                            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                                                                <div className="bg-white w-10 h-10 flex items-center justify-center rounded-xl shadow-sm mb-2">
                                                                    <Users className="w-5 h-5 text-purple-500" />
                                                                </div>
                                                                <p className="text-2xl font-black text-gray-800">{data.users}</p>
                                                                <p className="text-xs font-bold text-purple-500 uppercase">Users</p>
                                                            </div>
                                                        </div>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 bg-gray-50 rounded-xl">
                                            <p className="text-gray-400">No data available for this region yet.</p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-20 flex flex-col items-center justify-center h-full">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                        <MapPin className="w-10 h-10 text-gray-300 animate-bounce" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Explore the Map</h3>
                                    <p className="text-gray-400 font-medium max-w-xs mx-auto">
                                        Click on any active state on the map to filter details.
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IndiaMap;
