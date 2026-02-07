
import React, { useState } from 'react';
import { Search, MapPin, Building, Globe, Phone, Mail, Award, CheckCircle } from 'lucide-react';

// Mock NGO Data
const NGOs = [
    { id: 1, name: "Helping Hands Foundation", location: "Delhi, India", verified: true, focus: "Food & Shelter", contact: "+91 9876543210", email: "contact@helpinghands.org", desc: "Providing meals to over 1000 homeless people daily." },
    { id: 2, name: "EduCare Initiative", location: "Mumbai, India", verified: true, focus: "Education", contact: "+91 9988776655", email: "info@educare.org", desc: "Sponsoring education for underprivileged children." },
    { id: 3, name: "Earth Saviors", location: "Bangalore, India", verified: true, focus: "Environment", contact: "+91 7766554433", email: "save@earth.org", desc: "Planting trees and managing waste in urban areas." },
    { id: 4, name: "Local Community Support", location: "Pune, India", verified: false, focus: "Community", contact: "+91 8899001122", email: "support@local.org", desc: "Grassroots level community support for various needs." },
];

const NGOsPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("All");

    const filteredNGOs = NGOs.filter(ngo => {
        const matchesSearch = ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) || ngo.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === "All" || (filter === "Verified" && ngo.verified);
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
                        placeholder="Search NGOs by name or city..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    {["All", "Verified"].map(opt => (
                        <button
                            key={opt}
                            onClick={() => setFilter(opt)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === opt ? 'bg-green-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            {/* NGO Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNGOs.map(ngo => (
                    <div key={ngo.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                                <Building className="w-6 h-6" />
                            </div>
                            {ngo.verified && (
                                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" /> Verified
                                </span>
                            )}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{ngo.name}</h3>
                        <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                            <MapPin className="w-4 h-4" /> {ngo.location}
                        </p>
                        <p className="text-gray-600 text-sm mb-6 line-clamp-2">{ngo.desc}</p>

                        <div className="space-y-2 text-sm text-gray-500 border-t border-gray-100 pt-4">
                            <div className="flex items-center gap-2">
                                <Award className="w-4 h-4 text-green-500" /> Focus: <span className="text-gray-700 font-medium">{ngo.focus}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-400" /> {ngo.contact}
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-400" /> {ngo.email}
                            </div>
                        </div>

                        <button className="w-full mt-6 bg-gray-50 text-gray-900 font-semibold py-2 rounded-lg hover:bg-green-600 hover:text-white transition">
                            View Profile
                        </button>
                    </div>
                ))}
            </div>

            {filteredNGOs.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-500">No NGOs found matching your search.</p>
                </div>
            )}
        </div>
    );
};

export default NGOsPage;
