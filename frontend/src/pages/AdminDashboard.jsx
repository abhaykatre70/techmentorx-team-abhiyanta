
import React, { useState } from 'react';
import {
    Users, Package, TrendingUp, Activity,
    CheckCircle, XCircle, AlertCircle, Calendar
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { motion } from 'framer-motion';

// Mock Data
const donationData = [
    { name: 'Mon', donations: 12 },
    { name: 'Tue', donations: 19 },
    { name: 'Wed', donations: 15 },
    { name: 'Thu', donations: 22 },
    { name: 'Fri', donations: 28 },
    { name: 'Sat', donations: 35 },
    { name: 'Sun', donations: 40 },
];

const impactData = [
    { name: 'Food', value: 400 },
    { name: 'Clothes', value: 300 },
    { name: 'Education', value: 300 },
    { name: 'Medical', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="min-h-screen bg-gray-50 font-poppins p-6 md:p-8">

            {/* Header */}
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                    <p className="text-gray-500">Overview of platform activity & impact</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                        Super Admin
                    </span>
                    <img
                        src="https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff"
                        alt="Admin"
                        className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                    />
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { title: 'Total Donations', value: '1,245', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { title: 'Active Volunteers', value: '3,892', icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
                    { title: 'NGOs Verified', value: '142', icon: CheckCircle, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { title: 'Pending Approvals', value: '28', icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
                ].map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow"
                    >
                        <div>
                            <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
                            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                        </div>
                        <div className={`p-4 rounded-xl ${stat.bg}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

                {/* Main Chart */}
                <motion.div
                    className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800">Donation Trends</h3>
                        <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-1 outline-none">
                            <option>Last 7 Days</option>
                            <option>Last Month</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={donationData}>
                                <defs>
                                    <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="donations" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorDonations)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Category Pie Chart */}
                <motion.div
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Impact Categories</h3>
                    <div className="h-60 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={impactData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {impactData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center text overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <span className="block text-2xl font-bold text-gray-800">1.2k</span>
                                <span className="text-xs text-gray-400">Items</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                        {impactData.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                                <span className="text-sm text-gray-600">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Recent Activity & Approvals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Pending Approvals List */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-orange-500" /> Pending Approvals
                    </h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                                <div className="flex items-center gap-4">
                                    <img src={`https://ui-avatars.com/api/?name=NGO+${i}&background=random`} className="w-10 h-10 rounded-full" alt="NGO" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Hope Foundation {i}</h4>
                                        <p className="text-xs text-gray-500">Applied 2h ago</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition">
                                        <CheckCircle className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition">
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Real-time Logs */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-lg text-white">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-green-400" /> Live Activity Feed
                    </h3>
                    <div className="space-y-6 relative ml-2">
                        {/* Timeline Line */}
                        <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-700"></div>

                        {[
                            { text: "Rahul donated 5kg Rice", time: "2 min ago", color: "bg-blue-500" },
                            { text: "Volunteer Priya accepted task #402", time: "15 min ago", color: "bg-green-500" },
                            { text: "New NGO 'Helping Hands' registered", time: "1 hour ago", color: "bg-purple-500" },
                            { text: "Distribution completed at Sector 4", time: "3 hours ago", color: "bg-orange-500" },
                        ].map((log, idx) => (
                            <div key={idx} className="flex items-start gap-4 relative z-10">
                                <div className={`w-4 h-4 rounded-full mt-1 border-2 border-gray-800 ${log.color}`}></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-200">{log.text}</p>
                                    <p className="text-xs text-gray-500">{log.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
