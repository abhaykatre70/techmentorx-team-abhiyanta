// Donations Page - View all donations
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { motion } from 'framer-motion';
import { Gift, MapPin, User, Users, Calendar, Package, Clock, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import DonationForm from '../components/DonationForm';
import ViewDetailsModal from '../components/ViewDetailsModal';
import { useAuth } from '../context/AuthContext';

const DonationsPage = () => {
    const { userRole } = useAuth();
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [selectedDonation, setSelectedDonation] = useState(null);

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('donations')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setDonations(data || []);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to load donations');
        } finally {
            setLoading(false);
        }
    };

    const filteredDonations = donations.filter(d => {
        const matchesStatus = filter === 'all' || d.status === filter;
        const search = (searchTerm || "").toLowerCase();
        const matchesSearch = (d.title || "").toLowerCase().includes(search) ||
            (d.category || "").toLowerCase().includes(search);
        return matchesStatus && matchesSearch;
    });

    const statusColors = {
        available: 'bg-green-100 text-green-600',
        pledged: 'bg-blue-100 text-blue-600',
        collected: 'bg-purple-100 text-purple-600',
        delivered: 'bg-gray-100 text-gray-600',
    };

    return (
        <div className="min-h-screen bg-transparent p-6">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 mb-2">Donations</h1>
                        <p className="text-gray-600">View and track all donations</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search clothes, food..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none w-64 shadow-sm"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        </div>
                        {(userRole === 'Donor' || userRole === 'Admin') && (
                            <button
                                onClick={() => setShowForm(true)}
                                className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition shadow-orange-100 transform active:scale-95 whitespace-nowrap"
                            >
                                + Post New Offer
                            </button>
                        )}
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-6 flex overflow-x-auto pb-2 gap-2">
                    {['all', 'available', 'pledged', 'collected', 'delivered'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-6 py-2 rounded-xl font-semibold capitalize whitespace-nowrap transition ${filter === status ? 'bg-orange-500 text-white shadow-lg shadow-orange-100' : 'bg-white text-gray-700 hover:bg-orange-50'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* Donations Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
                    </div>
                ) : filteredDonations.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl">
                        <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">No donations found</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDonations.map((donation) => (
                            <motion.div
                                key={donation.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={() => setSelectedDonation(donation)}
                                className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all cursor-pointer group"
                            >
                                {/* Image */}
                                {donation.image_url && (
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={donation.image_url}
                                            alt={donation.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-500" />
                                    </div>
                                )}

                                <div className="p-6">
                                    {/* Title & Category */}
                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition">{donation.title}</h3>
                                        <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold">
                                            {donation.category}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    {donation.description && (
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{donation.description}</p>
                                    )}

                                    {/* Details */}
                                    <div className="space-y-2 mb-4">
                                        {donation.quantity && (
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Package className="w-4 h-4 mr-2" />
                                                <span>Quantity: {donation.quantity}</span>
                                            </div>
                                        )}
                                        {/* NGO & Time Info */}
                                        {donation.ngo_name && (
                                            <div className="flex items-center text-sm font-bold text-orange-600 mb-2">
                                                <Users className="w-4 h-4 mr-2 text-blue-500" />
                                                <span>{donation.ngo_name}</span>
                                            </div>
                                        )}
                                        {donation.visiting_time && (
                                            <div className="flex items-center text-sm text-gray-600 mb-2 bg-gray-50 p-2 rounded-lg">
                                                <Clock className="w-4 h-4 mr-2 text-blue-500" />
                                                <span>Visit: {donation.visiting_time}</span>
                                            </div>
                                        )}
                                        {donation.pickup_city && (
                                            <div className="flex items-center text-sm text-gray-600">
                                                <MapPin className="w-4 h-4 mr-2" />
                                                <span>{donation.pickup_city}, {donation.pickup_state}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center text-sm text-gray-500 mt-2">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            <span>Listed: {new Date(donation.created_at).toLocaleDateString('en-IN')}</span>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${statusColors[donation.status]}`}>
                                            {donation.status}
                                        </span>
                                        {donation.amount && (
                                            <span className="text-lg font-bold text-green-600">
                                                ₹{donation.amount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            {showForm && (
                <DonationForm
                    onClose={() => setShowForm(false)}
                    onComplete={() => {
                        setShowForm(false);
                        fetchDonations();
                    }}
                />
            )}

            {selectedDonation && (
                <ViewDetailsModal
                    item={selectedDonation}
                    type="donation"
                    onClose={() => setSelectedDonation(null)}
                />
            )}
        </div>
    );
};

export default DonationsPage;
