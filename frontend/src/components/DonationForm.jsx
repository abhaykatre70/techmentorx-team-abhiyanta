import React, { useState } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';
import { X, Gift, IndianRupee, MapPin, Clock, Package } from 'lucide-react';
import toast from 'react-hot-toast';

const DonationForm = ({ onClose, onComplete }) => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [donationType, setDonationType] = useState('items'); // 'items' or 'money'
    const [allNgos, setAllNgos] = useState([]);
    const [filteredNgos, setFilteredNgos] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        category: 'Food',
        description: '',
        quantity: '',
        amount: '',
        pickup_address: '',
        pickup_city: '',
        pickup_state: 'Maharashtra', // Default state
        visiting_time: '',
        ngo_name: ''
    });

    const categories = ['Food', 'Clothes', 'Medical', 'Stationary', 'Shelter', 'Other'];

    // Fetch NGOs on load
    React.useEffect(() => {
        const fetchNgos = async () => {
            try {
                console.log("🔍 Fetching NGOs for dropdown...");
                const { data, error } = await supabase
                    .from('users')
                    .select('full_name, city, state')
                    .eq('role', 'NGO');

                if (error) {
                    console.error("🔴 Error fetching NGOs:", error);
                    return;
                }

                if (data) {
                    console.log(`🟢 Found ${data.length} NGOs`);
                    setAllNgos(data);
                    setFilteredNgos(data);
                } else {
                    console.warn("⚠️ No NGOs found in database");
                }
            } catch (err) {
                console.error("🔴 Exception fetching NGOs:", err);
            }
        };
        fetchNgos();
    }, []);

    // Filter NGOs when city changes
    React.useEffect(() => {
        if (formData.pickup_city && allNgos.length > 0) {
            const search = formData.pickup_city.toLowerCase().trim();
            const filtered = allNgos.filter(ngo =>
                (ngo.city || '').toLowerCase().includes(search) ||
                (ngo.state || '').toLowerCase().includes(search) ||
                (ngo.full_name || '').toLowerCase().includes(search)
            );
            // If match found, use it, else show all
            setFilteredNgos(filtered.length > 0 ? filtered : allNgos);
        } else {
            setFilteredNgos(allNgos);
        }
    }, [formData.pickup_city, allNgos]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const isValidUUID = (uuid) => {
                const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                return regex.test(uuid);
            };

            const donationData = {
                ...formData,
                title: donationType === 'money' ? `Financial Aid: ${formData.title}` : formData.title,
                amount: donationType === 'money' ? parseFloat(formData.amount) : null,
                quantity: donationType === 'items' ? formData.quantity : null,
                status: 'available',
                user_id: (currentUser?.id && isValidUUID(currentUser.id)) ? currentUser.id : null
            };

            console.log("📝 Inserting donation into database...", donationData);
            const { data: newDonation, error } = await supabase.from('donations').insert([donationData]).select();

            if (error) {
                console.error("🔴 Donation DB Insert Error:", error);
                throw error;
            }
            console.log("🟢 Donation inserted successfully:", newDonation);

            // --- NOTIFICATION SYSTEM ---
            // Notify the selected NGO
            if (formData.ngo_name) {
                try {
                    const { data: ngoUser } = await supabase
                        .from('users')
                        .select('id')
                        .eq('full_name', formData.ngo_name)
                        .eq('role', 'NGO')
                        .single();

                    if (ngoUser) {
                        await supabase.from('notifications').insert([{
                            user_id: ngoUser.id,
                            title: '🎁 New Donation Offer!',
                            message: `${currentUser?.user_metadata?.name || 'A donor'} has offered ${formData.title} to your NGO.`,
                            type: 'donation',
                            action_url: '/dashboard'
                        }]);
                    }
                } catch (notifErr) {
                    console.warn("Notification error:", notifErr);
                }
            }

            toast.success('Thank you for your generous offer! 💖');
            if (onComplete) onComplete();
            if (onClose) onClose();
        } catch (error) {
            console.error('Donation error:', error);
            toast.error('Failed to post donation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="p-6 bg-gradient-to-r from-orange-500 to-red-500 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Gift className="w-8 h-8" />
                        <div>
                            <h2 className="text-2xl font-black">Offer Support</h2>
                            <p className="text-white/80 text-xs">Choose how you want to help</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                    {/* Toggle */}
                    <div className="flex p-1 bg-gray-100 rounded-2xl">
                        <button
                            type="button"
                            onClick={() => setDonationType('items')}
                            className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition ${donationType === 'items' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500'}`}
                        >
                            <Package className="w-5 h-5" /> Items
                        </button>
                        <button
                            type="button"
                            onClick={() => setDonationType('money')}
                            className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition ${donationType === 'money' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500'}`}
                        >
                            <IndianRupee className="w-5 h-5" /> Money
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-black text-gray-700 mb-2">Title / Subject</label>
                            <input
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder={donationType === 'items' ? "e.g. Warm Blankets for Winter" : "e.g. Relief Fund Contribution"}
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition"
                            />
                        </div>

                        {donationType === 'items' ? (
                            <>
                                <div>
                                    <label className="block text-sm font-black text-gray-700 mb-2">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition"
                                    >
                                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-black text-gray-700 mb-2">Quantity</label>
                                    <input
                                        required
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                        placeholder="e.g. 50 units"
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition"
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="md:col-span-2">
                                <label className="block text-sm font-black text-gray-700 mb-2">Amount (₹)</label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        required
                                        type="number"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        placeholder="Enter amount"
                                        className="w-full p-4 pl-12 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="md:col-span-2">
                            <label className="block text-sm font-black text-gray-700 mb-2">
                                Which NGO to support?
                                {formData.pickup_city && <span className="text-orange-500 ml-2">(Showing NGOs in {formData.pickup_city})</span>}
                            </label>
                            <select
                                value={formData.ngo_name}
                                onChange={(e) => setFormData({ ...formData, ngo_name: e.target.value })}
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition"
                            >
                                <option value="">Select NGO (Optional)</option>
                                {filteredNgos.map((ngo, idx) => (
                                    <option key={idx} value={ngo.full_name}>
                                        {ngo.full_name} ({ngo.city || 'National'})
                                    </option>
                                ))}
                            </select>
                            {allNgos.length === 0 && (
                                <p className="text-[10px] text-red-500 mt-1 italic font-bold">
                                    No NGOs found. Please ensure you have run the SQL demo data script in Supabase!
                                </p>
                            )}
                            {allNgos.length > 0 && filteredNgos.length === 0 && (
                                <p className="text-[10px] text-orange-500 mt-1 italic">
                                    No NGOs matching your city. Showing all partners.
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-black text-gray-700 mb-2">Available Time for Pickup</label>
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    value={formData.visiting_time}
                                    onChange={(e) => setFormData({ ...formData, visiting_time: e.target.value })}
                                    placeholder="e.g. 10 AM - 5 PM"
                                    className="w-full p-4 pl-12 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-black text-gray-700 mb-2">City</label>
                            <input
                                required
                                value={formData.pickup_city}
                                onChange={(e) => setFormData({ ...formData, pickup_city: e.target.value })}
                                placeholder="e.g. Mumbai"
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-black text-gray-700 mb-2">Detailed Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                placeholder="Anything else we should know?"
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition"
                            ></textarea>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            disabled={loading}
                            className={`w-full py-4 rounded-2xl font-black text-lg shadow-lg flex items-center justify-center gap-3 transition transform active:scale-95 ${donationType === 'money' ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-200' : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-200'}`}
                        >
                            {loading ? 'Submitting...' : `Submit ${donationType === 'money' ? 'Donation' : 'Offer'}`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DonationForm;
