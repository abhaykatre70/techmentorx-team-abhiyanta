
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Building, Globe, Phone, Mail, Award, CheckCircle } from 'lucide-react';
import { supabase } from '../supabase';

const NGOsPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("All");
    const [ngos, setNgos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNGOs();
    }, []);

    const fetchNGOs = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('role', 'NGO');

            if (error) throw error;
            setNgos(data || []);
        } catch (error) {
            console.error("Error fetching NGOs:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredNGOs = ngos.filter(ngo => {
        const matchesSearch =
            (ngo.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (ngo.city || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (ngo.state || '').toLowerCase().includes(searchTerm.toLowerCase());

        const isVerified = true; // For demo, assuming all NGOs in DB are verified or add a field later
        const matchesFilter = filter === "All" || (filter === "Verified" && isVerified);
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto min-h-screen">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Partner NGOs</h1>
                <p className="text-gray-500 max-w-2xl mx-auto">Connect with our verified partners who ensure your donations reach the right hands.</p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search NGOs by name, city, or state..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    {["All", "Verified"].map(opt => (
                        <button
                            key={opt}
                            onClick={() => setFilter(opt)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === opt ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            {/* NGO Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full"></div>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNGOs.map(ngo => (
                        <div key={ngo.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition group h-full flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                                    <Building className="w-6 h-6" />
                                </div>
                                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" /> Verified
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{ngo.full_name}</h3>
                            <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                                <MapPin className="w-4 h-4" /> {ngo.city}, {ngo.state}
                            </p>
                            <p className="text-gray-600 text-sm mb-6 line-clamp-2">Dedicated support and relief operations in {ngo.city}.</p>

                            <div className="mt-auto space-y-2 text-sm text-gray-500 border-t border-gray-100 pt-4">
                                <div className="flex items-center gap-2">
                                    <Award className="w-4 h-4 text-orange-500" /> Focus: <span className="text-gray-700 font-medium">Relief & Support</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-400" /> {ngo.phone || 'N/A'}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-400" /> {ngo.email}
                                </div>
                            </div>

                            <button className="w-full mt-6 bg-gray-50 text-gray-900 font-semibold py-2 rounded-lg hover:bg-orange-500 hover:text-white transition">
                                Contact NGO
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {!loading && filteredNGOs.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-500">No NGOs found matching your search.</p>
                </div>
            )}
        </div>
    );
};

export default NGOsPage;
