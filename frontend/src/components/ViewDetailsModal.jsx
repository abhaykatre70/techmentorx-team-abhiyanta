import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar, User, Package, AlertTriangle, CheckCircle, Gift, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import toast from 'react-hot-toast';

const ViewDetailsModal = ({ item, type, onClose }) => {
    const { currentUser } = useAuth();
    const [visitTime, setVisitTime] = useState('');
    const [visitDate, setVisitDate] = useState('');
    const [helpType, setHelpType] = useState('volunteer'); // 'volunteer', 'items', 'money'
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [allNgos, setAllNgos] = useState([]);
    const [selectedNgoId, setSelectedNgoId] = useState('');

    React.useEffect(() => {
        const fetchNgos = async () => {
            const { data } = await supabase.from('users').select('id, full_name, city').eq('role', 'NGO');
            if (data) setAllNgos(data);
        };
        fetchNgos();
    }, []);

    if (!item) return null;

    const handleConfirmHelp = async () => {
        if (!visitTime || !visitDate) {
            toast.error('Please select both time and date');
            return;
        }

        setIsSubmitting(true);
        try {
            const helpLabel = helpType === 'money' ? 'Donating Money' : helpType === 'items' ? 'Sharing Items' : 'Volunteering';
            const userName = currentUser?.user_metadata?.full_name || currentUser?.user_metadata?.name || 'A volunteer';

            // Determine recipient: use item.user_id if available, otherwise use selected NGO
            let recipientId = item.user_id || selectedNgoId;

            if (!recipientId && allNgos.length > 0) {
                // Fallback to first NGO if none selected
                recipientId = allNgos[0].id;
            }

            if (recipientId) {
                // Create a notification
                await supabase.from('notifications').insert([{
                    user_id: recipientId,
                    title: 'New Help Commitment! 🤝',
                    message: `${userName} committed to ${helpType === 'money' ? 'Donating Money' : helpType === 'items' ? 'Sharing Items' : 'Volunteering'} for "${item.title || item.type || 'this request'}" at ${visitTime} on ${visitDate}.`,
                    type: 'commitment',
                    read: false
                }]);
            }

            toast.success(`Commitment Shared! You've pledged to help with ${helpLabel.toLowerCase()}. 💖`);
            onClose();
        } catch (err) {
            console.error('Error sharing commitment:', err);
            toast.error('Failed to share commitment');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'report': return <AlertTriangle className="w-8 h-8 text-orange-500" />;
            case 'task': return <CheckCircle className="w-8 h-8 text-blue-500" />;
            case 'donation': return <Gift className="w-8 h-8 text-green-500" />;
            default: return null;
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-600',
            verified: 'bg-blue-100 text-blue-600',
            resolved: 'bg-green-100 text-green-600',
            'in-progress': 'bg-blue-100 text-blue-600',
            completed: 'bg-green-100 text-green-600',
            available: 'bg-green-100 text-green-600',
            pledged: 'bg-blue-100 text-blue-600',
            collected: 'bg-purple-100 text-purple-600',
            delivered: 'bg-gray-100 text-gray-600',
        };
        return colors[status] || 'bg-gray-100 text-gray-600';
    };

    const getUrgencyColor = (urgency) => {
        const colors = {
            low: 'bg-gray-100 text-gray-600',
            medium: 'bg-yellow-100 text-yellow-600',
            high: 'bg-orange-100 text-orange-600',
            critical: 'bg-red-100 text-red-600',
            urgent: 'bg-red-100 text-red-600',
        };
        return colors[urgency] || 'bg-gray-100 text-gray-600';
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
                >
                    {/* Header */}
                    <div className="p-6 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                                {getIcon()}
                                <div>
                                    <h2 className="text-2xl font-black capitalize">{type} Details</h2>
                                    <p className="text-white/90 text-sm mt-1">Complete information</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/20 rounded-lg transition"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">

                        {/* Image */}
                        {item.image_url && (
                            <div className="mb-6">
                                <img
                                    src={item.image_url}
                                    alt={item.title}
                                    className="w-full h-64 object-cover rounded-xl shadow-lg"
                                />
                            </div>
                        )}

                        {/* Title */}
                        <div className="mb-6">
                            <h3 className="text-3xl font-black text-gray-900 mb-2">
                                {item.title || item.name || 'Untitled'}
                            </h3>
                            {item.category && (
                                <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-bold">
                                    {item.category}
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        {item.description && (
                            <div className="mb-6">
                                <h4 className="text-sm font-bold text-gray-500 uppercase mb-2">Description</h4>
                                <p className="text-gray-700 leading-relaxed">{item.description}</p>
                            </div>
                        )}

                        {/* Details Grid */}
                        <div className="grid md:grid-cols-2 gap-4 mb-6">

                            {/* Status */}
                            {item.status && (
                                <div>
                                    <h4 className="text-sm font-bold text-gray-500 uppercase mb-2">Status</h4>
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(item.status)}`}>
                                        {item.status}
                                    </span>
                                </div>
                            )}

                            {/* Urgency/Priority */}
                            {(item.urgency || item.priority) && (
                                <div>
                                    <h4 className="text-sm font-bold text-gray-500 uppercase mb-2">
                                        {item.urgency ? 'Urgency' : 'Priority'}
                                    </h4>
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getUrgencyColor(item.urgency || item.priority)}`}>
                                        {item.urgency || item.priority}
                                    </span>
                                </div>
                            )}

                            {/* Quantity */}
                            {item.quantity && (
                                <div>
                                    <h4 className="text-sm font-bold text-gray-500 uppercase mb-2">Quantity</h4>
                                    <div className="flex items-center space-x-2">
                                        <Package className="w-5 h-5 text-blue-500" />
                                        <span className="text-lg font-bold text-gray-900">{item.quantity}</span>
                                    </div>
                                </div>
                            )}

                            {/* Points */}
                            {item.points && (
                                <div>
                                    <h4 className="text-sm font-bold text-gray-500 uppercase mb-2">Points</h4>
                                    <span className="text-lg font-bold text-green-600">+{item.points}</span>
                                </div>
                            )}

                            {/* Amount */}
                            {item.amount && (
                                <div>
                                    <h4 className="text-sm font-bold text-gray-500 uppercase mb-2">Amount</h4>
                                    <span className="text-lg font-bold text-green-600">₹{item.amount}</span>
                                </div>
                            )}

                            {/* Deadline */}
                            {item.deadline && (
                                <div>
                                    <h4 className="text-sm font-bold text-gray-500 uppercase mb-2">Deadline</h4>
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="w-5 h-5 text-orange-500" />
                                        <span className="text-gray-900 font-semibold">
                                            {new Date(item.deadline).toLocaleDateString('en-IN')}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Location */}
                        {(item.city || item.pickup_city || item.location_city) && (
                            <div className="mb-6">
                                <h4 className="text-sm font-bold text-gray-500 uppercase mb-2">Location</h4>
                                <div className="flex items-start space-x-2 bg-blue-50 p-4 rounded-lg">
                                    <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold text-gray-900">
                                            {item.city || item.pickup_city || item.location_city}, {item.state || item.pickup_state || item.location_state}
                                        </p>
                                        {item.address && (
                                            <p className="text-sm text-gray-600 mt-1">{item.address}</p>
                                        )}
                                        {(item.location_lat || item.latitude) && (item.location_long || item.longitude) && (
                                            <p className="text-xs text-gray-500 mt-1 px-2 py-1 bg-gray-100 rounded-md inline-block">
                                                📍 {(item.location_lat || item.latitude).toFixed(6)}, {(item.location_long || item.longitude).toFixed(6)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Proof URL */}
                        {item.proof_url && (
                            <div className="mb-6">
                                <h4 className="text-sm font-bold text-gray-500 uppercase mb-2">Proof</h4>
                                <img
                                    src={item.proof_url}
                                    alt="Proof"
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                            </div>
                        )}

                        {/* Timestamps */}
                        <div className="border-t pt-4 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Created</span>
                                <span className="font-semibold text-gray-900">
                                    {new Date(item.created_at).toLocaleString('en-IN')}
                                </span>
                            </div>
                            {item.updated_at && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Updated</span>
                                    <span className="font-semibold text-gray-900">
                                        {new Date(item.updated_at).toLocaleString('en-IN')}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Support Commitment Section */}
                    {type !== 'donation' && item.status !== 'resolved' && (
                        <div className="p-6 bg-orange-50 border-t border-orange-100">
                            <h4 className="text-sm font-black text-orange-800 uppercase mb-4 flex items-center gap-2">
                                <Gift className="w-4 h-4" />
                                How would you like to help?
                            </h4>

                            {/* Help Type Selection */}
                            <div className="grid grid-cols-3 gap-2 mb-6">
                                <button
                                    onClick={() => setHelpType('volunteer')}
                                    className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${helpType === 'volunteer' ? 'border-orange-500 bg-orange-100 text-orange-700 shadow-sm' : 'border-gray-200 bg-white text-gray-500 hover:border-orange-200'}`}
                                >
                                    <Clock className="w-5 h-5" />
                                    <span className="text-[10px] font-bold uppercase">Volunteer</span>
                                </button>

                                {type !== 'task' && (
                                    <>
                                        <button
                                            onClick={() => setHelpType('items')}
                                            className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${helpType === 'items' ? 'border-orange-500 bg-orange-100 text-orange-700 shadow-sm' : 'border-gray-200 bg-white text-gray-500 hover:border-orange-200'}`}
                                        >
                                            <Package className="w-5 h-5" />
                                            <span className="text-[10px] font-bold uppercase">Share Items</span>
                                        </button>
                                        <button
                                            onClick={() => setHelpType('money')}
                                            className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${helpType === 'money' ? 'border-orange-500 bg-orange-100 text-orange-700 shadow-sm' : 'border-gray-200 bg-white text-gray-500 hover:border-orange-200'}`}
                                        >
                                            <Gift className="w-5 h-5" />
                                            <span className="text-[10px] font-bold uppercase">Donate Money</span>
                                        </button>
                                    </>
                                )}
                            </div>

                            {!item.user_id && (
                                <div className="mb-4">
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Send update to which NGO?</label>
                                    <select
                                        value={selectedNgoId}
                                        onChange={(e) => setSelectedNgoId(e.target.value)}
                                        className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm"
                                    >
                                        <option value="">Select an NGO to notify</option>
                                        {allNgos.map(ngo => (
                                            <option key={ngo.id} value={ngo.id}>{ngo.full_name} ({ngo.city})</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Expected Visit Time</label>
                                    <input
                                        type="time"
                                        value={visitTime}
                                        onChange={(e) => setVisitTime(e.target.value)}
                                        className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Date</label>
                                    <input
                                        type="date"
                                        value={visitDate}
                                        onChange={(e) => setVisitDate(e.target.value)}
                                        className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleConfirmHelp}
                                disabled={isSubmitting}
                                className={`w-full py-3 text-white rounded-xl font-bold transition shadow-md ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'}`}
                            >
                                {isSubmitting ? 'Sharing commitment...' : `Pledge to ${helpType === 'money' ? 'Donate Money' : helpType === 'items' ? 'Share Items' : 'Volunteer'}`}
                            </button>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="p-6 bg-gray-50 border-t flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition"
                        >
                            Back to List
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ViewDetailsModal;
