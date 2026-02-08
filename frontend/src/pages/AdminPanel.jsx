// Complete Admin Panel with Full CRUD - Including Password Field
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Edit, Trash2, X, Save, Search, CheckCircle, AlertTriangle, Gift } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({});

    const tabs = [
        { id: 'users', label: 'Users', icon: Users, table: 'users' },
        { id: 'tasks', label: 'Tasks', icon: CheckCircle, table: 'tasks' },
        { id: 'reports', label: 'Reports', icon: AlertTriangle, table: 'reports' },
        { id: 'donations', label: 'Donations', icon: Gift, table: 'donations' },
    ];

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const currentTab = tabs.find(t => t.id === activeTab);
            const { data: result, error } = await supabase
                .from(currentTab.table)
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setData(result || []);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setModalMode('add');
        setSelectedItem(null);
        setFormData({});
        setShowModal(true);
    };

    const handleEdit = (item) => {
        setModalMode('edit');
        setSelectedItem(item);
        setFormData(item);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this item?')) return;
        try {
            const currentTab = tabs.find(t => t.id === activeTab);
            const { error } = await supabase.from(currentTab.table).delete().eq('id', id);
            if (error) throw error;
            toast.success('Deleted!');
            fetchData();
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const currentTab = tabs.find(t => t.id === activeTab);
            const { data: { user } } = await supabase.auth.getUser(); // Get current admin user

            if (modalMode === 'add') {
                const dataToInsert = { ...formData };
                // Add user_id if not 'users' table and user is logged in
                if (currentTab.table !== 'users' && user) {
                    dataToInsert.user_id = user.id;
                }

                const { error } = await supabase.from(currentTab.table).insert([dataToInsert]);
                if (error) throw error;
                toast.success('Added successfully!');
            } else {
                const { error } = await supabase.from(currentTab.table).update(formData).eq('id', selectedItem.id);
                if (error) throw error;
                toast.success('Updated successfully!');
            }

            setShowModal(false);
            fetchData();
        } catch (error) {
            console.error('Error:', error);
            toast.error('Save failed: ' + error.message);
        }
    };

    const filteredData = data.filter(item =>
        Object.values(item).some(value => String(value).toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-transparent p-6">
            <div className="max-w-7xl mx-auto">

                <h1 className="text-3xl font-black text-gray-900 mb-6">Admin Panel</h1>

                {/* Tabs */}
                <div className="mb-6 flex gap-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold ${activeTab === tab.id ? 'bg-orange-500 text-white' : 'bg-white text-gray-700'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Actions */}
                <div className="mb-4 flex gap-4 items-center bg-white p-4 rounded-lg">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
                        />
                    </div>
                    <button
                        onClick={handleAdd}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add New</span>
                    </button>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
                        </div>
                    ) : filteredData.length === 0 ? (
                        <div className="p-12 text-center text-gray-400">
                            <p>No data found</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    {activeTab === 'users' && (
                                        <>
                                            <th className="px-4 py-3 text-left font-bold">Name</th>
                                            <th className="px-4 py-3 text-left font-bold">Email</th>
                                            <th className="px-4 py-3 text-left font-bold">Role</th>
                                            <th className="px-4 py-3 text-left font-bold">Points</th>
                                            <th className="px-4 py-3 text-left font-bold">Actions</th>
                                        </>
                                    )}
                                    {activeTab === 'tasks' && (
                                        <>
                                            <th className="px-4 py-3 text-left font-bold">Title</th>
                                            <th className="px-4 py-3 text-left font-bold">Status</th>
                                            <th className="px-4 py-3 text-left font-bold">Priority</th>
                                            <th className="px-4 py-3 text-left font-bold">Points</th>
                                            <th className="px-4 py-3 text-left font-bold">Actions</th>
                                        </>
                                    )}
                                    {activeTab === 'reports' && (
                                        <>
                                            <th className="px-4 py-3 text-left font-bold">Type</th>
                                            <th className="px-4 py-3 text-left font-bold">Category</th>
                                            <th className="px-4 py-3 text-left font-bold">Status</th>
                                            <th className="px-4 py-3 text-left font-bold">Urgency</th>
                                            <th className="px-4 py-3 text-left font-bold">Actions</th>
                                        </>
                                    )}
                                    {activeTab === 'donations' && (
                                        <>
                                            <th className="px-4 py-3 text-left font-bold">Title</th>
                                            <th className="px-4 py-3 text-left font-bold">Category</th>
                                            <th className="px-4 py-3 text-left font-bold">Quantity</th>
                                            <th className="px-4 py-3 text-left font-bold">Status</th>
                                            <th className="px-4 py-3 text-left font-bold">Actions</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item) => (
                                    <tr key={item.id} className="border-t hover:bg-gray-50">
                                        {activeTab === 'users' && (
                                            <>
                                                <td className="px-4 py-3 font-semibold">{item.full_name || 'N/A'}</td>
                                                <td className="px-4 py-3">{item.email}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${item.role === 'NGO' ? 'bg-purple-100 text-purple-600' :
                                                        item.role === 'Volunteer' ? 'bg-blue-100 text-blue-600' :
                                                            'bg-green-100 text-green-600'
                                                        }`}>{item.role}</span>
                                                </td>
                                                <td className="px-4 py-3 font-bold text-orange-600">{item.points}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex space-x-2">
                                                        <button onClick={() => handleEdit(item)} className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleDelete(item.id)} className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                        {activeTab === 'tasks' && (
                                            <>
                                                <td className="px-4 py-3 font-semibold">{item.title}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'completed' ? 'bg-green-100 text-green-600' :
                                                        item.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                                                            'bg-yellow-100 text-yellow-600'
                                                        }`}>{item.status}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${item.priority === 'urgent' ? 'bg-red-100 text-red-600' :
                                                        item.priority === 'high' ? 'bg-orange-100 text-orange-600' :
                                                            'bg-gray-100 text-gray-600'
                                                        }`}>{item.priority}</span>
                                                </td>
                                                <td className="px-4 py-3 font-bold text-green-600">{item.points}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex space-x-2">
                                                        <button onClick={() => handleEdit(item)} className="p-1 bg-blue-100 text-blue-600 rounded">
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleDelete(item.id)} className="p-1 bg-red-100 text-red-600 rounded">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                        {activeTab === 'reports' && (
                                            <>
                                                <td className="px-4 py-3 font-semibold">{item.type || 'Untitled'}</td>
                                                <td className="px-4 py-3">{item.category}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'resolved' ? 'bg-green-100 text-green-600' :
                                                        item.status === 'verified' ? 'bg-blue-100 text-blue-600' :
                                                            'bg-yellow-100 text-yellow-600'
                                                        }`}>{item.status}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${item.urgency === 'critical' ? 'bg-red-100 text-red-600' :
                                                        item.urgency === 'high' ? 'bg-orange-100 text-orange-600' :
                                                            'bg-gray-100 text-gray-600'
                                                        }`}>{item.urgency}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex space-x-2">
                                                        <button onClick={() => handleEdit(item)} className="p-1 bg-blue-100 text-blue-600 rounded">
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleDelete(item.id)} className="p-1 bg-red-100 text-red-600 rounded">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                        {activeTab === 'donations' && (
                                            <>
                                                <td className="px-4 py-3 font-semibold">{item.title}</td>
                                                <td className="px-4 py-3">{item.category}</td>
                                                <td className="px-4 py-3 font-bold text-blue-600">{item.quantity}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'delivered' ? 'bg-green-100 text-green-600' :
                                                        item.status === 'collected' ? 'bg-blue-100 text-blue-600' :
                                                            'bg-yellow-100 text-yellow-600'
                                                        }`}>{item.status}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex space-x-2">
                                                        <button onClick={() => handleEdit(item)} className="p-1 bg-blue-100 text-blue-600 rounded">
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleDelete(item.id)} className="p-1 bg-red-100 text-red-600 rounded">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Modal */}
                <AnimatePresence>
                    {showModal && (
                        <>
                            <div onClick={() => setShowModal(false)} className="fixed inset-0 bg-black/50 z-40" />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                            >
                                <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                    <div className="p-4 border-b bg-orange-500 text-white flex justify-between items-center">
                                        <h2 className="text-xl font-bold">{modalMode === 'add' ? 'Add' : 'Edit'} {activeTab.slice(0, -1)}</h2>
                                        <button onClick={() => setShowModal(false)} className="p-1 hover:bg-white/20 rounded">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSave} className="p-6 space-y-4">
                                        {/* USERS FORM */}
                                        {activeTab === 'users' && (
                                            <>
                                                <input type="text" placeholder="Full Name *" value={formData.full_name || ''} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500" required />
                                                <input type="email" placeholder="Email *" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500" required />
                                                <input type="password" placeholder="Password *" value={formData.password || ''} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500" required={modalMode === 'add'} />
                                                <select value={formData.role || 'Donor'} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500">
                                                    <option value="Donor">Donor</option>
                                                    <option value="Volunteer">Volunteer</option>
                                                    <option value="NGO">NGO</option>
                                                </select>
                                                <input type="number" placeholder="Points" value={formData.points || 0} onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500" />
                                                <input type="text" placeholder="Phone" value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500" />
                                                <input type="text" placeholder="City" value={formData.city || ''} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500" />
                                                <input type="text" placeholder="State" value={formData.state || ''} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500" />
                                            </>
                                        )}

                                        {/* TASKS FORM */}
                                        {activeTab === 'tasks' && (
                                            <>
                                                <input type="text" placeholder="Title *" value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500" required />
                                                <textarea placeholder="Description" value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500" rows="3"></textarea>
                                                <input type="text" placeholder="Category *" value={formData.category || ''} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500" required />
                                                <select value={formData.priority || 'medium'} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500">
                                                    <option value="low">Low Priority</option>
                                                    <option value="medium">Medium Priority</option>
                                                    <option value="high">High Priority</option>
                                                    <option value="urgent">Urgent</option>
                                                </select>
                                                <select value={formData.status || 'pending'} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500">
                                                    <option value="pending">Pending</option>
                                                    <option value="in-progress">In Progress</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                                <input type="number" placeholder="Points" value={formData.points || 10} onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500" />
                                                <input type="text" placeholder="City" value={formData.city || ''} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500" />
                                                <input type="text" placeholder="State" value={formData.state || ''} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500" />
                                                <input type="datetime-local" placeholder="Deadline" value={formData.deadline || ''} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500" />
                                            </>
                                        )}

                                        {/* REPORTS FORM */}
                                        {activeTab === 'reports' && (
                                            <>
                                                <input type="text" placeholder="Type (e.g. Flood, Medical) *" value={formData.type || ''} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500" required />
                                                <textarea placeholder="Description" value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500" rows="3"></textarea>
                                                <input type="text" placeholder="Category *" value={formData.category || ''} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500" required />
                                                <select value={formData.urgency || 'medium'} onChange={(e) => setFormData({ ...formData, urgency: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500">
                                                    <option value="low">Low</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="high">High</option>
                                                    <option value="critical">Critical</option>
                                                </select>
                                                <select value={formData.status || 'pending'} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500">
                                                    <option value="pending">Pending</option>
                                                    <option value="verified">Verified</option>
                                                    <option value="resolved">Resolved</option>
                                                </select>
                                                <input type="text" placeholder="City *" value={formData.city || ''} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500" required />
                                                <input type="text" placeholder="State *" value={formData.state || ''} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500" required />
                                                <input type="text" placeholder="Address" value={formData.address || ''} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500" />
                                                <input type="number" placeholder="People Affected" value={formData.people_affected || ''} onChange={(e) => setFormData({ ...formData, people_affected: parseInt(e.target.value) })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500" />
                                            </>
                                        )}

                                        {/* DONATIONS FORM */}
                                        {activeTab === 'donations' && (
                                            <>
                                                <input type="text" placeholder="Title *" value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500" required />
                                                <textarea placeholder="Description" value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500" rows="3"></textarea>
                                                <input type="text" placeholder="Category *" value={formData.category || ''} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500" required />
                                                <input type="text" placeholder="Quantity" value={formData.quantity || ''} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500" />
                                                <input type="number" step="0.01" placeholder="Amount (₹)" value={formData.amount || ''} onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500" />
                                                <select value={formData.status || 'available'} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500">
                                                    <option value="available">Available</option>
                                                    <option value="pledged">Pledged</option>
                                                    <option value="collected">Collected</option>
                                                    <option value="delivered">Delivered</option>
                                                </select>
                                                <input type="text" placeholder="Pickup City" value={formData.pickup_city || ''} onChange={(e) => setFormData({ ...formData, pickup_city: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500" />
                                                <input type="text" placeholder="Pickup State" value={formData.pickup_state || ''} onChange={(e) => setFormData({ ...formData, pickup_state: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500" />
                                                <input type="text" placeholder="Pickup Address" value={formData.pickup_address || ''} onChange={(e) => setFormData({ ...formData, pickup_address: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500" />
                                            </>
                                        )}

                                        <div className="flex space-x-3 pt-4">
                                            <button type="submit" className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600">
                                                <Save className="w-4 h-4" />
                                                <span>Save</span>
                                            </button>
                                            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300">
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminPanel;
